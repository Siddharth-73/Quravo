import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from '@nestjs/event-emitter';

interface RealtimeJwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  role: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @WebSocketServer()
  server!: Server;

  /**
   * Extracts the raw JWT access token from the handshake, checking (in order):
   * 1. `auth.token` sent explicitly by the client during the socket.io handshake
   * 2. The `Authorization: Bearer <token>` header
   * 3. The `quravo_access_token` httpOnly cookie (same cookie used for HTTP auth).
   *    socket.io does not parse cookies automatically, so we parse the raw
   *    `cookie` header manually here.
   */
  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (authToken && typeof authToken === 'string') {
      return authToken;
    }

    const authHeader = client.handshake.headers['authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length);
    }

    const cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader && typeof cookieHeader === 'string') {
      const match = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith('quravo_access_token='));
      if (match) {
        return decodeURIComponent(match.substring('quravo_access_token='.length));
      }
    }

    return null;
  }

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      this.logger.warn(`Client disconnected due to missing auth token: ${client.id}`);
      client.disconnect();
      return;
    }

    let payload: RealtimeJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<RealtimeJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET', 'super_secret_jwt_key_change_in_prod'),
      });
    } catch (err: any) {
      this.logger.warn(`Client disconnected due to invalid/expired auth token: ${client.id} (${err.message})`);
      client.disconnect();
      return;
    }

    if (!payload?.sub || !payload?.tenantId) {
      this.logger.warn(`Client disconnected due to invalid token claims: ${client.id}`);
      client.disconnect();
      return;
    }

    const tenantId = payload.tenantId;
    const userId = payload.sub;

    // branchId is only used to scope which room the client joins - it's not
    // sensitive on its own (tenantId/userId are what gate access), so it's
    // safe to accept it as a client-supplied handshake query param.
    const branchId = client.handshake.query['branchId'] as string | undefined;

    client.data.tenantId = tenantId;
    client.data.userId = userId;

    const rooms = [`tenant:${tenantId}`];
    if (branchId) rooms.push(`tenant:${tenantId}:branch:${branchId}`);
    if (userId) rooms.push(`tenant:${tenantId}:user:${userId}`);

    await client.join(rooms);
    this.logger.log(`Client ${client.id} connected to rooms: ${rooms.join(', ')}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent('appointment.status_changed')
  handleAppointmentStatusChange(payload: any) {
    const { tenantId, branchId } = payload;
    if (this.server) {
      this.server.to(`tenant:${tenantId}:branch:${branchId}`).emit('queue.updated', {
        type: 'appointment.status_changed',
        payload,
      });
      this.server.to(`tenant:${tenantId}`).emit('dashboard.metrics_updated', {
        type: 'appointment',
        payload,
      });
    }
  }

  @OnEvent('payment.collected')
  handlePaymentCollected(payload: any) {
    const { tenantId } = payload;
    if (this.server) {
      this.server.to(`tenant:${tenantId}`).emit('dashboard.metrics_updated', {
        type: 'payment',
        payload,
      });
    }
  }

  @OnEvent('notification.created')
  handleNotificationCreated(payload: any) {
    const { tenantId, userId, message } = payload;
    if (this.server) {
      this.server.to(`tenant:${tenantId}:user:${userId}`).emit('notification', {
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    return { event: 'pong', data: 'hello' };
  }
}

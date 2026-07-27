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
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const tenantId = client.handshake.headers['x-tenant-id'] as string;
    const userId = client.handshake.headers['x-user-id'] as string;
    const branchId = client.handshake.headers['x-branch-id'] as string;

    if (!tenantId) {
      this.logger.warn(`Client disconnected due to missing tenantId: ${client.id}`);
      client.disconnect();
      return;
    }

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

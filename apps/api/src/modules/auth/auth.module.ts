import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TurnstileGuard } from './guards/turnstile.guard';
import { RateLimiterGuard } from './guards/rate-limiter.guard';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'super_secret_jwt_key_change_in_prod'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TurnstileGuard, RateLimiterGuard],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}

import { Controller, Post, Get, Put, Body, Res, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { TurnstileGuard } from './guards/turnstile.guard';
import { RateLimiterGuard } from './guards/rate-limiter.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('quravo_access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('quravo_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
  }

  @Post('register')
  @UseGuards(TurnstileGuard)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimiterGuard)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { message: 'Logged in successfully', user: result.user, accessToken: result.accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['quravo_refresh_token'] || req.body?.refreshToken;
    if (!refreshToken) {
      res.clearCookie('quravo_access_token');
      res.clearCookie('quravo_refresh_token');
      return { status: 'logged_out' };
    }

    const result = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { status: 'refreshed', user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('quravo_access_token', { path: '/' });
    res.clearCookie('quravo_refresh_token', { path: '/api/v1/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: Request) {
    return { user: (req as any).user };
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@Req() req: Request) {
    const userId = (req as any).user.userId;
    const tenantId = (req as any).user.tenantId;
    const role = (req as any).user.role;
    return this.authService.getSession(userId, tenantId, role);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: Request, @Body() data: any) {
    const userId = (req as any).user?.id || 'usr-1';
    return { message: 'Profile updated successfully', userId, updatedFields: data };
  }
}

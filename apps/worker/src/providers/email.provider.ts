import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailJobPayload } from '@quravo/common';

export interface IEmailProvider {
  sendEmail(payload: EmailJobPayload): Promise<void>;
}

@Injectable()
export class EmailProvider implements IEmailProvider {
  private readonly logger = new Logger(EmailProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(payload: EmailJobPayload): Promise<void> {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Quravo Platform <no-reply@quravo.com>',
            to: [payload.to],
            subject: payload.subject,
            html: this.renderEmailHtml(payload),
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Resend API HTTP ${response.status}: ${errText}`);
        }
        this.logger.log(`📧 Sent ${payload.type} email via Resend to ${payload.to}`);
        return;
      } catch (err: any) {
        this.logger.error(`Failed to send email via Resend: ${err.message}`);
        throw err;
      }
    }

    // Dev mode fallback logger
    const actionUrl =
      payload.type === 'verify-email'
        ? payload.verificationUrl
        : payload.type === 'staff-invite'
          ? payload.inviteUrl
          : payload.type === 'password-reset'
            ? payload.resetUrl
            : '';

    this.logger.log(`
================================================================================
📧 [DEV EMAIL CONSOLE PROVIDER]
To: ${payload.to}
Subject: ${payload.subject}
Action URL: ${actionUrl}
================================================================================
    `);
  }

  private renderEmailHtml(payload: EmailJobPayload): string {
    if (payload.type === 'verify-email') {
      return `<h2>Welcome to Quravo, ${payload.firstName}!</h2><p>Please click the link below to verify your account:</p><a href="${payload.verificationUrl}">${payload.verificationUrl}</a>`;
    }
    if (payload.type === 'staff-invite') {
      return `<h2>You've been invited to join ${payload.clinicName}!</h2><p>You have been assigned the <strong>${payload.role}</strong> role. Click below to accept your invitation:</p><a href="${payload.inviteUrl}">${payload.inviteUrl}</a>`;
    }
    return `<h2>Password Reset Request</h2><p>Hi ${(payload as any).firstName || 'there'}, click the link below to reset your password:</p><a href="${(payload as any).resetUrl}">${(payload as any).resetUrl}</a>`;
  }
}

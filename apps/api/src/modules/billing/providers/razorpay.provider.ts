import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

export interface RazorpayOrder {
  id: string;
  amount: number; // in paise (smallest currency unit)
  currency: string;
  status: string;
  receipt?: string;
}

export interface CreateRazorpayOrderParams {
  amountInPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

/**
 * Thin wrapper around the Razorpay REST API (Orders API + signature verification).
 *
 * We deliberately use `fetch` + Basic Auth instead of the `razorpay` npm SDK to
 * match the existing pattern in this codebase for other third-party HTTP calls
 * (see TurnstileGuard, worker's EmailProvider) and avoid an extra dependency for
 * what is a very small surface area (create order + verify signature).
 */
@Injectable()
export class RazorpayProvider {
  private readonly logger = new Logger(RazorpayProvider.name);
  private readonly baseUrl = 'https://api.razorpay.com/v1';

  constructor(private readonly configService: ConfigService) {}

  private getCredentials() {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    return { keyId, keySecret };
  }

  isConfigured(): boolean {
    const { keyId, keySecret } = this.getCredentials();
    return Boolean(keyId && keySecret);
  }

  getPublicKeyId(): string | undefined {
    return this.getCredentials().keyId;
  }

  /**
   * Creates a Razorpay Order. Amount must be in the smallest currency unit
   * (paise for INR, i.e. amount * 100).
   */
  async createOrder(params: CreateRazorpayOrderParams): Promise<RazorpayOrder> {
    const { keyId, keySecret } = this.getCredentials();
    if (!keyId || !keySecret) {
      throw new InternalServerErrorException(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      );
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amountInPaise,
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      this.logger.error(`Razorpay order creation failed: ${response.status} ${errText}`);
      throw new InternalServerErrorException('Failed to create Razorpay order.');
    }

    return (await response.json()) as RazorpayOrder;
  }

  /**
   * Verifies the signature Razorpay's Checkout.js returns to the client after a
   * successful payment: HMAC_SHA256(order_id + "|" + payment_id, key_secret).
   * This proves the payment_id/order_id pair was genuinely signed by Razorpay,
   * but does NOT by itself prove it belongs to a given invoice/tenant — callers
   * must additionally check the order_id against their own stored pending payment.
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const { keySecret } = this.getCredentials();
    if (!keySecret) return false;

    const expected = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');

    return expected === signature;
  }

  /**
   * Verifies a Razorpay webhook payload signature using the separate webhook
   * secret configured in the Razorpay dashboard (Settings > Webhooks).
   * `rawBody` must be the exact, unparsed request body bytes/string.
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.warn('RAZORPAY_WEBHOOK_SECRET not configured — rejecting webhook.');
      return false;
    }

    const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    return expected === signature;
  }
}

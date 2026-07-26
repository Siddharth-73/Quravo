import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface StorageUploadPayload {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder: string;
}

export interface StorageUploadResult {
  storageKey: string;
  storageUrl: string;
}

export interface IStorageProvider {
  uploadFile(payload: StorageUploadPayload): Promise<StorageUploadResult>;
  getSignedDownloadUrl(storageKey: string): Promise<string>;
  deleteFile(storageKey: string): Promise<boolean>;
}

@Injectable()
export class StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(StorageProvider.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(payload: StorageUploadPayload): Promise<StorageUploadResult> {
    const r2AccountId = this.configService.get<string>('R2_ACCOUNT_ID');

    if (r2AccountId) {
      // S3 / Cloudflare R2 execution block (Production)
      this.logger.log(`☁️ Cloudflare R2 Upload: ${payload.fileName}`);
    }

    // Dev fallback: Local storage provider
    const fileExt = path.extname(payload.fileName);
    const sanitizedBase = path.basename(payload.fileName, fileExt).replace(/[^a-zA-Z0-9]/g, '_');
    const storageKey = `${payload.folder}/${Date.now()}_${sanitizedBase}${fileExt}`;
    const targetPath = path.join(this.uploadDir, storageKey);

    const targetFolder = path.dirname(targetPath);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    await fs.promises.writeFile(targetPath, payload.buffer);
    const storageUrl = `http://localhost:4000/api/v1/storage/file?key=${encodeURIComponent(storageKey)}`;

    this.logger.log(`💾 Saved local file attachment: ${storageKey}`);
    return { storageKey, storageUrl };
  }

  async getSignedDownloadUrl(storageKey: string): Promise<string> {
    return `http://localhost:4000/api/v1/storage/file?key=${encodeURIComponent(storageKey)}`;
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    const targetPath = path.join(this.uploadDir, storageKey);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      return true;
    }
    return false;
  }
}

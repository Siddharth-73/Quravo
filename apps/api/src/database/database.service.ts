import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabaseClient, Database } from '@quravo/db';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public db!: Database;
  private client: any;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const connectionString =
      this.configService.get<string>('DATABASE_URL') ||
      'postgres://quravo:quravo_secret@localhost:5432/quravo_db';

    const { db, client } = createDatabaseClient({ connectionString });
    this.db = db;
    this.client = client;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
    }
  }
}

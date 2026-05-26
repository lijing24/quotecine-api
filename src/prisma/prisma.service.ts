import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Vercel serverless: ensure env is loaded before PrismaClient init
    const databaseUrl = process.env.DATABASE_URL;
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

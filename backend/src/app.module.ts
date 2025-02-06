import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'ecommerce',
      entities: [],
      synchronize: true, // À désactiver en production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

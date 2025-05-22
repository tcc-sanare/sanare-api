import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from './http/http.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    EnvModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

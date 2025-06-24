import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Global()
@Module({
  providers: [EnvService],
  exports: [EnvService],
  imports: [
    ConfigModule.forRoot({
      validationSchema: {
        validate: envSchema.parse,
      }
    })
  ]
})
export class EnvModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.Guard';
import { MailModule } from './mail/mail.module';



@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
    type:"postgres",
    autoLoadEntities:true,
    synchronize:true,
    port:5432,
    host:'localhost',
    username:'postgres',
    password:'postgres',
    // entities:[User],
    database:'youtube'
  }),
    MailModule,
    ],
  providers: [],
  // providers:[{
  //   provide:APP_GUARD,
  //   useClass:JwtAuthGuard
  // }]
 
})
export class AppModule {}

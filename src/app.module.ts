import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forRoot({
    type:"postgres",
    autoLoadEntities:true,
    synchronize:true,
    port:5432,
    host:'localhost',
    username:'postgres',
    password:'postgres',
    // entities:[Task],
    database:'youtube'
  }),AuthModule],
 
})
export class AppModule {}

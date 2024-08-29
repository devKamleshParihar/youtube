import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtAuthGuard } from 'src/auth/auth.Guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  
  imports:[AuthModule],
  controllers: [UserController],
  providers: [UserService,JwtAuthGuard]
})
export class UserModule {}

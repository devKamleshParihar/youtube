import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthMiddleware } from './auth.middleware';
import { JwtAuthGuard } from './auth.Guard';


@Module({
  imports:[
    
    JwtModule.register({
    secret:'Youtube and auth secret key',
    signOptions:{
      expiresIn:'1h'
    }
  }),
  TypeOrmModule.forFeature([User]),],
  providers: [AuthService,JwtAuthGuard],
  controllers: [AuthController],
  exports:[AuthService,JwtModule]
})
export class AuthModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware)
    .forRoutes({path:'/auth/profile',method:RequestMethod.ALL})
  }
}

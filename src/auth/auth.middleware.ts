import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private JwtService:JwtService,private AuthService:AuthService){}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['AccessToken']
    if(!token){
      throw new UnauthorizedException('No JWT token provided')
    }
    try {
      const decoded = this.JwtService.verify(token)
      const user = await this.AuthService.validateUser(decoded.email)
      if(!user || !user.status){
        throw new UnauthorizedException('User is not verified or not found');
      }
      req.user = user;
      next();
      
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not verified');
    }
    
  }
}

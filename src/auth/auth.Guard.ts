import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private JwtService:JwtService,private AuthService:AuthService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.cookies['AccessToken'] 
        try {
            const decoded = await this.JwtService.verify(token)
            const user = await this.AuthService.findUserByEmail(decoded.email)
            if (!user || !user.status) {
                throw new UnauthorizedException('User is not verified or not found');
            }
            request.user = user
            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid token or user not verified');

        }
    
    }

}
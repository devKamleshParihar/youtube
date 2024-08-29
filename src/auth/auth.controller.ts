import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './DTO/create.user.dto';
import { User } from './user.entity';
import { Response } from 'express';
import { emit } from 'process';

@Controller('auth')
export class AuthController {
    constructor(private AuthService:AuthService){}

    @Post('/register')
    Register(@Body()  CreateUserDTO:CreateUserDTO ){
         return this.AuthService.Register(CreateUserDTO)
    }

    @Post('/login')
    async Login(@Body() CreateUserDTO:CreateUserDTO ,@Res() res:Response){
        const token = await this.AuthService.Login(CreateUserDTO)
        // return token
        try {
            res.cookie('AccessToken',token.AccessToken,{httpOnly:true})
            return res
            .status(HttpStatus.OK)
            .json({ message: 'OTP sent to your email. Please verify.' });
        } catch (error) {
            return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Invalid credentials' });
        }
    }

    @Post('/verify-otp')
    async VerifyOTP(@Body() data:{email:string,otp:string},@Res() res:Response){
        try {
            console.log(data);
            
            const isVerified = await this.AuthService.verifyOTP(data.email,data.otp)
            if (isVerified) {
                return res
                  .status(HttpStatus.OK)
                  .json({ message: 'OTP verified successfully, user logged in.' });
              }
            }
            catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Get('/profile')
    GetUserProfile(){
        return 'This is a user dash board'
    }
    @Get('/profile/user')
    GetProfile(){
        return 'check middleware'
    }
   
    
}

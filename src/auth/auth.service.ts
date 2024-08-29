import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './DTO/create.user.dto';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
    constructor(private JwtService:JwtService ,
        @InjectRepository(User) private UserRepository:UserRepository){}

    async Register(CreateUserDTO:CreateUserDTO):Promise<string>{
        const {username,password,email} = CreateUserDTO
        
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = this.UserRepository.create({
            email,
            username,
            password:hashedPassword
        })
        try {
            await this.UserRepository.save(user)
            return "user register successfully"
        } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException('Username and email is already exists')
            }else{
                throw new InternalServerErrorException()
            }
        }
    }

    async generateJwtToken(user: User): Promise<string> {
        const payload = { email: user.email, id: user.id };
        return this.JwtService.sign(payload);
      }

    async Login(CreateUserDTO:CreateUserDTO):Promise<{AccessToken:string}>{
        const {username,password,email} = CreateUserDTO
        const user = await this.UserRepository.findOne({where:{email,username}})
        if(user && await bcrypt.compare(password,user.password)){
            // const payload = {email:user.email,id:user.id}
            // return  {AccessToken :  this.JwtService.sign(payload)}
            await this.sendOTP(user.email)
            return {AccessToken:await this.generateJwtToken(user)}
        }  
        throw new UnauthorizedException('please check your login credentials')            
    }

    async validateUser(email:string):Promise<User>{
        const user = this.UserRepository.findOne({where:{email}})
        if(!user){
            throw new UnauthorizedException('invalid user')
        }
        return user
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return this.UserRepository.findOne({ where: { email } });
      }

    async generateOTP(length = 6): Promise<string> {
        return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');  
    }

    async sendOTP(email: string): Promise<void> {
        const user = await this.findUserByEmail(email);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        // Generate OTP
        const otp = await this.generateOTP();
        user.otp = otp;
    
        // Save OTP to user record
        await this.UserRepository.save(user);
    
        // Log OTP (for testing purposes, replace with email service in production)
        console.log(`Generated OTP for user ${email}: ${otp}`);
      }
    
    async verifyOTP(email: string, otp: string): Promise<boolean> {
        const user = await this.findUserByEmail(email);
        // console.log(otp);
        
        if (!user || user.otp !== otp) {
          throw new NotFoundException('Invalid OTP');
        }
    
        // OTP matches, verify user
        user.status = true;
        user.otp = null; // Clear OTP after successful verification
        await this.UserRepository.save(user);
        
        return true;
    }

}

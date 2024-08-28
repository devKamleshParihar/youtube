import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './DTO/create.user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private JwtService:JwtService ,
        @InjectRepository(User) private UserRepository:UserRepository){}

    async Register(CreateUserDTO:CreateUserDTO):Promise<String>{
        const {username,password} = CreateUserDTO
        const Salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,Salt)

        const user = this.UserRepository.create({
            username,
            password:hashedPassword
        })
        try {
            await this.UserRepository.save(user)
            return "user register successfully"
        } catch (error) {
            if(error.code === '23505'){
                throw new ConflictException('Username is already exists')
            }else{
                throw new InternalServerErrorException()
            }
        }
    }

    async Login(CreateUserDTO:CreateUserDTO):Promise<{AccessToken:string}>{
        const {username,password} = CreateUserDTO
        const user = await this.UserRepository.findOne({where:{username}})
        if(user && await bcrypt.compare(password,user.password)){
            const payload = {name:username,id:user.id}
            return  {AccessToken :  this.JwtService.sign(payload)}
        }  
        throw new UnauthorizedException('please check your login credentials')            
    }

    async validateUser(payload:any):Promise<User>{
        const user = this.UserRepository.findOne({where:{id:payload.id}})
    }

}

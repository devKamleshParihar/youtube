import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.Guard';


@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    // constructor(private)
    @Get()
    GetUser(@Req() req:Request){
        const user = req.use
        return user+"done"
    }
}

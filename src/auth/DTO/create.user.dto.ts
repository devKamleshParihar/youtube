import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDTO  {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message:"The password is too weak"})
    password:string
}
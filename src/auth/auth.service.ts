import { Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AppLogger } from 'src/logger/logger.service';
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from './dto/loginUserDto';


@Injectable()
export class AuthService {

    constructor (
        private readonly userService : UserService,
        private readonly logger : AppLogger,
        private jwtService  : JwtService
    ){
        this.logger.setContext(AuthService.name);
    }

    async registerUser(registerUserDto : RegisterUserDto){

        // now make logic for registering user
        /**
         * 1. Check if email already exists or not
         * 2. verify the email first
         * 3. hash the pasword
         * 4. create the user in database
         * 5. generate token
         * 6. send the token as response
         * **/
        const saltRounds =10;
        const hash = await bcrypt.hash(registerUserDto.password!, saltRounds );
        const user = await this.userService.createUser( { ...registerUserDto, password: hash});
        this.logger.log({ event: 'user_registered', userId: user?._id }, AuthService.name);

        //user --- created --- now generate token for clients
        // const payload = {sub : user._id, email: user.email};
        //  const token = await this.jwtService.signAsync(payload);
         const { accessToken , refreshToken} = await this.generateTokens(
            String(user._id), user.email, user.role);
        // return user;
        return {
            accessToken : accessToken,
            refreshToken : refreshToken
        }    
    }

    async loginUser( loginUserDto : LoginUserDto){
         const user =await this.userService.findByEmail(loginUserDto.email);

         if(!user){
            throw new UnauthorizedException("Invalid credentials");
         }

         const isMatch =await bcrypt.compare(loginUserDto.password, user.password);
         if(!isMatch){
            throw new UnauthorizedException("Invalid credentials");
         }

         const { accessToken , refreshToken} = 
                await this.generateTokens(String(user._id), user.email, user.role);

         return {
            accessToken, refreshToken
         }

    }

    //methods to generate access token and refresh token
    private async generateTokens(userId: string, email: string, role: string){
        const payload = { sub : userId, email : email, role : role };

        const accessToken = await this.jwtService.signAsync(payload,{
            secret: process.env.JwtSecret,
            expiresIn: "300s"
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret : process.env.JwtRefreshSecret,
            expiresIn : "7d"
        });

        return { accessToken, refreshToken };
    }
}

import { Controller, Post , Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AppLogger } from 'src/logger/logger.service';
import { LoginUserDto } from './dto/loginUserDto';
import { Public } from 'src/common/public.decorator';
import { Throttle, ThrottlerGuard} from "@nestjs/throttler";

@Controller('auth')
export class AuthController {
    authservice : AuthService;
    logger : AppLogger;

    constructor( authservice :  AuthService, logger: AppLogger){
        this.authservice = authservice;
        this.logger = logger.setContext(AuthController.name);
    }

    @Post("register")
    @Public()
    register( @Body () registerUserDto : RegisterUserDto){
        //no logic inside controller 
        // only request resposne and make it short
        // return { message : "user regsitered successfully"};
        //now -- used service
       this.logger.log({ event: 'register_request', email: registerUserDto.email }, AuthController.name);
       const result = this.authservice.registerUser(registerUserDto);
       return result;
    }


    @Throttle({
    short: {
        limit: 3,
        ttl: 10000,
    },
    })
    @UseGuards(ThrottlerGuard)
    @Post("login")
    @Public()
    login( @Body () loginUserDto : LoginUserDto){

        return this.authservice.loginUser(loginUserDto);
    }
}

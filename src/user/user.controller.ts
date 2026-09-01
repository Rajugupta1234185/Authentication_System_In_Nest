import { Controller,Get, Request} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService : UserService){}

    @Get("profile")
    async getUserProfile(@Request() req){
        //since it is the controller you dont
        //have to manipulate data here
        const userId = req.user.sub;

        return this.userService.getUserProfile(userId);
    }
}

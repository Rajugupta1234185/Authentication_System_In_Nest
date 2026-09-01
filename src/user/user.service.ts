import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';


@Injectable()
export class UserService {

    //import user model here
    constructor(@InjectModel (User.name) private UserModel : Model<User>){}

    async createUser( registerUserDto :RegisterUserDto){
        try{
            return await this.UserModel.create(registerUserDto);
        }
        catch(err){
            const e = err as { code ?: number};
            if(e.code === 11000){
                throw new ConflictException("Email already Exists");
            }

            throw err;
        }
    }

    //controller to find user by email
     findByEmail( email: string){
        return  this.UserModel.findOne({ email : email}); 
    }

    async getUserProfile( userId: string){

        const user = await this.UserModel.findById(new mongoose.Types.ObjectId(userId));
        if(!user) throw new NotFoundException("User not found");
        console.log(user);
        return user;
    }
}

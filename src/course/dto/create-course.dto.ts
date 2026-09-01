import {  IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateCourseDto {

@IsNotEmpty()
@IsString()
  name!: string;


@IsString()
  description!: string;


@IsEmail()
  level! : string;

@IsNotEmpty()
@IsString()
  price! : number;  
}
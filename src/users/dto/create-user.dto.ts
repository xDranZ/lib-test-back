import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Luis Pastenes' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'student' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'luis@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

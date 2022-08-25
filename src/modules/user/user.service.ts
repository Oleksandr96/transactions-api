import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { UserResponseInterface } from '@app/modules/user/types/userResponse.interface';
import { LoginUserDto } from '@app/modules/user/dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    
    const createdUser = await this.userRepository.save(newUser);
    delete createdUser.password;

    return createdUser;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'email', 'password'],
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const passwordIsCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new HttpException(
        'Wrong password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;

    return user;
  }

  findByID(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}

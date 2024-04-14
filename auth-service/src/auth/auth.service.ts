import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { RegisterUserDto } from './dto/register-user.dto';
import { uid } from 'uid';
import { TokenDto } from './dto/token.dto';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<TokenDto> {
    const user = await this.usersService.getUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatch = await argon2.verify(user?.password, pass + user.salt);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const iat = Math.round(new Date().getTime() / 1000);
    const payload = {
      sub: user.id,
      iat,
      name: user.name,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: 3600,
      }),
      expires_in: 3600,
    };
  }

  async register(registerDto: RegisterUserDto): Promise<TokenDto> {
    const salt = uid(16);
    const hash = await argon2.hash(registerDto.password + salt);
    try {
      const user = await this.usersService.createUser({
        email: registerDto.email,
        name: registerDto.name,
        password: hash,
        salt,
      });

      const iat = Math.round(new Date().getTime() / 1000);
      const payload = {
        sub: user.id,
        iat,
        name: user.name,
        email: user.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: 3600,
        }),
        expires_in: 3600,
      };
    } catch (e) {
      throw new BadRequestException('EMAIL_EXISTED');
    }
  }
}

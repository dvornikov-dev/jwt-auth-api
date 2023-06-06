import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { KEY_LEN, SALT_LEN } from './auth.constats';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { AccessTokenResponse, TokensResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async registration(
    login: string,
    password: string,
  ): Promise<TokensResponse> {
    const candidate = await this.userService.findByLogin(login);

    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await this.userService.create({
      login,
      password: passwordHash,
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        login: user.login,
      });

    await this.tokenService.saveToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async login(login: string, password: string): Promise<TokensResponse> {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new BadRequestException('Wrong login or password');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong login or password');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        login: user.login,
      });

    await this.tokenService.saveToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async logout(refreshToken: string) {
    const result = await this.tokenService.deleteToken(refreshToken);
    return result;
  }

  public async refresh(refreshToken: string): Promise<AccessTokenResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findByLogin(payload.login);

    if (!user || user.login !== payload.login) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.tokenService.generateAccessToken({
      login: user.login,
    });

    return {
      accessToken,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LEN);

    const passwordHash = (await promisify(scrypt)(
      password,
      salt,
      KEY_LEN,
    )) as Buffer;

    return `${salt.toString('base64')}$${passwordHash.toString('base64')}`;
  }

  private async validatePassword(password: string, saltHash: string) {
    const [salt, hash] = saltHash.split('$');

    const passwordHash = (await promisify(scrypt)(
      password,
      Buffer.from(salt, 'base64'),
      KEY_LEN,
    )) as Buffer;

    return timingSafeEqual(passwordHash, Buffer.from(hash, 'base64'));
  }
}

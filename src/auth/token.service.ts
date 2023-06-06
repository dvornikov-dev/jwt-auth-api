import { Injectable } from '@nestjs/common';
import { RefreshToken } from './schemas/refresh-token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, TokensResponse } from './auth.types';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from './auth.constats';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async saveToken(
    user: User,
    refreshToken: string,
  ): Promise<RefreshToken> {
    const tokenData = await this.refreshTokenModel.findOne({ user });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return this.refreshTokenModel.create({ user, refreshToken });
  }

  public async findToken(refreshToken: string): Promise<RefreshToken> {
    return this.refreshTokenModel.findOne({ refreshToken });
  }

  public async deleteToken(refreshToken: string) {
    return this.refreshTokenModel.deleteOne({ refreshToken });
  }

  public async generateTokens(payload: IJwtPayload): Promise<TokensResponse> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwtRefreshSecret'),
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  public async validateRefreshToken(
    refreshToken: string,
  ): Promise<IJwtPayload | null> {
    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('app.jwtRefreshSecret'),
        },
      );
      return payload;
    } catch (e) {
      return null;
    }
  }

  public async validateAccessToken(
    accessToken: string,
  ): Promise<IJwtPayload | null> {
    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(
        accessToken,
      );
      return payload;
    } catch (e) {
      return null;
    }
  }
}

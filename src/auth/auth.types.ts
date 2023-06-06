export interface IJwtPayload {
  login: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

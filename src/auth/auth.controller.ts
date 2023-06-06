import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { REFRESH_COOKIE_MAX_AGE, REFRESH_COOKIE_NAME } from './auth.constats';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() registrationDto: RegistrationDto,
    @Res() res: FastifyReply,
  ) {
    const { login, password } = registrationDto;

    const { accessToken, refreshToken } = await this.authService.registration(
      login,
      password,
    );

    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_COOKIE_MAX_AGE,
      path: '/',
    });

    return res.send({ accessToken });
  }

  @Post('/signin')
  async signin(@Body() loginDto: LoginDto, @Res() res: FastifyReply) {
    const { login, password } = loginDto;

    const { accessToken, refreshToken } = await this.authService.login(
      login,
      password,
    );

    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_COOKIE_MAX_AGE,
      path: '/',
    });

    return res.send({ accessToken });
  }

  @Post('/logout')
  async logout(@Req() request: FastifyRequest, @Res() res: FastifyReply) {
    const { refreshToken } = request.cookies;

    await this.authService.logout(refreshToken);

    res.clearCookie(REFRESH_COOKIE_NAME);

    return res.send({ message: 'Logged out' });
  }

  @Post('/refresh')
  async refresh(@Req() request: FastifyRequest, @Res() res: FastifyReply) {
    const { refreshToken } = request.cookies;

    const { accessToken } = await this.authService.refresh(refreshToken);

    return res.send({ accessToken });
  }
}

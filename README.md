## Description

Стек:

Nest.js

Mongoose: MongoDB хранение данных о пользователях и рефреш токен.

Redis: хранение сгенерированных записей.

Access и Refresh токены: Jwt токены. Access токен передается в заголовках и используется для доступа к апи.

Refresh токен хранится в httpOnly куках.При каждом запросе на обновление Access токена, проверяется наличие Refresh токена в куках.

При первой инициализации генерируется 20 записей в Redis.

## API

### POST /auth/signin

Авторизация пользователя. Возвращает Access и Refresh токены.

### POST /auth/signup

Регистрация пользователя. Возвращает Access и Refresh токены.

### POST /auth/refresh

Обновление Access токена. Проверяет Refresh токен и возвращает новый Access токен.

### POST /auth/logout

Удаление Refresh токена из кук.

### GET /data/random

Возвращает случайные 10 записей из Redis. AuthGuard.

### GET /data/all

Возвращает все записи из Redis. AuthGuard.

## Installation

```bash
$ yarn install
```

## Running the app

```bash

# watch mode
$ docker compose up

```

## License

Nest is [MIT licensed](LICENSE).

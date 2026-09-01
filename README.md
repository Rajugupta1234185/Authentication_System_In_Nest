# Authentication System in NestJS

A secure NestJS backend implementing JWT authentication, role-based access control (RBAC), a global authentication guard, public route handling, rate limiting (throttling), input validation, Pino logging, and a global exception filter.

## Tech Stack

- **NestJS 11** (Express)
- **MongoDB** via Mongoose
- **JWT** (`@nestjs/jwt`) for access + refresh tokens
- **bcrypt** for password hashing
- **class-validator** for DTO validation
- **@nestjs/throttler** for rate limiting
- **nestjs-pino** for structured logging
- **Jest** + **Supertest** for testing

## Project Structure

```
src/
├── main.ts                     # Bootstrap (CORS, logger, port)
├── app.module.ts               # Root module (Mongo, Throttler, Global Guard/Filter)
├── auth/                       # JWT auth, RBAC, global AuthGuard
│   ├── auth.controller.ts      # /auth/register, /auth/login, /auth/refresh
│   ├── auth.service.ts
│   ├── auth.guard.ts           # Registered globally via APP_GUARD
│   ├── auth.module.ts
│   ├── roles.decorator.ts      # @Roles('admin')
│   ├── public.decorator.ts     # @Public() to bypass guard
│   ├── constants.ts
│   └── dto/loginUserDto.ts
├── user/                       # Mongoose User schema + service
│   ├── schemas/user.schema.ts
│   ├── user.service.ts
│   ├── user.module.ts
│   └── user.types.ts
├── course/                     # Sample protected resource module
│   ├── course.module.ts
│   ├── course.service.ts
│   └── schemas/course.schema.ts
├── common/                     # Shared decorators / utilities
├── filters/globalException.filter.ts
├── config/logger.config.ts
└── logger/                     # AppLoggerModule (Pino)
```

## Prerequisites

- **Node.js** ≥ 18 (NestJS 11 + Mongoose 9 recommend Node 20+)
- **npm** (or pnpm/yarn)
- A **MongoDB** instance — local or Atlas (a connection string is already in `.env`)

## Step-by-step: Run the project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The project already ships a `.env` file. Edit `D:\Nest\auth\.env` if needed:

```env
# Connection string for your MongoDB (local or Atlas)
MongoDbConnectionString=mongodb+srv://USER:PASS@cluster.mongodb.net/NestAuthProject

# Secrets used by JWT signing
JwtSecret=ThisIsMyBaby1234
JwtRefreshSecret=Theisincauewjn527hnej
```

> Note: `main.ts` also calls `dns.setServers(['8.8.8.8', '8.8.4.4'])` so DNS resolves correctly on networks where MongoDB Atlas SRV records fail.

### 3. Run in development (hot reload)

```bash
npm run start:dev
```

The server listens on `http://localhost:3000` (override via `PORT` in `.env`).

### 4. Build for production

```bash
npm run build
npm run start:prod
```

`start:prod` runs the compiled output from `dist/main.js`.

### 5. Other useful scripts

```bash
npm run lint          # ESLint + Prettier auto-fix
npm run format        # Prettier write
npm test             # Unit tests (Jest)
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report
```

## API endpoints

A global `AuthGuard` is registered via `APP_GUARD`, so **every route is protected by default**. Mark public routes with the `@Public()` decorator; enforce roles with `@Roles(...)`.

### Auth (`/auth`)

| Method | Path | Auth | Roles | Body |
| ------ | ---- | ---- | ----- | ---- |
| POST   | `/auth/register` | Public | — | `{ email, password, role? }` |
| POST   | `/auth/login`    | Public | — | `{ email, password }` (see `loginUserDto.ts`) |
| POST   | `/auth/refresh`  | Public | — | refresh token |

### Courses (`/course`)

Sample protected resource — requires a valid JWT; certain routes require specific roles (see `course.controller.ts` / service for details).

## Security features included

- **Global JWT guard** — every request must carry a valid token unless `@Public()` is set
- **RBAC** — `@Roles('admin' | 'user')` decorator
- **Rate limiting** — 3 req/sec, 20 req/10s, 100 req/min (throttler)
- **bcrypt** password hashing
- **class-validator** request validation via DTOs
- **Global exception filter** — uniform error responses
- **Pino structured logging** (rotated files via `file-stream-rotator`, see `config/logger.config.ts` and the `logs/` folder)

## Troubleshooting

- **Mongo connection error** — verify `MongoDbConnectionString` in `.env` and that your IP is allow-listed in Atlas.
- **DNS lookup failed (SRV)** — `main.ts` already pins DNS to Google's 8.8.8.8 / 8.8.4.4. If still failing, switch the connection string to the non-SRV `mongodb://` form.
- **401 on every request** — expected. Send `Authorization: Bearer <jwt>` or mark the route with `@Public()`.
- **bcrypt build errors on Windows** — ensure the Node version matches your toolchain; run `npm rebuild bcrypt` if needed.
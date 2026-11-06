# CommerceHub Backend

CommerceHub is a multi-tenant e-commerce and inventory management SaaS platform.

This directory contains the Laravel REST API. The backend owns authentication, authorization, tenant isolation, business rules, validation and persistence.

## Technology

- PHP 8.5
- Laravel 13
- Composer 2
- PostgreSQL 18
- Laravel Sanctum (planned)
- Pest 4
- Laravel Pint

## Architecture

The backend follows a modular monolith architecture.

The API uses the `/api/v1` prefix. The React frontend consumes the API independently.

## Prerequisites

- Windows 11
- Docker Desktop with Docker Compose
- Git
- CommerceHub PHP image: `commercehub-php:8.5`

PHP and Composer do not need to be installed globally on Windows.

## Initial setup

Run commands from the repository root.

### 1. Start PostgreSQL

```powershell
docker compose up -d postgres
docker compose ps
```

Wait until PostgreSQL reports `healthy`.

### 2. Configure Laravel

Create `backend/.env` from the example only if it does not already exist.

```powershell
if (-not (Test-Path .\backend\.env)) {
    Copy-Item .\backend\.env.example .\backend\.env
}
```

Configure the Laravel database settings to match the root `.env` file:

| Laravel setting | Root setting |
|---|---|
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | `commercehub-postgres` |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | `POSTGRES_DB` |
| `DB_USERNAME` | `POSTGRES_USER` |
| `DB_PASSWORD` | `POSTGRES_PASSWORD` |

Never commit environment files or expose database credentials.

### 3. Generate the application key

```powershell
$RepoPath = (Get-Location).Path
docker run --rm --mount "type=bind,source=$RepoPath,target=/workspace" --workdir /workspace/backend commercehub-php:8.5 php artisan key:generate
```

### 4. Verify database connectivity

```powershell
$RepoPath = (Get-Location).Path
docker run --rm --network commercehub_default --mount "type=bind,source=$RepoPath,target=/workspace" --workdir /workspace/backend commercehub-php:8.5 php artisan db:show --database=pgsql
```

No CommerceHub domain tables are expected during this foundation increment.

## Running the API

```powershell
$RepoPath = (Get-Location).Path
docker run --rm --network commercehub_default --mount "type=bind,source=$RepoPath,target=/workspace" --workdir /workspace/backend -p 8000:8000 commercehub-php:8.5 php artisan serve --host=0.0.0.0 --port=8000
```

API base URL: `http://localhost:8000`.

## Health endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health/live` | Confirms the API process is responding |
| GET | `/api/v1/health/ready` | Checks database connectivity |

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/health/live
Invoke-RestMethod http://localhost:8000/api/v1/health/ready
```

## Testing

Run Pest:

```powershell
$RepoPath = (Get-Location).Path
docker run --rm --network commercehub_default --mount "type=bind,source=$RepoPath,target=/workspace" --workdir /workspace/backend commercehub-php:8.5 ./vendor/bin/pest
```

Check formatting:

```powershell
$RepoPath = (Get-Location).Path
docker run --rm --mount "type=bind,source=$RepoPath,target=/workspace" --workdir /workspace/backend commercehub-php:8.5 ./vendor/bin/pint --test
```

## Current scope

- Laravel 13 application scaffold.
- Versioned API routing.
- Liveness and database-readiness endpoints.
- PostgreSQL connectivity.
- Pest testing baseline.
- Laravel Pint formatting checks.

Authentication, memberships, tenant isolation, catalogue, inventory, orders and payments belong to future increments.

## Engineering principles

- Backend-authoritative business rules and validation.
- Deny access by default.
- Enforce tenant isolation on the server.
- Use transactions for critical business operations.
- Never trust frontend payment confirmation.
- Do not expose secrets or sensitive internal errors.
- Preserve existing functionality as the application evolves.

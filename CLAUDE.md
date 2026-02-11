# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Salesforce OAuth 2.0 Web Server Flow demo with PKCE (Proof Key for Code Exchange). Node.js/Express app that authenticates users via Salesforce and lets them create Lead records through the Salesforce REST API. Includes Docker containerization and Terraform-based AWS ECS Fargate deployment.

## Commands

- `npm start` -- run the server (production)
- `npm run dev` -- run with nodemon (auto-reload on changes)
- `docker build -t sf-oauth-demo .` -- build Docker image
- `docker compose up` -- run via Docker Compose (loads `.env`, sets `NODE_ENV=production`)
- `./deploy.sh` -- full AWS deployment (build, push to ECR, Terraform apply)

## Architecture

### Source Layout

- `src/server.js` -- Express app, route definitions, session config
- `src/auth/oauth.js` -- OAuth flow: PKCE generation, authorization redirect, token exchange, session management
- `src/salesforce/api.js` -- Salesforce REST API calls (user info, Lead creation via `/services/data/v59.0/sobjects/Lead`)
- `public/login.html` -- login page (redirects to `/auth/salesforce`)
- `public/app.html` -- authenticated page with Lead creation form

### Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Serves login page |
| GET | `/auth/salesforce` | No | Initiates OAuth flow (PKCE code_verifier/challenge, redirects to Salesforce) |
| GET | `/oauth/callback` | No | Handles Salesforce redirect, exchanges auth code for access token |
| GET | `/app` | Yes | Serves Lead creation form (protected by `requireAuth` middleware) |
| GET | `/api/user` | Yes | Returns current Salesforce user info |
| POST | `/api/lead` | Yes | Creates a Lead in Salesforce (requires `lastName` and `company`) |
| POST | `/api/logout` | No | Destroys session |
| GET | `/health` | No | Health check endpoint |

### OAuth Flow (PKCE)

1. `GET /auth/salesforce` generates `code_verifier`, derives `code_challenge` (SHA-256), stores in session
2. Redirects to Salesforce authorize endpoint with `code_challenge` and `state`
3. Salesforce redirects back to `/oauth/callback` with auth `code`
4. Server exchanges `code` + `code_verifier` for access token
5. Token and instance URL stored in `express-session`, user redirected to `/app`

## Environment Variables

Required in `.env` (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `SF_CLIENT_ID` | Yes | Salesforce Connected App consumer key |
| `SF_CLIENT_SECRET` | Yes | Salesforce Connected App consumer secret |
| `SF_CALLBACK_URL` | Yes | OAuth callback URL (e.g., `http://localhost:3000/oauth/callback`) |
| `SF_LOGIN_URL` | No | Defaults to `https://login.salesforce.com` |
| `PORT` | No | Defaults to `3000` |
| `SESSION_SECRET` | Prod | Required in production; uses insecure default in dev |
| `NODE_ENV` | No | Set to `production` for secure cookies |

## Infrastructure

- `Dockerfile` -- Node 18 Alpine, non-root user, health check on `/health`
- `docker-compose.yml` -- single service, reads `.env`, port 3000
- `terraform/` -- AWS VPC, ALB, ECS Fargate cluster, Secrets Manager integration
- `deploy.sh` -- orchestrates Docker build, ECR push, and Terraform apply

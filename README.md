# Ops Pulse Dashboard

Ops Pulse Dashboard is an enterprise-style **React Native + Expo + React Native Web** admin console for operating the Ops Pulse GitHub-to-Telegram notification system.

The dashboard helps administrators manage GitHub repositories, Telegram destinations, notification routes, notification delivery attempts, webhook events, and Telegram bot registration flows from one responsive UI.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Backend API Integration](#backend-api-integration)
- [Telegram Registration Flow](#telegram-registration-flow)
- [GitHub Webhook Tester](#github-webhook-tester)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Responsive dashboard built with Expo Router and React Native Web.
- GitHub repository management with public GitHub repository lookup.
- Telegram destination management for private chats, groups, supergroups, and channels.
- Notification route management between repositories, event types, and Telegram destinations.
- Notification delivery monitoring with delivery status filters.
- Webhook event inspection with paginated backend search.
- GitHub webhook tester form for sending signed webhook payloads to the backend.
- Telegram registration page opened from a Telegram Bot Web App button.
- Backend-side pagination support for list pages.
- Zod-based form validation with React Hook Form.
- Centralized Axios API client with normalized API response and error handling.
- Toast notification state powered by Zustand.

## Tech Stack

- **React Native**
- **Expo**
- **Expo Router**
- **React Native Web**
- **TypeScript**
- **Axios**
- **React Hook Form**
- **Zod**
- **Zustand**

## Project Structure

```txt
ops-pulse-dashboard/
├── src/
│   ├── api/                         # API clients for backend resources
│   ├── app/                         # Expo Router pages
│   │   ├── index.tsx                # Dashboard page
│   │   ├── repositories.tsx         # GitHub repository page
│   │   ├── telegram-destinations.tsx
│   │   ├── notification-routes.tsx
│   │   ├── notification-deliveries.tsx
│   │   ├── webhook-events.tsx
│   │   └── telegram/register.tsx    # Telegram bot registration page
│   ├── components/                  # Reusable UI and feature components
│   ├── constants/                   # Shared constants
│   ├── hooks/                       # Shared React hooks
│   ├── theme/                       # Colors, spacing, typography
│   ├── types/                       # TypeScript API and domain types
│   ├── utils/                       # Utility helpers
│   └── validation/                  # Zod schemas
├── app.json                         # Expo app configuration
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js LTS installed.
- npm installed.
- Ops Pulse backend running and reachable from the frontend.
- For mobile development, an Expo-compatible Android/iOS setup or Expo Go.

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Default example:

```env
EXPO_PUBLIC_API_BASE_URL=/api/v1
```

For local backend development, use your backend origin plus `/api/v1`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

For ngrok development:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-ngrok-domain.ngrok-free.app/api/v1
```

The API client automatically adds the `ngrok-skip-browser-warning` header when the API base URL contains `ngrok-free.app`.

> Do not store backend secrets, Telegram bot tokens, webhook secrets, or private credentials in frontend environment variables.

## Installation

Install dependencies:

```bash
npm install
```

## Running the Project

### Run on Web

```bash
npm run web
```

The Expo web server usually runs on a local development port such as:

```txt
http://localhost:8081
```

### Run with Expo Dev Server

```bash
npm run start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

## Available Scripts

```bash
npm run start       # Start Expo dev server
npm run web         # Start Expo web app
npm run android     # Start Android target
npm run ios         # Start iOS target
npm run typecheck   # Run TypeScript type checking
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Main dashboard overview |
| `/repositories` | Manage GitHub repositories |
| `/telegram-destinations` | Manage Telegram chat destinations |
| `/notification-routes` | Manage repository-to-Telegram notification routes |
| `/notification-deliveries` | Monitor notification delivery attempts |
| `/webhook-events` | Inspect webhook intake events and test GitHub webhook payloads |
| `/telegram/register?sessionId=<sessionId>` | Telegram bot registration form |

## Backend API Integration

All backend calls are centralized through `src/api/apiClient.ts`.

The client:

- Uses `EXPO_PUBLIC_API_BASE_URL` as the backend base URL.
- Falls back to `/api/v1` when the environment variable is missing.
- Adds JSON headers automatically.
- Normalizes API response envelopes by returning `data` when present.
- Converts Axios errors into `ApiClientError`.
- Removes empty query parameters before sending requests.

### Main API Modules

| File | Responsibility |
|---|---|
| `src/api/githubRepositoryApi.ts` | GitHub repository CRUD and public GitHub lookup |
| `src/api/telegramDestinationApi.ts` | Telegram destination list/create/status check |
| `src/api/notificationRouteApi.ts` | Notification route list/create/active/enabled checks |
| `src/api/notificationDeliveryApi.ts` | Delivery list/create/retryable checks |
| `src/api/webhookEventApi.ts` | Webhook event list/create/exists/test GitHub webhook |
| `src/api/telegramRegistrationApi.ts` | Telegram bot registration submission |

## Listing and Pagination

Listing pages use backend-side pagination and send these common query parameters when supported:

```txt
page
size
sortBy
sortDir
```

Default sorting in the UI is usually:

```txt
sortBy=createdAt
sortDir=desc
```

Examples:

```txt
GET /github/repositories?page=0&size=20&sortBy=createdAt&sortDir=desc
GET /telegram/destinations?search={idOrUsername}&chatType={chatType}&page=0&size=20&sortBy=createdAt&sortDir=desc
GET /notification-routes?search={destinationOrRepository}&page=0&size=20&sortBy=createdAt&sortDir=desc
GET /notification-deliveries?status=PENDING&destinationUsername={username}&githubRepoName={repoName}&page=0&size=20&sortBy=createdAt&sortDir=desc
GET /webhook-events?search={destinationOrRepository}&page=0&size=20&sortBy=createdAt&sortDir=desc
```

## Telegram Registration Flow

This project includes a standalone Telegram registration page:

```txt
/telegram/register?sessionId=<sessionId>
```

The expected backend flow is:

1. A Telegram user or group sends `/register` to the Telegram bot.
2. The backend creates a secure registration session.
3. The backend sends a Telegram Web App button that opens this frontend page.
4. The frontend receives only `sessionId` from the URL.
5. The user selects:
   - `repositoryFullName`, for example `owner/repo`
   - `eventTypes`, for example `push`, `pull_request`, `issues`, `release`
   - `active` status
6. The frontend submits the form to the backend.
7. The backend resolves Telegram chat identity from the secure session and creates the destination/routes.

### Telegram Registration Submit API

```txt
POST /api/v1/telegram/register
```

Request body:

```json
{
  "sessionId": "abc123",
  "repositoryFullName": "owner/repo",
  "eventTypes": ["push", "pull_request", "issues", "release"],
  "active": true
}
```

Expected response shape:

```json
{
  "destinationId": "destination-id",
  "repositoryId": "repository-id",
  "repositoryFullName": "owner/repo",
  "createdRouteIds": ["route-id-1", "route-id-2"],
  "eventTypes": ["push", "pull_request"],
  "active": true
}
```

### Backend Telegram Form URL

The backend should point `TELEGRAM_REGISTER_FORM_URL` to the frontend registration page without query parameters:

```env
TELEGRAM_REGISTER_FORM_URL=http://localhost:8081/telegram/register
```

For production:

```env
TELEGRAM_REGISTER_FORM_URL=https://your-frontend-domain.com/telegram/register
```

The backend is responsible for appending the generated `sessionId` when sending the Telegram Web App button.

### Security Rule

The frontend must not ask users to enter Telegram identity fields manually.

Do not expose or request these values in the frontend registration form:

- Telegram bot token
- Telegram webhook secret
- Telegram chat ID
- Telegram chat type
- Telegram title
- Telegram username
- Telegram user ID

Telegram identity must be resolved by the backend from the secure registration session.

## GitHub Webhook Tester

The webhook events page includes a GitHub webhook tester that sends a raw JSON payload with GitHub webhook headers.

Target endpoint:

```txt
POST /api/v1/webhooks/github
```

Headers sent by the frontend:

```txt
X-GitHub-Event
X-GitHub-Delivery
X-Hub-Signature-256
Content-Type: application/json
```

Use this page to verify that the backend can receive and process GitHub webhook payloads.

## Form Validation

Form validation is implemented with Zod schemas under `src/validation`.

Examples:

- GitHub repository forms require `githubRepoId`, `ownerName`, and `repoName`.
- Telegram destination forms require `chatId` and `chatType`.
- Telegram registration requires repository full name in `owner/repo` format and at least one event type.
- Notification delivery forms require destination ID, Telegram chat ID, message text, status, and max attempts.
- Webhook tester requires event name, delivery ID, signature, and raw JSON payload.

## Development Notes

- Keep API access inside the `src/api` directory.
- Keep route pages inside `src/app` using Expo Router conventions.
- Keep reusable UI components inside `src/components/ui`.
- Keep feature-specific components inside their own folders under `src/components`.
- Use existing theme helpers from `src/theme` instead of hard-coded styling where possible.
- Keep backend pagination active for listing pages; do not load all data into memory just to filter or paginate on the frontend.
- Do not commit real `.env` values, tokens, secrets, or ngrok URLs.

## Troubleshooting

### CORS error when calling backend

Example browser error:

```txt
Access to XMLHttpRequest has been blocked by CORS policy
```

Fix:

- Make sure `EXPO_PUBLIC_API_BASE_URL` points to the correct backend URL.
- Make sure the backend CORS configuration allows the frontend origin.
- If frontend runs at `http://localhost:8081`, the backend must allow that origin.
- If using ngrok, the backend must allow the ngrok frontend/backend domain you are using.

### ngrok endpoint is offline

Example error:

```txt
ERR_NGROK_3200
The endpoint is offline.
```

Fix:

- Restart ngrok.
- Update `.env` with the new ngrok domain.
- Update backend `TELEGRAM_REGISTER_FORM_URL` if the frontend domain changed.
- Update Telegram webhook URL if the backend ngrok domain changed.

### Telegram registration link is invalid

The registration page requires a `sessionId` query parameter:

```txt
/telegram/register?sessionId=<sessionId>
```

If the page shows an invalid registration link message, run `/register` again in Telegram so the backend can create a new session.

### GitHub repository lookup fails

The frontend GitHub lookup uses the public GitHub API:

```txt
https://api.github.com/repos/{owner}/{repo}
```

For private repositories, use a backend proxy or backend-side GitHub integration with proper authentication.

## Production Checklist

Before deploying, verify that:

- `EXPO_PUBLIC_API_BASE_URL` points to the production backend API.
- Backend CORS allows the production frontend domain.
- `TELEGRAM_REGISTER_FORM_URL` points to the deployed frontend registration page.
- Telegram webhook URL points to the production backend webhook endpoint.
- No frontend environment variable contains bot tokens, webhook secrets, or private credentials.
- All list APIs are paginated on the backend.

## License

This project is private and intended for internal Ops Pulse usage.

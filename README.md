# Consistency Tracker

## Setup

1) Install dependencies:

- `npm install`

2) Configure environment variables:

- Copy `.env.example` to `.env.local`
- Fill in your Firebase values

## Deploying to Vercel

If you see **"Deployment misconfigured"** on the deployed site, your Vercel Environment Variables are missing.

1) In Firebase Console:

- Project settings → General → Your apps → SDK setup and configuration
- Copy the values into Vercel (keep the `VITE_` prefix)

2) In Vercel:

- Project → Settings → Environment Variables
- Add at least:
	- `VITE_FIREBASE_API_KEY`
	- `VITE_FIREBASE_AUTH_DOMAIN`
	- `VITE_FIREBASE_PROJECT_ID`
	- `VITE_FIREBASE_APP_ID`
- Save for the environments you use (Production + Preview are common)

3) Redeploy:

- Trigger a new deployment (or "Redeploy" the latest one) so the build picks up the new env vars.

3) Run:

- `npm run dev`

## Security

- `.env*` files are gitignored so API keys and other sensitive values are not committed.

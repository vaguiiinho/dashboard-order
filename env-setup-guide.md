# Environment Configuration Guide

This guide explains how to set up the environment variables to resolve the CORS issue and configure the CRM API integration.

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Backend Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# IXC CRM API Configuration
IXC_API_URL=https://crm.tubaron.net/webservice/v1
IXC_TOKEN=your_actual_ixc_token_here

# JWT Configuration (if you plan to use JWT)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## How to Get Your IXC Token

1. The IXC token should be in Base64 format
2. It typically follows the pattern: `userid:api_key_hash`
3. You can find this in your IXC CRM admin panel under API settings
4. Replace `your_actual_ixc_token_here` with your actual token

## Important Notes

- The backend now acts as a proxy for CRM API calls
- This resolves the CORS issue by making server-to-server requests
- The frontend will now make requests to your local backend instead of directly to the CRM
- Ensure both backend and frontend are running for the integration to work

## Testing the Setup

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. The frontend should now be able to make CRM API calls without CORS errors

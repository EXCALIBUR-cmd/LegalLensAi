# Quick Setup Guide

## Fix the 401 Error - Setup Steps

The 401 error occurred because authentication is now required. Follow these steps:

### 1. Set Up Database

Make sure you have PostgreSQL installed and running, then run:

```bash
npx prisma migrate dev --name init
```

This will create the database tables.

### 2. Update Environment Variables

Edit the `.env` file with your actual credentials:

```env
# Update with your PostgreSQL connection
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/legallens?schema=public"

# Add your Grok AI API key
GROK_API_KEY="your-actual-grok-api-key"
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Create an Account

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create a new account
4. You'll be automatically signed in and redirected to the dashboard

### 5. Upload and Analyze Documents

Now you can upload legal documents and they will be analyzed by Grok AI!

## Features Added

- ✅ **User Authentication** - Secure sign up and sign in
- ✅ **Protected API Routes** - All document operations require authentication
- ✅ **Session Management** - Persistent login state
- ✅ **User Dashboard** - Personalized document management

## Common Issues

### PostgreSQL Not Running
Make sure PostgreSQL is installed and running on port 5432.

### Database Connection Error
Check your `DATABASE_URL` in `.env` file matches your PostgreSQL setup.

### Grok AI Key Missing
The app will work for uploads, but analysis will fail without a valid Grok AI API key.

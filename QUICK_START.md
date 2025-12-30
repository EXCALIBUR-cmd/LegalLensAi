# 🚀 Complete Setup Instructions

## The 401 Error - What Happened?

The authentication system is now active and working! The 401 error occurred because:
1. ✅ Authentication is properly configured
2. ⚠️ Database needs to be set up to store user accounts
3. ⚠️ You need to create an account

## Setup Steps

### Step 1: Install PostgreSQL (if not installed)

**Option A: Using PostgreSQL Installer**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings (port 5432)
- Remember the password you set for the `postgres` user

**Option B: Using Docker (recommended)**
```bash
docker run --name legallens-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=legallens -p 5432:5432 -d postgres
```

### Step 2: Update .env File

Edit `c:\LegalLens\.env` with your database credentials:

```env
# If you used the installer:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/legallens?schema=public"

# If you used Docker:
DATABASE_URL="postgresql://postgres:password@localhost:5432/legallens?schema=public"

# Add your Grok AI key:
GROK_API_KEY="your-actual-grok-api-key-from-x.ai"
```

### Step 3: Create Database Tables

```bash
npx prisma migrate dev --name init
```

This will create all necessary tables (User, Document, Analysis).

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Create Your Account

1. Open http://localhost:3000
2. Click **"Get Started"** or **"Sign Up"**
3. Fill in your details:
   - Name (optional)
   - Email
   - Password (at least 6 characters)
4. Click **"Create Account"**
5. You'll be automatically signed in!

### Step 6: Upload & Analyze Documents

You're now ready to:
- Upload legal documents
- Get AI-powered analysis from Grok
- View summaries, key clauses, and risk factors

## What's Been Fixed

### ✅ Security Issues Resolved
- **Authentication System**: Secure sign-up and sign-in
- **Protected APIs**: All document operations require authentication
- **Session Management**: Persistent login with NextAuth
- **Password Security**: Bcrypt hashing for passwords

### ✅ Features Added
- User registration and login pages
- Protected dashboard route
- Sign out functionality
- Session-based authentication

## Testing Without Database

If you want to test the frontend first:

1. Comment out the authentication check in `src/app/dashboard/page.tsx`:
```typescript
// Comment these lines temporarily:
// useEffect(() => {
//   if (status === 'unauthenticated') {
//     router.push('/auth/signin');
//   }
// }, [status, router]);
```

2. Modify the API routes to skip auth temporarily (NOT for production)

## Troubleshooting

### "Can't reach database server"
- PostgreSQL is not running
- Wrong port number (check if it's 5432)
- Wrong credentials in DATABASE_URL

### "User already exists"
- Email is already registered
- Use the sign in page instead

### Analysis fails
- Check your GROK_API_KEY in .env
- Make sure you have credits with Grok AI

## Next Steps

After setup:
1. Upload a sample legal document (txt, pdf, doc)
2. Wait for Grok AI to analyze it
3. Review the simplified summary and insights
4. Try uploading more documents!

## Need Help?

Check the main README.md for more detailed documentation about the project structure and features.

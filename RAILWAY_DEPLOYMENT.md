# Railway Deployment Guide

This guide will help you deploy the Wolf Trading website to Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app))
- Git repository with your code
- Railway CLI (optional, for CLI-based deployment)

## Deployment Steps

### 1. Push Code to Git Repository

First, push your code to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Create New Project on Railway

1. Log in to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it as a Next.js project

### 3. Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database instance

### 4. Configure Environment Variables

Add the following environment variables in Railway:

**Database:**
- `DATABASE_URL` - Automatically provided by Railway (reference the PostgreSQL service)

**NextAuth:**
- `NEXTAUTH_URL` - Your Railway app URL (e.g., `https://your-app.railway.app`)
- `NEXTAUTH_SECRET` - Generate a random secret string (use: `openssl rand -base64 32`)

**Google OAuth (Optional):**
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth secret

**Email (SMTP):**
- `SMTP_HOST` - Your SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (e.g., `587`)
- `SMTP_USER` - Your email address
- `SMTP_PASSWORD` - Your email app password
- `SMTP_FROM` - Sender email (e.g., `noreply@wolftrading.com`)

**Admin:**
- `ADMIN_EMAIL` - Your admin email (e.g., `admin@gmail.com`)
- `ADMIN_PASSWORD` - Your admin password

**Session:**
- `SESSION_MAX_AGE` - Session duration in seconds (default: `604800` for 7 days)

### 5. Connect Database to App

1. Go to your Next.js service in Railway
2. Click "Variables" tab
3. For `DATABASE_URL`, click "Reference" and select your PostgreSQL service
4. This will automatically link the database

### 6. Deploy

Railway will automatically deploy when you push changes. The deployment process:

1. Builds the Next.js application
2. Runs the database initialization script
3. Starts the production server

### 7. Access Your App

Once deployed, Railway will provide:
- **App URL**: `https://your-app-name.up.railway.app`
- **Database URL**: Available in the PostgreSQL service settings

## Database Initialization

The project includes a `postinstall` script that automatically runs `scripts/init-db.js` to initialize the database schema on deployment.

## Monitoring

- View logs in Railway dashboard
- Monitor database usage
- Set up alerts for errors or performance issues

## Custom Domain (Optional)

1. Go to your service settings in Railway
2. Click "Networking" → "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

**Build fails:**
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json

**Database connection fails:**
- Verify DATABASE_URL is correctly referenced
- Check PostgreSQL service is running

**Environment variables not working:**
- Ensure all required variables are set
- Restart the service after adding variables

## Cost Considerations

Railway offers:
- Free tier: $5/month credit
- PostgreSQL: ~$5/month
- Next.js app: ~$5/month
- Total: ~$10/month after free credit

## Updates

To update your deployment:
```bash
git add .
git commit -m "Update"
git push
```

Railway will automatically redeploy.

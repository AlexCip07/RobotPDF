# Deployment Guide for SvelteKit App

This guide will walk you through deploying your SvelteKit application to GitHub and Railway.app.

## Prerequisites

- A GitHub account
- A Railway.app account
- Git installed on your computer
- Node.js and npm installed

## Part 1: Uploading to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
# Open PowerShell in your project directory
cd C:\Users\vilcu\Projects\pdf

# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit"
```

### Step 2: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - Repository name: `pdf-app` (or your preferred name)
   - Description: "SvelteKit PDF application with authentication"
   - Choose "Private" or "Public"
   - DO NOT initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Use these in PowerShell:

```bash
# Add the remote repository (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/pdf-app.git

# Push your code
git branch -M main
git push -u origin main
```

If prompted, enter your GitHub username and password (or personal access token).

## Part 2: Deploying to Railway.app

### Step 1: Create Railway Account and Project

1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your repository (`pdf-app`)

### Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. The `DATABASE_URL` will be automatically injected into your app

### Step 3: Configure Environment Variables

1. Click on your app service in Railway
2. Go to the "Variables" tab
3. The `DATABASE_URL` should already be there from PostgreSQL
4. Add any other environment variables if needed

### Step 4: Deploy

1. Railway will automatically deploy when you connect your GitHub repository
2. Every push to the main branch will trigger a new deployment

### Step 5: Run Database Migrations

After your first deployment, you need to run migrations:

1. In Railway dashboard, click on your app service
2. Go to the "Settings" tab
3. Under "Deploy", find "Railway CLI" section
4. Install Railway CLI on your computer:
   ```bash
   # Using npm
   npm install -g @railway/cli
   ```
5. Login to Railway CLI:
   ```bash
   railway login
   ```
6. Link your project:
   ```bash
   railway link
   ```
7. Run migrations:
   ```bash
   railway run npm run db:push
   ```

### Step 6: Access Your App

1. In Railway dashboard, click on your app service
2. Go to the "Settings" tab
3. Under "Networking", click "Generate Domain"
4. Your app will be available at the generated URL

## Important Notes

### Database Migrations

- Always run `npm run db:generate` locally after schema changes
- Commit the generated migration files to Git
- Run `npm run db:push` on Railway after deploying

### Environment Variables

- Never commit `.env` files to Git
- Use `env.example` as a template
- Railway automatically provides `DATABASE_URL` for PostgreSQL

### Updating Your App

After initial deployment, updating is simple:

```bash
# Make your changes locally
# Then:
git add .
git commit -m "Your update message"
git push origin main
```

Railway will automatically deploy the changes.

## Troubleshooting

### Build Fails

1. Check Railway logs for error messages
2. Ensure all dependencies are in `package.json`
3. Make sure `DATABASE_URL` is set correctly

### Database Connection Issues

1. Verify `DATABASE_URL` is set in Railway variables
2. Check that database migrations have run
3. Look at application logs for specific errors

### Application Crashes

1. Check the Railway logs
2. Ensure the `start` script in package.json is correct
3. Verify all environment variables are set

## Security Best Practices

1. Keep sensitive data in environment variables
2. Use Railway's built-in SSL/TLS
3. Regularly update dependencies
4. Enable 2FA on GitHub and Railway accounts

## Support

- Railway Documentation: https://docs.railway.app
- SvelteKit Documentation: https://kit.svelte.dev
- Drizzle ORM Documentation: https://orm.drizzle.team 
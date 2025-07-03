# Deployment Checklist

## Before Deploying

- [ ] All changes are saved and tested locally
- [ ] `.env` file exists locally with DATABASE_URL (for local testing)
- [ ] No sensitive data is hardcoded in the code
- [ ] All dependencies are listed in package.json

## GitHub Upload

- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Create repo on GitHub (without README/gitignore/license)
- [ ] Add remote: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Push: `git push -u origin main`

## Railway Deployment

- [ ] Create new project on Railway
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL database service
- [ ] Verify DATABASE_URL is automatically set
- [ ] Wait for initial deployment
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link project: `railway link`
- [ ] Run migrations: `railway run npm run db:push`
- [ ] Generate public domain in Railway settings

## Post-Deployment

- [ ] Test login/signup functionality
- [ ] Verify database connections work
- [ ] Check all pages load correctly
- [ ] Monitor Railway logs for any errors

## For Updates

- [ ] Make changes locally
- [ ] Test changes
- [ ] Commit: `git add . && git commit -m "Update message"`
- [ ] Push: `git push`
- [ ] Railway auto-deploys
- [ ] Run migrations if schema changed: `railway run npm run db:push` 
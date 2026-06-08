# Deployment Guide

## Environment Setup

### Local Development

1. **Server Setup** (.env already configured):
```bash
cd server
# .env file should have:
# - MONGODB_URI (local or cloud)
# - GEMINI_API_KEY
# - PORT=5000
npm install
npm run dev
```

2. **Client Setup**:
```bash
cd client
# .env file configured for localhost:5000
npm install
npm run dev
```

---

## Production Deployment

### Step 1: Update Environment Files

**Server** - Edit `server/.env.production`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
GEMINI_API_KEY=your_api_key
CLIENT_URL=https://your-client-url.com
JWT_SECRET=generate_a_secure_random_string
```

**Client** - Edit `client/.env.production`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Step 2: Build for Production

```bash
# Build frontend
cd client
npm run build
# Creates optimized dist/ folder

# Backend runs as-is
cd ../server
npm install --production
```

### Step 3: Deploy Options

#### **Option A: Render (Recommended for Learning)**
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables in Render dashboard
4. Deploy automatically

#### **Option B: Railway**
1. Connect GitHub repo
2. Add environment variables
3. Deploy with one click

#### **Option C: Vercel (Frontend) + Railway (Backend)**
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Update CORS and VITE_API_URL accordingly

#### **Option D: Self-Hosted (AWS/DigitalOcean)**
1. SSH into server
2. Clone repo
3. Install Node.js, MongoDB
4. Set .env variables
5. Run `npm start`

---

## Important Security Notes

⚠️ **NEVER commit these files to GitHub:**
- `.env` (local files)
- Any file with API keys or secrets

✅ **DO commit these:**
- `.env.example` (template only)
- `.env.production` (without actual keys - template)

---

## Quick Deployment Checklist

- [ ] Update `server/.env.production` with real values
- [ ] Update `client/.env.production` with production URL
- [ ] Run `npm run build` in client
- [ ] Test locally with production env
- [ ] Choose deployment platform
- [ ] Set environment variables in platform
- [ ] Deploy and test

---

## Environment Variables Reference

### Server Required:
- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - From https://ai.google.dev/
- `JWT_SECRET` - Any secure random string
- `PORT` - API port (default: 5000)
- `NODE_ENV` - Set to "production"

### Client Required:
- `VITE_API_URL` - Backend API endpoint

---

## Troubleshooting

**CORS Errors?**
- Check `CLIENT_URL` in server .env matches your client domain

**API 429 Errors?**
- Upgrade Gemini API to paid tier
- Or wait for free tier quota reset

**MongoDB Connection Failed?**
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure connection string is IP-whitelisted


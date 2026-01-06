# Render Deployment Fixes

## Issues Fixed

### 1. Server Not Binding to Port
**Problem:** Server was only listening in non-production environments, causing Render to fail with "No open ports detected"

**Fix:** Modified `server/server.js` to:
- Remove the production environment check
- Bind to `0.0.0.0` instead of default localhost
- Always start the server after DB connection

```javascript
// Before
if(process.env.NODE_ENV !=="production"){
  server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
}

// After
server.listen(PORT, '0.0.0.0', () => {
  console.log("Server is running on port: " + PORT);
});
```

### 2. Email Service Blocking Startup
**Problem:** Email verification was timing out and blocking server startup

**Fix:** Modified `server/config/email.js` to:
- Add connection timeouts (5-10 seconds)
- Add verification timeout to prevent blocking
- Log warnings but continue server startup even if email fails

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000
});
```

## Environment Variables Needed on Render

Make sure these are set in your Render service:

### Required:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV=production`
- `PORT` - (Render sets this automatically)

### Optional (for email features):
- `EMAIL_USER` - Gmail address
- `EMAIL_APP_PASSWORD` - Gmail app password
- `EMAIL_FROM` - Sender email address

### Stripe (if using payments):
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`

### Frontend URL:
- `FRONTEND_URL` - Your deployed frontend URL
- `CLIENT_URL` - Your deployed frontend URL

## Deployment Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix Render deployment: port binding and email timeout"
   git push
   ```

2. **Configure Render Service**
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`
   - Environment: Node
   - Branch: main (or your deployment branch)

3. **Add Environment Variables**
   - Go to Render Dashboard → Your Service → Environment
   - Add all required environment variables

4. **Deploy**
   - Render will automatically deploy after you push
   - Check logs for "Server is running on port: XXXX"

## Troubleshooting

If deployment still fails:

1. **Check Logs:** Look for specific errors in Render logs
2. **Port Binding:** Ensure the log shows "Server is running on port: XXXX"
3. **MongoDB Connection:** Verify MongoDB URI is correct and IP is whitelisted
4. **Email Service:** Can be disabled temporarily if causing issues

## Success Indicators

When deployment succeeds, you should see:
```
Connecting to MongoDB...
✅ Email service ready (or timeout warning)
MongoDB connected successfully
Server is running on port: 10000
```

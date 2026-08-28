# Rentifi

A full-stack property rental platform built for the Pakistani market. Rentifi connects property hosts with guests through a secure, end-to-end booking experience — from listing creation to payment processing.

---

## Overview

Rentifi is a two-sided marketplace where hosts list residential properties and guests discover, book, and pay for stays. The platform handles the full rental lifecycle: user onboarding, property verification by admins, date-based booking with conflict prevention, Stripe-powered payments, and post-stay reviews.

---

## Features

### For Guests
- Browse and search verified property listings with filters
- View property details, amenities, host profile, and reviews
- Book properties with a date picker that shows unavailable dates
- Pay securely via Stripe Checkout
- Receive email confirmation with a check-in verification code
- Submit reviews and ratings after checkout
- Manage and track bookings from a personal dashboard
- File complaints against properties

### For Hosts
- List properties with photos, descriptions, pricing, and amenities
- Dashboard to manage listings, availability, and bookings
- Receive email notifications for new bookings
- Stripe Connect integration for direct payouts
- View guest details and check-in verification codes
- Respond to reviews

### For Admins
- Review and approve or reject property listings
- Manage user accounts and platform activity
- Handle complaint reports
- Monitor bookings and payouts via admin panel
- Audit logs for admin actions

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| State / Data | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Payments | Stripe.js + React Stripe |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (HTTP-only cookies) |
| Payments | Stripe API + Stripe Connect |
| Email | Resend |
| Storage | Cloudinary |
| Security | Helmet, express-mongo-sanitize, express-rate-limit, xss-clean |

### Infrastructure
| Service | Platform |
|---|---|
| Backend | Render |
| Frontend | Vercel |
| Database | MongoDB Atlas |
| CI/CD | GitHub Actions |

---

## Architecture

```
rentifi/
├── client/                  # React frontend (Vite + TypeScript)
│   └── src/
│       ├── pages/           # Route-level components
│       ├── components/      # Reusable UI components
│       ├── contexts/        # Auth, Admin React contexts
│       ├── hooks/           # Custom hooks
│       └── utils/           # Helpers and API config
│
└── server/                  # Node.js backend (Express ESM)
    ├── controllers/         # Route handlers
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    ├── middleware/          # Auth, rate limiting, validation
    ├── config/              # Stripe, email, database config
    ├── lib/                 # Cloudinary, email service
    └── utils/               # Shared utilities
```

---

## API Endpoints

| Resource | Base Path |
|---|---|
| Auth & Users | `/api/auth` |
| Properties | `/api/properties` |
| Bookings | `/api/bookings` |
| Payments | `/api/payments` |
| Reviews | `/api/reviews` |
| Admin | `/api/admin` |
| Stripe Connect | `/api/stripe-connect` |
| Complaints | `/api/complaints` |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account with Connect enabled
- Cloudinary account
- Resend account

### Environment Variables

**Server** (`server/.env`):
```env
# Database
MONGODB_URI=mongodb+srv://...

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret

# Frontend
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email (Resend)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rentifi.git
cd rentifi

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Run both in development
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

### Create Admin Account

```bash
cd server && npm run create-admin
```

---

## Security

- JWT authentication with HTTP-only cookies
- Rate limiting on auth and sensitive routes
- MongoDB injection prevention (`express-mongo-sanitize`)
- XSS sanitization (`xss-clean`)
- HTTP security headers (`helmet`)
- Input validation with `express-validator` and Zod
- CORS restricted to known origins in production
- Stripe Webhook signature verification

---

## CI/CD

Three GitHub Actions workflows run on every push and pull request:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Push to `main` / `dev` | Lint and build validation |
| `pr-check.yml` | Pull Request | Code quality checks |
| `deploy.yml` | Push to `main` | Deploy to Render + Vercel |

Dependabot keeps dependencies current with weekly PRs for both `client/` and `server/`.

---

## Deployment

### Backend → Render
- Web service pointing to `server/`
- Start command: `node server.js`
- Set all server environment variables in Render dashboard
- Add Stripe webhook endpoint: `https://your-app.onrender.com/api/payments/webhook`

### Frontend → Vercel
- Root directory: `client/`
- Build command: `npm run build`
- Output: `dist/`
- Set `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel environment

---

## License

MIT

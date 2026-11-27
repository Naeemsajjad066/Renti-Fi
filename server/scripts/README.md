# Scripts

One-off utility scripts for database management. Run from the `server/` directory with your `.env` file present.

> **Never hardcode credentials or IDs in these scripts.** All sensitive values must be passed as CLI arguments or read from environment variables.

---

## admin.js

Unified admin management. Create a new admin user or promote an existing one.

```bash
# Create a new admin user (or promote existing user to admin)
node scripts/admin.js create <email> <password>

# Promote an existing user to admin by email
node scripts/admin.js promote <email>

# Promote an existing user to admin by MongoDB ObjectId
node scripts/admin.js promote-id <userId>
```

**Examples:**
```bash
node scripts/admin.js create admin@example.com MySecurePass123
node scripts/admin.js promote user@example.com
node scripts/admin.js promote-id 64a1b2c3d4e5f6a7b8c9d0e1
```

---

## checkPropertyStatus.js

Lists all properties in the database with their verification and active status. Useful for debugging listing visibility issues.

```bash
node scripts/checkPropertyStatus.js
```

---

## cleanInvalidRatings.js

Recalculates and corrects property ratings and review counts based on actual reviews in the database.

```bash
node scripts/cleanInvalidRatings.js
```

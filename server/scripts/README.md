# Scripts

One-off utility scripts for database management. Run from the `server/` directory with your `.env` file present.

> **Never hardcode credentials or IDs in these scripts.** All sensitive values must be passed as CLI arguments or read from environment variables.

---

## createAdmin.js

Creates a new admin user or promotes an existing user to admin.

```bash
node scripts/createAdmin.js <email> <password>
```

```bash
node scripts/createAdmin.js admin@example.com MySecurePass123
```

---

## makeAdmin.js

Promotes an existing user to admin by email address.

```bash
node scripts/makeAdmin.js <email>
```

```bash
node scripts/makeAdmin.js user@example.com
```

---

## makeAdminById.js

Promotes an existing user to admin by MongoDB ObjectId.

```bash
node scripts/makeAdminById.js <userId>
```

```bash
node scripts/makeAdminById.js 64a1b2c3d4e5f6a7b8c9d0e1
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

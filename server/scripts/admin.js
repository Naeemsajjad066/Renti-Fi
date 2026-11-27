// scripts/admin.js
//
// Unified admin management script.
//
// Usage:
//   node scripts/admin.js create   <email> <password>   — create a new admin user (or promote existing)
//   node scripts/admin.js promote  <email>              — promote existing user to admin by email
//   node scripts/admin.js promote-id <userId>           — promote existing user to admin by MongoDB ID
//
// Examples:
//   node scripts/admin.js create admin@example.com MySecurePass123
//   node scripts/admin.js promote user@example.com
//   node scripts/admin.js promote-id 64a1b2c3d4e5f6a7b8c9d0e1

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function requireEnv() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGO_URI (or MONGODB_URI) is not set in your .env file.');
    process.exit(1);
  }
  return uri;
}

async function connect() {
  const uri = requireEnv();
  await mongoose.connect(uri, { dbName: process.env.DB_NAME });
  console.log('✅ Connected to MongoDB\n');
}

async function disconnect() {
  await mongoose.connection.close();
}

function printUser(label, user) {
  console.log(`${label}`);
  console.log(`  Name  : ${user.fullName}`);
  console.log(`  Email : ${user.email}`);
  console.log(`  Role  : ${user.role}`);
}

// ─── Commands ─────────────────────────────────────────────────────────────────

async function create(email, password) {
  if (!email || !password) {
    console.error('❌ Usage: node scripts/admin.js create <email> <password>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    process.exit(1);
  }

  await connect();

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.isHost = true;
    existing.isEmailVerified = true;
    existing.password = hashed;
    await existing.save();
    console.log('✅ Existing user promoted to admin.');
    printUser('User:', existing);
  } else {
    const admin = await User.create({
      email,
      fullName: 'Admin',
      idCard: '0000000000000',
      phoneNumber: '00000000000',
      password: hashed,
      role: 'admin',
      isHost: true,
      isEmailVerified: true,
      isActive: true,
    });
    console.log('✅ New admin user created.');
    printUser('User:', admin);
  }

  await disconnect();
}

async function promoteByEmail(email) {
  if (!email) {
    console.error('❌ Usage: node scripts/admin.js promote <email>');
    process.exit(1);
  }

  await connect();

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
    process.exit(1);
  }

  user.role = 'admin';
  user.isHost = true;
  await user.save();

  console.log('✅ User promoted to admin.');
  printUser('User:', user);
  console.log('\n⚠️  Ask the user to log out and back in for changes to take effect.');

  await disconnect();
}

async function promoteById(userId) {
  if (!userId) {
    console.error('❌ Usage: node scripts/admin.js promote-id <userId>');
    process.exit(1);
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) {
    console.error(`❌ No user found with ID: ${userId}`);
    process.exit(1);
  }

  user.role = 'admin';
  user.isHost = true;
  await user.save();

  console.log('✅ User promoted to admin.');
  printUser('User:', user);
  console.log('\n⚠️  Ask the user to log out and back in for changes to take effect.');

  await disconnect();
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const [command, arg1, arg2] = process.argv.slice(2);

const USAGE = `
Usage:
  node scripts/admin.js create     <email> <password>
  node scripts/admin.js promote    <email>
  node scripts/admin.js promote-id <userId>
`;

switch (command) {
  case 'create':
    await create(arg1, arg2);
    break;
  case 'promote':
    await promoteByEmail(arg1);
    break;
  case 'promote-id':
    await promoteById(arg1);
    break;
  default:
    console.error(`❌ Unknown command: "${command ?? ''}"${USAGE}`);
    process.exit(1);
}

process.exit(0);

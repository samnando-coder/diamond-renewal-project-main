#!/bin/bash
# Railway start script for Blue Diamonds Club

# Generate Prisma Client (if not already done)
npm run db:generate

# Run database migrations (if needed)
npm run db:migrate || true

# Start the server
NODE_ENV=production SERVE_STATIC=1 npm start

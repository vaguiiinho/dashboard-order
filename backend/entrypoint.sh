#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting app..."
exec node dist/main.js
# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Production-ready image
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Copy your Firebase service account key file 
COPY ./path-to-firebase-key.json ./firebase-key.json

# Expose Next.js port
EXPOSE 3000

# Command to start the Next.js app in production mode
CMD ["yarn", "start"]
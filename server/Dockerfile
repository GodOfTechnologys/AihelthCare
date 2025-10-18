FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

# Run migrations then start dev server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]

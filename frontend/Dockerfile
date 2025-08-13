FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy configuration files first
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
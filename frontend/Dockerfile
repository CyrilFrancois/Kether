# /frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# We copy package.json first to cache the 'npm install' layer
COPY package.json ./
# If you don't have a package.json yet, we'll create a dummy one in the next step
RUN npm install || echo "No package.json yet"

COPY . .

EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
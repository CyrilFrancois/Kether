# Step 1: Base Image (Node 20 Slim for a smaller footprint)
FROM node:20-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files first to leverage Docker layer caching
# This makes subsequent builds much faster if dependencies haven't changed
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application source code
COPY . .

# Step 6: Expose the Vite default port
EXPOSE 3000

# Step 7: Launch the Development Server
# --host is required so Vite accepts connections from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
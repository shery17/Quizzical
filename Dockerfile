# Dockerfile to create a linux-based container that uses a node.js image to provide node runtime environment for app to run on any machine.

# 1. Use an official, lightweight Node.js runtime as the base image
FROM node:22-alpine

# 2. Set the working directory inside the container (creates or uses the /app folder in the linux container's directory)
WORKDIR /app

# 3. Copy package blueprints first (Docker caches this layer; it will skip re-installing dependencies on future builds unless you modify package.json)
COPY package*.json ./

# 4. Clean install dependencies directly from the lockfile (prevents version drift caused by npm install, ensuring a faster, risk-free build)
RUN npm ci

# 5. Copy the rest of your application source code (copy from current dir on machine to linux containter's current dir /app)
COPY . .

# 6. Expose the standard port that Vite uses for local development (The app in container will listen on port 5173)
EXPOSE 5173

# 7. Boot the local development server inside the container, mapping it to all network interfaces (exec form to run commands directly in linux kernel without using background shell scripts)
# "--" tells npm --host flag is not for npm and to pass it down to vite
# "--host" flag changes vite's settings to listen on ip address 0.0.0.0 instead of localhost
CMD ["npm", "run", "dev", "--", "--host"]
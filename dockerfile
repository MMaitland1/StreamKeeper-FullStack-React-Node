FROM node:18-alpine

WORKDIR /app

# Copy setup script and necessary files
COPY setup.js .

# Run setup script
CMD ["node", "setup.js"]
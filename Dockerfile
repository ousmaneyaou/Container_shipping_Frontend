# Étape 1 : Build React app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serve avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Configuration personnalisée de Nginx (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

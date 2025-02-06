FROM node:20

WORKDIR /usr/src/app

# Installer les dépendances de build nécessaires
RUN apt-get update && apt-get install -y python3 make g++

# Copier les fichiers de configuration
COPY package*.json ./
COPY .env ./

# Installer les dépendances
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copier le reste des fichiers
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
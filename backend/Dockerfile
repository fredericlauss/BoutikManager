FROM node:20

WORKDIR /usr/src/app

# Installer les dépendances de build nécessaires
RUN apt-get update && apt-get install -y python3 make g++

# Copier tous les fichiers
COPY . .

# Nettoyer node_modules et réinstaller proprement
RUN rm -rf node_modules
RUN npm install
RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
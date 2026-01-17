# 🚀 DÉPLOIEMENT BACK-END - GUIDE COMPLET RAILWAY.APP

## 📋 VUE D'ENSEMBLE

Railway.app est une plateforme de déploiement moderne, gratuite et simple pour le back-end.

**Avantages** :
- ✅ Gratuit jusqu'à 5$/mois de crédit (~500h de runtime)
- ✅ PostgreSQL inclus gratuitement
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ Facile à configurer
- ✅ Logs en temps réel

---

## 🎯 OPTION A : Déploiement depuis GitHub (RECOMMANDÉ)

### Étape 1 : Créer la structure du projet back-end

```powershell
# Se placer dans le dossier du projet
cd C:\Users\NH\Downloads\superprof

# Créer le dossier backend
mkdir backend
cd backend

# Initialiser le projet Node.js
npm init -y
```

### Étape 2 : Installer les dépendances

```powershell
# Dépendances principales
npm install express @prisma/client bcrypt jsonwebtoken cors dotenv helmet express-rate-limit multer

# Dépendances de développement
npm install -D typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors @types/multer ts-node nodemon prisma

# Initialiser TypeScript
npx tsc --init

# Initialiser Prisma
npx prisma init
```

### Étape 3 : Configurer TypeScript

Éditer `backend/tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Étape 4 : Configurer package.json

Éditer `backend/package.json` pour ajouter les scripts :

```json
{
  "name": "elearning-backend",
  "version": "1.0.0",
  "description": "Back-end API pour plateforme e-learning BTS STMG",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  },
  "keywords": ["elearning", "api", "express", "prisma"],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Étape 5 : Créer le schéma Prisma

Copier le contenu de `prisma-schema-example.prisma` dans `backend/prisma/schema.prisma`

Ou créer manuellement avec au minimum :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  role         Role
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

enum Role {
  STUDENT
  TEACHER
  ADMIN
}
```

### Étape 6 : Créer le fichier d'entrée du serveur

Créer `backend/src/index.ts` :

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes max par IP
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API v1 is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes à ajouter ici
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/courses', courseRoutes);
// etc.

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### Étape 7 : Créer .gitignore

Créer `backend/.gitignore` :

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Prisma
prisma/migrations/

# Uploads (si stockage local)
uploads/
```

### Étape 8 : Créer .env.example

Créer `backend/.env.example` :

```env
# DATABASE
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=changez_moi_avec_une_cle_secrete_tres_longue_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# SERVER
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://votre-app.vercel.app

# UPLOADS
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Étape 9 : Pousser sur GitHub

```powershell
# Initialiser Git
cd C:\Users\NH\Downloads\superprof\backend
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Backend API"

# Créer un repository sur GitHub
# Aller sur https://github.com/new
# Nom : plateforme-elearning-backend
# Visibilité : Private

# Lier au repository (REMPLACER votre-username)
git remote add origin https://github.com/votre-username/plateforme-elearning-backend.git

# Renommer la branche
git branch -M main

# Pousser le code
git push -u origin main
```

---

## 🚀 DÉPLOIEMENT SUR RAILWAY

### Étape 10 : Créer un compte Railway

```
1. Aller sur https://railway.app
2. Cliquer sur "Login"
3. Choisir "Login with GitHub"
4. Se connecter avec votre compte GitHub
5. Autoriser Railway
```

### Étape 11 : Créer un nouveau projet

```
1. Sur le Dashboard Railway, cliquer "New Project"
2. Sélectionner "Deploy from GitHub repo"
3. Choisir votre repository : plateforme-elearning-backend
4. Cliquer "Deploy Now"
```

### Étape 12 : Ajouter PostgreSQL

```
1. Dans votre projet Railway, cliquer sur "+ New"
2. Sélectionner "Database"
3. Choisir "Add PostgreSQL"
4. Railway crée automatiquement la base de données
```

### Étape 13 : Configurer les variables d'environnement

```
1. Cliquer sur votre service backend (pas la database)
2. Onglet "Variables"
3. Cliquer "Add Variable" ou "RAW Editor"

Ajouter ces variables :

DATABASE_URL=${{Postgres.DATABASE_URL}}
   (Railway remplit automatiquement depuis la DB)

JWT_SECRET=votre_cle_secrete_minimum_32_caracteres_changez_moi
   (Générer une clé forte)

JWT_EXPIRES_IN=7d

NODE_ENV=production

PORT=3000

FRONTEND_URL=https://votre-app.vercel.app
   (URL de votre front-end Vercel)

MAX_FILE_SIZE=10485760

BCRYPT_ROUNDS=10
```

**💡 Générer une clé JWT sécurisée** :

```powershell
# Sur PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Étape 14 : Configurer les paramètres de déploiement

```
1. Onglet "Settings"

2. Build Command :
   npm install && npx prisma generate && npm run build

3. Start Command :
   npm run prisma:migrate && npm start

4. Root Directory : 
   ./ (ou backend si mono-repo)

5. Watch Paths :
   Laisser par défaut
```

### Étape 15 : Déployer

```
1. Railway commence automatiquement le déploiement

2. Suivre les logs en temps réel dans l'onglet "Deployments"

3. Vérifier :
   - Build successful ✅
   - Migrations executed ✅
   - Server started ✅

4. Railway vous donne une URL publique :
   https://votre-projet.railway.app
```

### Étape 16 : Vérifier que l'API fonctionne

```
Ouvrir dans le navigateur :
https://votre-projet.railway.app/health

Vous devriez voir :
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "2026-01-17T..."
}
```

---

## 🔧 CONFIGURATION AVANCÉE

### Migrer la base de données manuellement (si besoin)

```
1. Sur Railway, cliquer sur votre service backend
2. Onglet "Shell" ou "Terminal"
3. Exécuter :
   npx prisma migrate deploy
   npx prisma generate
```

### Voir les logs en temps réel

```
1. Cliquer sur votre service backend
2. Onglet "Deployments"
3. Cliquer sur le dernier déploiement
4. Logs s'affichent en temps réel
```

### Accéder à la base de données

```
1. Cliquer sur le service PostgreSQL
2. Onglet "Data"
3. Voir les tables et données

Ou utiliser Prisma Studio localement :
1. Copier DATABASE_URL depuis Railway
2. Localement :
   $env:DATABASE_URL="postgresql://..."
   npx prisma studio
```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE

### À chaque push sur GitHub :

```powershell
# 1. Modifier votre code
# Par exemple : src/index.ts

# 2. Commiter
git add .
git commit -m "Ajout de nouvelles routes"

# 3. Pousser
git push origin main

# 4. Railway déploie automatiquement ! (1-2 min)
```

---

## 🌐 CONNECTER LE FRONT-END

### Sur Vercel, configurer VITE_API_URL

```
1. Aller sur vercel.com/dashboard
2. Sélectionner votre projet front-end
3. Settings → Environment Variables
4. Modifier VITE_API_URL :
   
   Name  : VITE_API_URL
   Value : https://votre-projet.railway.app/api/v1

5. Redéployer le front-end :
   Deployments → ... → Redeploy
```

### Sur Railway, mettre à jour FRONTEND_URL

```
1. Service backend → Variables
2. Modifier FRONTEND_URL :
   https://votre-app.vercel.app

3. Railway redéploie automatiquement
```

---

## 🔒 SÉCURITÉ POST-DÉPLOIEMENT

### Checklist sécurité

```
- [x] JWT_SECRET est une clé forte (32+ caractères)
- [x] HTTPS activé (automatique sur Railway)
- [x] CORS configuré uniquement pour votre front-end
- [x] Rate limiting activé (100 req/15min)
- [x] Helmet middleware activé
- [x] Variables sensibles dans .env (pas dans le code)
- [x] PostgreSQL accessible uniquement par Railway
- [x] Logs d'erreur configurés
```

### Activer les backups PostgreSQL

```
1. Service PostgreSQL → Settings
2. Enable Automatic Backups (dans la version Pro)

Gratuit : Backups manuels
1. Service PostgreSQL → Data
2. Export → SQL Dump
3. Sauvegarder le fichier localement
```

---

## 📊 MONITORING

### Voir les métriques

```
1. Service backend → Metrics

Vous verrez :
- CPU usage
- Memory usage
- Network I/O
- Request count
```

### Configurer les alertes (optionnel)

```
1. Settings → Observability
2. Ajouter un webhook pour notifications
```

---

## 🆘 RÉSOLUTION DES PROBLÈMES

### ❌ Build failed

**Erreur** : `npm ERR! code ELIFECYCLE`

**Solution** :
```powershell
# Tester localement
npm install
npm run build

# Corriger les erreurs TypeScript
# Puis recommiter
```

### ❌ Database connection failed

**Erreur** : `Can't reach database server`

**Solution** :
```
1. Vérifier que PostgreSQL est démarré sur Railway
2. Vérifier DATABASE_URL :
   - Doit contenir ${{Postgres.DATABASE_URL}}
   - Ou copier l'URL complète depuis le service PostgreSQL
```

### ❌ Migrations failed

**Erreur** : `Migration failed to apply`

**Solution** :
```
1. Railway → Backend → Shell
2. Exécuter :
   npx prisma migrate reset --force
   npx prisma migrate deploy

Ou localement :
   $env:DATABASE_URL="postgresql://..."
   npx prisma migrate deploy
   git add prisma/migrations
   git commit -m "Add migrations"
   git push
```

### ❌ Server crash au démarrage

**Erreur** : `Error: Cannot find module`

**Solution** :
```
Vérifier package.json :
- "main": "dist/index.js" ✅
- "start": "node dist/index.js" ✅

Build command doit inclure :
npm install && npx prisma generate && npm run build
```

### ❌ CORS error depuis le front-end

**Solution** :
```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL, // Pas '*'
  credentials: true
}));

// Vérifier FRONTEND_URL sur Railway :
// https://votre-app.vercel.app (sans slash à la fin)
```

---

## 💰 GESTION DES COÛTS

### Plan Hobby (Gratuit)

```
✅ 5$ de crédit/mois (~500h runtime)
✅ PostgreSQL inclus (1 GB)
✅ Déploiements illimités
✅ HTTPS automatique
✅ 1 service + 1 database gratuit

Suffisant pour :
- Développement et test
- 50-100 élèves actifs
- Petites classes
```

### Plan Developer (5$/mois si dépassement)

```
20$ de crédit/mois (~2000h runtime)
PostgreSQL : 8 GB
Priorité sur les ressources

Suffisant pour :
- 200-500 élèves
- Production légère
```

### Surveiller l'utilisation

```
1. Dashboard Railway
2. Onglet "Usage"
3. Voir :
   - Runtime hours
   - Network usage
   - Estimated cost
```

---

## ✅ CHECKLIST FINALE

Avant de partager l'API :

```
- [ ] API accessible sur https://votre-projet.railway.app
- [ ] /health retourne status OK
- [ ] PostgreSQL connecté
- [ ] Migrations exécutées
- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET est une clé forte
- [ ] FRONTEND_URL configuré
- [ ] CORS fonctionne avec le front-end
- [ ] Test de login/register
- [ ] Logs visibles sur Railway
- [ ] Backups configurés
```

---

## 🔄 WORKFLOW COMPLET

### Développement

```powershell
# Localement
cd backend
npm run dev

# Modifier le code
# Tester avec Postman/Insomnia

# Commiter
git add .
git commit -m "Nouvelle fonctionnalité"
```

### Déploiement

```powershell
# Pousser sur GitHub
git push origin main

# Railway déploie automatiquement
# Voir les logs sur Railway Dashboard

# Tester l'API en production
curl https://votre-projet.railway.app/health
```

---

## 📈 OPTIMISATIONS

### 1. Activer la compression

```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Configurer le cache

```typescript
app.use('/api/v1/courses', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 min
  next();
});
```

### 3. Optimiser Prisma

```typescript
// Utiliser select pour récupérer seulement les champs nécessaires
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true
  }
});
```

### 4. Logs structurés

```powershell
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

logger.info('Server started', { port: PORT });
```

---

## 🎯 RÉSUMÉ RAPIDE

```powershell
# 1. Créer le projet backend
mkdir backend && cd backend
npm init -y
npm install express @prisma/client bcrypt jsonwebtoken cors dotenv helmet

# 2. Configurer le code
# (Suivre les étapes 3-8 ci-dessus)

# 3. Pousser sur GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 4. Déployer sur Railway
# railway.app → New Project → Deploy from GitHub
# Ajouter PostgreSQL
# Configurer variables d'environnement
# Deploy

# 5. Votre API est en ligne !
# https://votre-projet.railway.app
```

---

**Temps total estimé** : 20-30 minutes  
**Coût** : 0€/mois (plan gratuit)

**Votre back-end est maintenant déployé ! 🎉**

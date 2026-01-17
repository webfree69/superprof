# 🚀 DÉPLOIEMENT BACK-END RAILWAY - GUIDE VISUEL PAS À PAS

## 📋 MÉTHODE LA PLUS SIMPLE (20 minutes)

---

## ÉTAPE 1 : Préparer le projet back-end localement

### Ouvrir PowerShell et exécuter :

```powershell
# Aller dans le dossier du projet
cd C:\Users\NH\Downloads\superprof

# Créer le dossier backend
mkdir backend
cd backend

# Initialiser Node.js
npm init -y
```

---

## ÉTAPE 2 : Installer les dépendances

```powershell
# Installer les packages nécessaires
npm install express @prisma/client bcrypt jsonwebtoken cors dotenv helmet express-rate-limit

# Installer les outils de développement
npm install -D typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors ts-node nodemon prisma

# Initialiser TypeScript
npx tsc --init

# Initialiser Prisma
npx prisma init
```

✅ **Résultat attendu** :
```
- Dossier node_modules/ créé
- package.json mis à jour
- tsconfig.json créé
- prisma/schema.prisma créé
```

---

## ÉTAPE 3 : Configurer package.json

### Éditer `backend/package.json` et ajouter les scripts :

```json
{
  "name": "elearning-backend",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "prisma migrate deploy"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## ÉTAPE 4 : Créer la structure du projet

```powershell
# Créer les dossiers
mkdir src
mkdir src\routes
mkdir src\controllers
mkdir src\middleware
mkdir src\services
```

---

## ÉTAPE 5 : Créer le fichier serveur principal

### Créer `backend/src/index.ts` :

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
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
    message: 'API v1 is running'
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## ÉTAPE 6 : Créer .gitignore

### Créer `backend/.gitignore` :

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
uploads/
```

---

## ÉTAPE 7 : Créer .env.example

### Créer `backend/.env.example` :

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=changez_moi_minimum_32_caracteres
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://votre-app.vercel.app
```

---

## ÉTAPE 8 : Tester localement (optionnel)

```powershell
# Compiler le projet
npm run build

# Démarrer le serveur
npm start

# Dans un autre terminal, tester :
curl http://localhost:3000/health
```

✅ **Vous devriez voir** : `{"status":"OK","message":"API is running",...}`

---

## ÉTAPE 9 : Pousser sur GitHub

### Créer un repository sur GitHub :

```
1. Aller sur https://github.com/new

2. Remplir :
   Repository name : plateforme-elearning-backend
   Description     : Back-end API Node.js pour e-learning
   Visibility      : Private (recommandé)
   
   ❌ Ne pas cocher "Add README"

3. Cliquer "Create repository"
```

### Pousser le code :

```powershell
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Backend API"

# Lier au repository (REMPLACER votre-username)
git remote add origin https://github.com/votre-username/plateforme-elearning-backend.git

# Renommer la branche
git branch -M main

# Pousser
git push -u origin main
```

✅ **Vérifier** : Le code est visible sur GitHub

---

## ÉTAPE 10 : Créer un compte Railway

```
1. Aller sur https://railway.app

2. Cliquer "Login"

3. Choisir "Login with GitHub"

4. Se connecter avec votre compte GitHub

5. Autoriser Railway (cliquer "Authorize Railway")
```

✅ **Vous êtes maintenant sur le Dashboard Railway**

---

## ÉTAPE 11 : Créer un nouveau projet

```
1. Cliquer "New Project" (bouton violet)

2. Choisir "Deploy from GitHub repo"

3. Si demandé, configurer l'accès GitHub :
   - "Configure GitHub App"
   - Sélectionner votre compte
   - Choisir "Only select repositories"
   - Sélectionner "plateforme-elearning-backend"
   - Cliquer "Install & Authorize"

4. Sélectionner votre repository dans la liste

5. Cliquer "Deploy Now"
```

✅ **Railway commence à déployer votre projet**

---

## ÉTAPE 12 : Ajouter PostgreSQL

```
1. Dans votre projet, cliquer le bouton "+ New"

2. Sélectionner "Database"

3. Choisir "Add PostgreSQL"

4. Railway crée la base de données (10-20 secondes)
```

✅ **Vous voyez maintenant 2 services** :
- `plateforme-elearning-backend` (votre API)
- `Postgres` (la base de données)

---

## ÉTAPE 13 : Configurer les variables d'environnement

### Cliquer sur votre service backend (pas Postgres)

```
1. Onglet "Variables"

2. Cliquer "+ New Variable" pour chaque variable :

Variable 1 :
   Variable name : DATABASE_URL
   Value         : ${{Postgres.DATABASE_URL}}
   (Railway remplira automatiquement)

Variable 2 :
   Variable name : JWT_SECRET
   Value         : [Générer une clé forte - voir ci-dessous]

Variable 3 :
   Variable name : JWT_EXPIRES_IN
   Value         : 7d

Variable 4 :
   Variable name : NODE_ENV
   Value         : production

Variable 5 :
   Variable name : PORT
   Value         : 3000

Variable 6 :
   Variable name : FRONTEND_URL
   Value         : https://votre-app.vercel.app
   (Remplacer par votre URL Vercel réelle)

Variable 7 :
   Variable name : BCRYPT_ROUNDS
   Value         : 10

3. Cliquer "Add" pour chaque variable
```

### 💡 Générer JWT_SECRET sécurisé :

```powershell
# Sur PowerShell, exécuter :
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Copier le résultat (ex: 8kJ3mN9pQ2rT5vW7xY1zA4bC6dE0fG8h)
```

---

## ÉTAPE 14 : Configurer les paramètres de build

```
1. Toujours sur votre service backend, onglet "Settings"

2. Descendre jusqu'à "Build Command"
   Entrer : npm install && npx prisma generate && npm run build

3. "Start Command"
   Entrer : npm run prisma:migrate && npm start

4. "Root Directory"
   Laisser : ./ (ou backend si mono-repo)

5. Cliquer "Save" si nécessaire
```

---

## ÉTAPE 15 : Déployer !

```
Railway déploie automatiquement

1. Onglet "Deployments" pour voir les logs

Vous verrez :
   ⏳ Queued...
   🔨 Building...
   📦 Deploying...
   ✅ Success!

2. Temps estimé : 2-3 minutes

3. Une fois terminé, Railway vous donne une URL :
   https://votre-projet-production.up.railway.app
```

---

## ÉTAPE 16 : Générer un domaine public

```
1. Sur votre service backend, onglet "Settings"

2. Descendre jusqu'à "Networking"

3. Cliquer "Generate Domain"

4. Railway crée une URL publique :
   https://plateforme-elearning-backend-production.up.railway.app
```

✅ **Copier cette URL, vous en aurez besoin !**

---

## ÉTAPE 17 : Vérifier que l'API fonctionne

```
1. Ouvrir un navigateur

2. Aller sur :
   https://votre-projet.up.railway.app/health

3. Vous devriez voir :
   {
     "status": "OK",
     "message": "API is running",
     "timestamp": "2026-01-17T..."
   }
```

✅ **Si vous voyez ce JSON, votre API est en ligne ! 🎉**

---

## ÉTAPE 18 : Migrer la base de données

### Si vous avez un schéma Prisma :

```
1. Railway → Service backend → Shell (ou Deployments → View logs)

2. Vérifier dans les logs :
   - "Prisma migrate deployed"
   - "Server running on port 3000"

Si besoin de migrer manuellement :
   - Localement, copier DATABASE_URL depuis Railway
   - PowerShell :
     $env:DATABASE_URL="postgresql://..."
     npx prisma migrate dev --name init
     git add prisma/migrations
     git commit -m "Add migrations"
     git push
```

---

## ÉTAPE 19 : Connecter le front-end

### Mettre à jour Vercel avec l'URL Railway :

```
1. Aller sur vercel.com/dashboard

2. Sélectionner votre projet front-end

3. Settings → Environment Variables

4. Modifier VITE_API_URL :
   Name  : VITE_API_URL
   Value : https://votre-projet.up.railway.app/api/v1

5. Redéployer :
   Deployments → ... (3 points) → Redeploy
```

---

## ÉTAPE 20 : Mettre à jour CORS sur Railway

### Pour que le front-end puisse appeler l'API :

```
1. Railway → Backend → Variables

2. Vérifier FRONTEND_URL :
   https://votre-app.vercel.app
   (Sans slash à la fin !)

3. Si modification, Railway redéploie automatiquement
```

---

## ✅ VÉRIFICATION COMPLÈTE

### Tester l'ensemble du système :

```
1. Ouvrir votre site Vercel :
   https://votre-app.vercel.app

2. Essayer de s'inscrire :
   - Email : test@example.com
   - Mot de passe : Test123!
   
3. Si inscription réussie ✅ :
   - L'API Railway fonctionne
   - La BDD PostgreSQL fonctionne
   - Le front-end Vercel fonctionne
   - CORS est correctement configuré

4. Si erreur ❌ :
   - Ouvrir la console navigateur (F12)
   - Vérifier le message d'erreur
   - Voir section "Problèmes fréquents" ci-dessous
```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE

### À chaque modification du code :

```powershell
# 1. Modifier votre code backend
# Par exemple : src/index.ts

# 2. Commiter
git add .
git commit -m "Ajout de nouvelles routes API"

# 3. Pousser
git push origin main

# 4. Railway déploie automatiquement ! (2-3 min)
# Voir les logs sur Railway Dashboard
```

---

## 🆘 PROBLÈMES FRÉQUENTS

### ❌ Build failed

**Logs Railway** : `npm ERR! code ELIFECYCLE`

**Solution** :
```powershell
# Tester localement
npm run build

# Corriger les erreurs TypeScript
# Recommiter et pousser
```

---

### ❌ Database connection failed

**Erreur** : `Can't reach database server`

**Solution** :
```
1. Railway → PostgreSQL → Vérifier qu'il est démarré (Running)

2. Backend → Variables → DATABASE_URL
   Doit être : ${{Postgres.DATABASE_URL}}
   
3. Ou copier manuellement depuis :
   PostgreSQL → Connect → Connection String
```

---

### ❌ CORS error depuis le front-end

**Console navigateur** : `Access to fetch blocked by CORS`

**Solution** :
```
1. Railway → Backend → Variables → FRONTEND_URL
   Vérifier : https://votre-app.vercel.app
   (Pas d'espace, pas de slash à la fin)

2. Dans src/index.ts :
   app.use(cors({
     origin: process.env.FRONTEND_URL,  // Pas '*'
     credentials: true
   }));

3. Recommiter et pousser
```

---

### ❌ Server not starting

**Logs** : `Error: Cannot find module`

**Solution** :
```
Vérifier package.json :
- "main": "dist/index.js" ✅
- "start": "node dist/index.js" ✅

Build command :
npm install && npx prisma generate && npm run build
```

---

### ❌ JWT_SECRET not defined

**Erreur** : `JWT_SECRET is not defined`

**Solution** :
```
Railway → Backend → Variables
Ajouter : JWT_SECRET avec une clé forte (32+ caractères)
```

---

## 📊 SURVEILLER VOTRE API

### Voir les logs en temps réel :

```
1. Railway → Service backend

2. Onglet "Deployments"

3. Cliquer sur le dernier déploiement

4. Logs s'affichent en temps réel :
   🚀 Server running on port 3000
   📡 Environment: production
```

### Voir les métriques :

```
1. Onglet "Metrics"

Affiche :
   - CPU usage
   - Memory usage
   - Network I/O
   - Request count
```

---

## 💰 SURVEILLER LES COÛTS

```
1. Dashboard Railway → Settings → Usage

Affiche :
   - Runtime hours utilisées / 500h
   - Estimation des coûts
   - Temps restant

Plan Hobby (Gratuit) :
   ✅ 5$/mois de crédit (~500h runtime)
   ✅ Suffisant pour 50-100 élèves
```

---

## 🎯 RÉCAPITULATIF VISUEL

```
┌─────────────────────────────────────────────┐
│  1. Créer projet backend localement         │
│     ↓                                        │
│  2. Installer dépendances (npm install)     │
│     ↓                                        │
│  3. Configurer package.json                 │
│     ↓                                        │
│  4. Créer src/index.ts                      │
│     ↓                                        │
│  5. Créer .gitignore                        │
│     ↓                                        │
│  6. Pousser sur GitHub (git push)           │
│     ↓                                        │
│  7. Créer compte Railway.app                │
│     ↓                                        │
│  8. New Project → Deploy from GitHub        │
│     ↓                                        │
│  9. Ajouter PostgreSQL (+ New → Database)   │
│     ↓                                        │
│ 10. Configurer variables d'environnement    │
│     ↓                                        │
│ 11. Configurer build/start commands         │
│     ↓                                        │
│ 12. Générer domaine public                  │
│     ↓                                        │
│ 13. Tester /health                          │
│     ↓                                        │
│ 14. Connecter au front-end Vercel           │
│     ↓                                        │
│ ✅ BACK-END EN LIGNE !                      │
│     https://votre-projet.railway.app        │
└─────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINALE

```
Avant de considérer le déploiement terminé :

- [ ] API accessible sur https://xxx.railway.app
- [ ] /health retourne {"status":"OK"}
- [ ] PostgreSQL connecté et migrations OK
- [ ] Toutes les variables d'environnement définies
- [ ] JWT_SECRET est une clé forte (32+ caractères)
- [ ] FRONTEND_URL pointe vers Vercel
- [ ] Front-end Vercel connecté à Railway
- [ ] Test d'inscription fonctionne
- [ ] CORS fonctionne (pas d'erreur console)
- [ ] Logs visibles sur Railway
- [ ] Déploiement automatique configuré
```

---

## 🚀 PROCHAINES ÉTAPES

```
1. Implémenter les routes API
   - /api/v1/auth/register
   - /api/v1/auth/login
   - /api/v1/courses
   - etc.

2. Tester avec Postman/Insomnia

3. Connecter le front-end

4. Ajouter des utilisateurs de test

5. Lancer la plateforme ! 🎉
```

---

**Temps total estimé** : 20-30 minutes  
**Coût** : 0€/mois (plan gratuit Railway)

**Votre back-end est maintenant déployé et opérationnel ! 🎉**

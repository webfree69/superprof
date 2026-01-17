# GUIDE DE DÉPLOIEMENT & MAINTENANCE

## 📋 Prérequis

### Compétences nécessaires
- Connaissances de base en ligne de commande
- Comprendre le fonctionnement d'un serveur web
- Savoir modifier des fichiers de configuration

### Matériel/Hébergement recommandé
- **Option 1 (Gratuit/Faible coût)** : Railway.app ou Render.com
- **Option 2 (Plus technique)** : VPS (OVH, Hetzner, DigitalOcean)
- **Base de données** : PostgreSQL (inclus dans Railway/Render)

---

## 🚀 ÉTAPE 1 : Préparation du code

### A. Cloner le dépôt Git
```bash
git clone <votre-repo>
cd plateforme-elearning
```

### B. Structure attendue
```
plateforme-elearning/
├── backend/          # API Node.js
├── frontend/         # Application React
├── .env.example      # Variables d'environnement exemple
└── README.md
```

---

## 🔧 ÉTAPE 2 : Configuration de la base de données

### A. Créer une base PostgreSQL

**Option Railway.app (recommandé pour débutants) :**
1. Créer un compte sur [railway.app](https://railway.app)
2. Créer un nouveau projet
3. Ajouter PostgreSQL depuis le catalogue
4. Copier l'URL de connexion (DATABASE_URL)

**Option locale (développement) :**
```bash
# Installer PostgreSQL
# Windows : télécharger depuis postgresql.org
# Mac : brew install postgresql
# Linux : sudo apt install postgresql

# Créer la base
psql -U postgres
CREATE DATABASE elearning_db;
```

### B. Configurer les variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/elearning_db

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire

# Port du serveur
PORT=3000

# CORS (URL du front-end)
FRONTEND_URL=http://localhost:5173

# Upload de fichiers
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Email (pour notifications - optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
```

### C. Initialiser la base de données

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

---

## ⚙️ ÉTAPE 3 : Déploiement du back-end

### Option A : Railway.app (RECOMMANDÉ)

1. **Se connecter à Railway**
   - Aller sur [railway.app](https://railway.app)
   - Se connecter avec GitHub

2. **Créer un nouveau projet**
   - Cliquer sur "New Project"
   - Sélectionner "Deploy from GitHub repo"
   - Choisir votre dépôt

3. **Ajouter la base de données**
   - Cliquer sur "+ New"
   - Sélectionner "Database → PostgreSQL"

4. **Configurer les variables d'environnement**
   - Aller dans l'onglet "Variables"
   - Ajouter toutes les variables du fichier `.env`
   - `DATABASE_URL` sera automatiquement connectée

5. **Configurer le déploiement**
   - Root directory : `backend`
   - Build command : `npm install && npx prisma generate && npm run build`
   - Start command : `npm start`

6. **Déployer**
   - Le déploiement se fait automatiquement
   - Récupérer l'URL publique (ex: `https://votre-app.railway.app`)

### Option B : VPS (Plus technique)

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib

# Cloner le projet
git clone <votre-repo>
cd plateforme-elearning/backend

# Installer les dépendances
npm install

# Configurer .env
nano .env
# (coller votre configuration)

# Migrer la base de données
npx prisma migrate deploy
npx prisma generate

# Compiler le TypeScript
npm run build

# Installer PM2 pour gérer le processus
sudo npm install -g pm2

# Démarrer l'application
pm2 start dist/index.js --name elearning-api
pm2 save
pm2 startup
```

---

## 🎨 ÉTAPE 4 : Déploiement du front-end

### Option A : Vercel (RECOMMANDÉ)

1. **Se connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub

2. **Importer le projet**
   - Cliquer sur "Add New → Project"
   - Sélectionner votre dépôt

3. **Configurer le build**
   - Framework Preset : Vite
   - Root Directory : `frontend`
   - Build Command : `npm run build`
   - Output Directory : `dist`

4. **Variables d'environnement**
   - Ajouter `VITE_API_URL=https://votre-backend.railway.app/api/v1`

5. **Déployer**
   - Cliquer sur "Deploy"
   - Récupérer l'URL (ex: `https://votre-app.vercel.app`)

### Option B : Netlify

Similaire à Vercel, très simple également.

---

## 🔒 ÉTAPE 5 : Sécurité post-déploiement

### A. Vérifications essentielles

```bash
# ✅ Checklist sécurité
- [ ] JWT_SECRET est une clé aléatoire forte (min 32 caractères)
- [ ] HTTPS activé (automatique sur Railway/Vercel)
- [ ] CORS configuré uniquement pour votre domaine front-end
- [ ] Rate limiting activé (100 req/15min)
- [ ] Mots de passe hashés avec bcrypt
- [ ] Variables d'environnement non commitées dans Git
- [ ] PostgreSQL accessible uniquement par l'API (pas d'accès public)
```

### B. Configuration CORS dans le backend

```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL, // Uniquement votre front-end
  credentials: true
}));
```

---

## 📊 ÉTAPE 6 : Créer le premier compte admin

### A. Script de création d'admin

```bash
cd backend
node scripts/create-admin.js
```

Contenu du script `scripts/create-admin.js` :

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@etablissement.fr';
  const password = 'MotDePasseTemporaire123!';
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'Principal',
      role: 'ADMIN',
      isActive: true,
      gdprConsent: true,
      gdprConsentDate: new Date()
    }
  });
  
  console.log('✅ Admin créé avec succès');
  console.log('Email:', email);
  console.log('Mot de passe:', password);
  console.log('⚠️  CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT après la première connexion');
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 🔄 MAINTENANCE COURANTE

### A. Mise à jour du contenu (professeur)

**Ajouter un cours :**
1. Se connecter avec le compte professeur
2. Aller dans "Mes cours" → "Créer un cours"
3. Remplir le titre, description, classe cible
4. Ajouter des ressources (PDF, vidéos)
5. Publier le cours

**Créer un quiz :**
1. Aller dans un cours → "Ajouter un quiz"
2. Remplir les questions et options
3. Définir la durée et le nombre de tentatives
4. Publier

### B. Gestion des utilisateurs

**Inscrire des élèves :**
- Option 1 : Les élèves s'inscrivent eux-mêmes via `/register`
- Option 2 : L'admin crée les comptes via l'interface admin

**Désactiver un compte :**
```sql
UPDATE users SET is_active = false WHERE id = X;
```

### C. Sauvegardes régulières

**Automatiser les backups PostgreSQL :**

Sur Railway :
- Les backups sont automatiques
- Restauration possible depuis le dashboard

Sur VPS :
```bash
# Créer un script de backup quotidien
sudo nano /etc/cron.daily/backup-db

#!/bin/bash
pg_dump -U postgres elearning_db > /backups/elearning_$(date +%Y%m%d).sql
# Garder seulement les 30 derniers jours
find /backups -name "elearning_*.sql" -mtime +30 -delete

# Rendre exécutable
sudo chmod +x /etc/cron.daily/backup-db
```

### D. Monitoring des erreurs

**Installer Sentry (optionnel mais recommandé) :**

```bash
npm install @sentry/node @sentry/react
```

Configuration gratuite sur [sentry.io](https://sentry.io)

---

## 🆘 RÉSOLUTION DES PROBLÈMES COURANTS

### Problème 1 : "Cannot connect to database"
**Solution :**
```bash
# Vérifier que DATABASE_URL est correct
echo $DATABASE_URL

# Tester la connexion
npx prisma db push
```

### Problème 2 : "CORS error" sur le front-end
**Solution :**
```typescript
// Vérifier que FRONTEND_URL dans .env backend correspond à l'URL réelle du front
FRONTEND_URL=https://votre-app.vercel.app
```

### Problème 3 : Upload de fichiers ne fonctionne pas
**Solution :**
```bash
# Créer le dossier uploads
mkdir -p backend/uploads

# Vérifier les permissions
chmod 755 backend/uploads
```

### Problème 4 : Token JWT expire trop vite
**Solution :**
```typescript
// Augmenter la durée dans authService.ts
const JWT_EXPIRES_IN = '30d'; // au lieu de '7d'
```

---

## 📞 SUPPORT & DOCUMENTATION

### Ressources utiles
- Documentation Prisma : https://www.prisma.io/docs
- Documentation Express : https://expressjs.com
- Documentation React : https://react.dev
- Documentation Railway : https://docs.railway.app
- Documentation Vercel : https://vercel.com/docs

### Logs et debugging

**Voir les logs en production (Railway) :**
- Aller dans votre projet Railway
- Cliquer sur l'onglet "Deployments"
- Voir les logs en temps réel

**Logs en local :**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT FINAL

Avant de mettre en production :

- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement définies
- [ ] Migration de la base exécutée
- [ ] Backend déployé et accessible
- [ ] Frontend déployé et connecté au backend
- [ ] HTTPS activé partout
- [ ] Compte admin créé et testé
- [ ] Premier cours créé pour test
- [ ] Premier quiz créé pour test
- [ ] Inscription d'un élève de test
- [ ] Test complet du parcours élève
- [ ] Sauvegarde automatique configurée
- [ ] Monitoring des erreurs activé (optionnel)

**VOTRE PLATEFORME EST PRÊTE ! 🎉**

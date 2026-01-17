# 🚀 GUIDE DE DÉMARRAGE RAPIDE - 15 MINUTES

## Objectif
Avoir un environnement de développement fonctionnel en 15 minutes.

---

## ✅ Prérequis (5 minutes)

### À installer si pas déjà présent :

1. **Node.js (version 18 ou supérieure)**
   - Windows : https://nodejs.org/
   - Mac : `brew install node`
   - Linux : `sudo apt install nodejs npm`
   - Vérifier : `node --version` (doit afficher v18.x ou plus)

2. **Git**
   - Windows : https://git-scm.com/download/win
   - Mac : `brew install git`
   - Linux : `sudo apt install git`
   - Vérifier : `git --version`

3. **PostgreSQL (version 14 ou supérieure)**
   - Windows : https://www.postgresql.org/download/windows/
   - Mac : `brew install postgresql@14`
   - Linux : `sudo apt install postgresql postgresql-contrib`
   - Vérifier : `psql --version`

4. **Un éditeur de code (recommandé : VS Code)**
   - https://code.visualstudio.com/

---

## 📦 Étape 1 : Créer le projet (3 minutes)

### Créer la structure de base

```powershell
# Créer le dossier principal
mkdir plateforme-elearning
cd plateforme-elearning

# Initialiser Git
git init

# Créer les dossiers principaux
mkdir backend
mkdir frontend
```

---

## 🔧 Étape 2 : Configurer le back-end (4 minutes)

### 2.1 Initialiser le projet Node.js

```powershell
cd backend
npm init -y
```

### 2.2 Installer les dépendances

```powershell
# Dépendances principales
npm install express prisma @prisma/client bcrypt jsonwebtoken cors dotenv helmet express-rate-limit

# Dépendances de développement
npm install -D typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors ts-node nodemon
```

### 2.3 Initialiser TypeScript

```powershell
npx tsc --init
```

### 2.4 Initialiser Prisma

```powershell
npx prisma init
```

### 2.5 Créer le fichier .env

```powershell
# Copier l'exemple de configuration
# (Utiliser le contenu de env-example-backend.txt)
```

Créer `backend/.env` avec ce contenu minimum :

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/elearning_db
JWT_SECRET=cle_secrete_minimum_32_caracteres_changez_moi_absolument
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 2.6 Créer la base de données

```powershell
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE elearning_db;

# Quitter
\q
```

### 2.7 Copier le schéma Prisma

Remplacer le contenu de `backend/prisma/schema.prisma` par le fichier **prisma-schema-example.prisma** fourni.

### 2.8 Migrer la base de données

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🎨 Étape 3 : Configurer le front-end (3 minutes)

### 3.1 Créer le projet Vite + React

```powershell
cd ../frontend
npm create vite@latest . -- --template react-ts
```

### 3.2 Installer les dépendances

```powershell
# Dépendances principales
npm install react-router-dom axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3.3 Configurer Tailwind

Éditer `frontend/tailwind.config.js` :

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Éditer `frontend/src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.4 Créer le fichier .env

Créer `frontend/.env` :

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Plateforme E-Learning BTS STMG
```

---

## 🚀 Étape 4 : Premier lancement (2 minutes)

### 4.1 Créer un fichier de démarrage du backend

Créer `backend/src/index.ts` :

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Route de test
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 4.2 Configurer les scripts npm

Éditer `backend/package.json`, ajouter :

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### 4.3 Démarrer le backend

```powershell
# Dans le terminal backend
npm run dev
```

Vous devriez voir : `🚀 Server running on http://localhost:3000`

### 4.4 Démarrer le frontend

```powershell
# Ouvrir un nouveau terminal
cd frontend
npm run dev
```

Vous devriez voir : `Local: http://localhost:5173/`

---

## ✅ Vérification

### Tester l'API

Ouvrir dans un navigateur :
- http://localhost:3000/api/v1/health

Vous devriez voir : `{"status":"OK","message":"API is running"}`

### Tester le front-end

Ouvrir dans un navigateur :
- http://localhost:5173

Vous devriez voir la page d'accueil Vite par défaut.

---

## 🎯 Prochaines étapes

Maintenant que l'environnement est fonctionnel :

1. ✅ **Implémenter l'authentification**
   - Créer les routes `/api/v1/auth/register` et `/api/v1/auth/login`
   - Utiliser les exemples de **backend-code-examples.ts**

2. ✅ **Créer les routes de base**
   - Suivre la documentation **api-endpoints.md**

3. ✅ **Créer les composants React**
   - Utiliser la structure de **architecture-frontend.md**
   - S'inspirer de **frontend-code-examples.tsx**

4. ✅ **Tester avec des données réelles**
   - Créer un compte admin
   - Ajouter des cours
   - Créer des quiz

---

## 🆘 Problèmes courants

### "Cannot connect to database"
```powershell
# Vérifier que PostgreSQL est démarré
# Windows : Services → PostgreSQL
# Mac/Linux : sudo service postgresql status

# Vérifier l'URL de connexion dans .env
echo $env:DATABASE_URL  # PowerShell
```

### "Port 3000 already in use"
```powershell
# Changer le port dans backend/.env
PORT=3001
```

### "Module not found"
```powershell
# Réinstaller les dépendances
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📚 Ressources utiles

- **Documentation complète** : Lire README.md
- **Architecture** : architecture-globale.md
- **Déploiement** : guide-deploiement.md
- **Exemples de code** : backend-code-examples.ts et frontend-code-examples.tsx

---

**Félicitations ! Votre environnement de développement est prêt ! 🎉**

**Temps total estimé : 15-20 minutes**

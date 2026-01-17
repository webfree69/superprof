# 🚀 GUIDE COMPLET - DÉPLOYER SUR VERCEL

## Vue d'ensemble

Vercel est une plateforme de déploiement gratuite et facile pour les applications React/Next.js.
Déploiement automatique à chaque push sur GitHub.

---

## 📋 PRÉREQUIS

- [ ] Compte GitHub (https://github.com)
- [ ] Compte Vercel (https://vercel.com)
- [ ] Git installé sur votre ordinateur
- [ ] Node.js installé

---

## 🎯 OPTION A : Déploiement depuis GitHub (RECOMMANDÉ)

### Étape 1 : Créer la structure du projet front-end

```powershell
# Se placer dans le dossier du projet
cd C:\Users\NH\Downloads\superprof

# Créer le dossier frontend
mkdir frontend
cd frontend

# Créer le projet React avec Vite
npm create vite@latest . -- --template react-ts

# Installer les dépendances
npm install
```

### Étape 2 : Installer les dépendances nécessaires

```powershell
# Dépendances principales
npm install react-router-dom axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Étape 3 : Configurer Tailwind CSS

Créer/éditer `tailwind.config.js` :

```javascript
/** @type {import('tailwindcss').Config} */
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

Éditer `src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Étape 4 : Créer le fichier .env

Créer `frontend/.env` :

```env
VITE_API_URL=https://votre-backend.railway.app/api/v1
VITE_APP_NAME=Plateforme E-Learning BTS STMG
```

### Étape 5 : Créer .gitignore

Créer `frontend/.gitignore` :

```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Vercel
.vercel
```

### Étape 6 : Initialiser Git et pousser sur GitHub

```powershell
# Initialiser Git dans le dossier frontend
cd C:\Users\NH\Downloads\superprof\frontend
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Frontend React"

# Créer un repository sur GitHub
# Aller sur https://github.com/new
# Nom : plateforme-elearning-frontend
# Visibilité : Privé (recommandé)
# Ne pas initialiser avec README

# Lier au repository GitHub (remplacer VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/plateforme-elearning-frontend.git

# Renommer la branche en main si nécessaire
git branch -M main

# Pousser le code
git push -u origin main
```

### Étape 7 : Déployer sur Vercel

#### 7.1 Se connecter à Vercel

1. Aller sur https://vercel.com
2. Cliquer sur **"Sign Up"** (ou "Log In" si vous avez déjà un compte)
3. Choisir **"Continue with GitHub"**
4. Autoriser Vercel à accéder à votre compte GitHub

#### 7.2 Importer le projet

1. Sur le dashboard Vercel, cliquer sur **"Add New"** → **"Project"**
2. Sélectionner votre repository `plateforme-elearning-frontend`
3. Cliquer sur **"Import"**

#### 7.3 Configurer le projet

**Framework Preset** : Vite  
**Root Directory** : `./` (ou `frontend` si tout le projet est dans un repo)  
**Build Command** : `npm run build`  
**Output Directory** : `dist`  
**Install Command** : `npm install`  

#### 7.4 Ajouter les variables d'environnement

Dans la section **"Environment Variables"** :

```
Name                 | Value
---------------------|----------------------------------------
VITE_API_URL         | https://votre-backend.railway.app/api/v1
VITE_APP_NAME        | Plateforme E-Learning BTS STMG
```

⚠️ **Important** : Remplacer `votre-backend.railway.app` par l'URL réelle de votre back-end

#### 7.5 Déployer

1. Cliquer sur **"Deploy"**
2. Attendre 1-2 minutes
3. Votre site sera disponible sur une URL type : `https://votre-projet.vercel.app`

---

## 🎯 OPTION B : Déploiement via CLI Vercel (Alternative)

### Étape 1 : Installer Vercel CLI

```powershell
npm install -g vercel
```

### Étape 2 : Se connecter

```powershell
vercel login
```

### Étape 3 : Déployer

```powershell
cd C:\Users\NH\Downloads\superprof\frontend
vercel
```

Suivre les instructions :
- Set up and deploy? **Yes**
- Which scope? Choisir votre compte
- Link to existing project? **No**
- What's your project's name? `plateforme-elearning-frontend`
- In which directory is your code located? `./`
- Want to override the settings? **No**

### Étape 4 : Ajouter les variables d'environnement

```powershell
# Ajouter VITE_API_URL
vercel env add VITE_API_URL

# Saisir la valeur quand demandé
# https://votre-backend.railway.app/api/v1

# Ajouter VITE_APP_NAME
vercel env add VITE_APP_NAME

# Saisir la valeur
# Plateforme E-Learning BTS STMG
```

### Étape 5 : Redéployer avec les variables

```powershell
vercel --prod
```

---

## ⚙️ CONFIGURATION AVANCÉE

### vercel.json (optionnel)

Créer `frontend/vercel.json` pour configuration avancée :

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE

### Configurer le déploiement continu

Une fois connecté à GitHub, Vercel déploie automatiquement :

✅ **À chaque push sur `main`** → Déploiement en production  
✅ **À chaque pull request** → Déploiement de preview  
✅ **À chaque branche** → URL de preview unique  

### Workflow typique

```powershell
# Modifier le code localement
# Par exemple, éditer src/App.tsx

# Commiter et pousser
git add .
git commit -m "Amélioration de l'interface"
git push origin main

# Vercel déploie automatiquement (1-2 min)
# Vérifier sur https://vercel.com/dashboard
```

---

## 🌐 UTILISER UN DOMAINE PERSONNALISÉ

### Étape 1 : Acheter un domaine

Options recommandées :
- Namecheap (8-12€/an)
- OVH (6-10€/an)
- Google Domains (10-15€/an)

### Étape 2 : Configurer sur Vercel

1. Aller dans votre projet Vercel
2. Onglet **"Settings"** → **"Domains"**
3. Cliquer sur **"Add"**
4. Entrer votre domaine : `elearning-bts.fr`
5. Cliquer sur **"Add"**

### Étape 3 : Configurer les DNS

Vercel vous donnera les enregistrements DNS à ajouter :

**Type A** :
```
Nom : @
Valeur : 76.76.21.21
```

**Type CNAME** :
```
Nom : www
Valeur : cname.vercel-dns.com
```

Ajouter ces enregistrements chez votre registrar de domaine.

### Étape 4 : Attendre la propagation

- Temps : 5 minutes à 48 heures (souvent <1h)
- Vérifier : https://dnschecker.org

---

## 🔒 SÉCURITÉ & PRODUCTION

### Checklist avant mise en production

- [ ] Variables d'environnement configurées
- [ ] `VITE_API_URL` pointe vers le back-end en production (pas localhost)
- [ ] HTTPS activé (automatique sur Vercel)
- [ ] Headers de sécurité configurés (vercel.json)
- [ ] Fichier .env ignoré par Git
- [ ] Tests effectués sur l'URL de preview

### Headers de sécurité (automatiques sur Vercel)

```
✅ HTTPS/TLS automatique
✅ Content Security Policy
✅ X-Frame-Options
✅ X-Content-Type-Options
✅ Strict-Transport-Security
```

---

## 📊 MONITORING & ANALYTICS

### Voir les déploiements

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur votre projet
3. Onglet **"Deployments"**

Vous verrez :
- Statut du déploiement (Success/Failed)
- Durée du build
- Logs détaillés
- URL de preview

### Activer Vercel Analytics (optionnel)

1. Onglet **"Analytics"**
2. Cliquer sur **"Enable Analytics"**
3. Gratuit pour 10k événements/mois

Voir :
- Nombre de visiteurs
- Pages les plus consultées
- Performance (Web Vitals)

---

## 🆘 RÉSOLUTION DES PROBLÈMES

### Problème 1 : Build failed

**Erreur** : `Failed to compile`

**Solutions** :
```powershell
# Vérifier que le build fonctionne localement
npm run build

# Si erreurs TypeScript, corriger les types
# Sinon, vérifier les imports manquants
```

### Problème 2 : Page blanche après déploiement

**Cause** : Problème de routing React Router

**Solution** : Ajouter dans `vercel.json` :
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Problème 3 : CORS error

**Erreur** : `Access to fetch at 'API_URL' has been blocked by CORS`

**Solution** : Configurer CORS sur le back-end :
```typescript
app.use(cors({
  origin: 'https://votre-app.vercel.app',
  credentials: true
}));
```

### Problème 4 : Variables d'environnement non définies

**Cause** : Mauvais préfixe ou non configurées sur Vercel

**Solutions** :
1. Vérifier que le préfixe est `VITE_` (pas `REACT_APP_`)
2. Reconfigurer dans Vercel → Settings → Environment Variables
3. Redéployer après ajout de variables

### Problème 5 : 404 sur les routes

**Cause** : Vercel ne connaît pas vos routes React

**Solution** : Utiliser `vercel.json` avec rewrites (voir ci-dessus)

---

## 🔄 MISES À JOUR

### Mettre à jour le site

```powershell
# Modifier le code
# ...

# Commiter et pousser
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main

# Vercel déploie automatiquement
```

### Rollback en cas de problème

1. Aller sur Vercel Dashboard
2. Onglet **"Deployments"**
3. Trouver le déploiement précédent qui fonctionnait
4. Cliquer sur les 3 points → **"Promote to Production"**

---

## 📈 OPTIMISATIONS

### 1. Activer la compression

Automatique sur Vercel (Gzip + Brotli)

### 2. Optimiser les images

```powershell
npm install sharp
```

Utiliser `next/image` ou compresser manuellement.

### 3. Code splitting

Vite le fait automatiquement, mais vous pouvez optimiser :

```typescript
// Lazy loading des pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
```

### 4. Activer le cache

Dans `vercel.json` :
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 💰 COÛTS

### Plan Hobby (Gratuit)
✅ Déploiements illimités  
✅ Bande passante : 100 GB/mois  
✅ HTTPS automatique  
✅ Déploiement continu  
✅ Domaine personnalisé  
✅ Preview deployments  

**Suffisant pour 500-1000 élèves**

### Plan Pro (20$/mois si dépassement)
- Bande passante : 1 TB/mois
- Performances améliorées
- Support prioritaire
- Analytics avancés

---

## ✅ CHECKLIST FINALE

Avant de partager l'URL avec vos élèves :

- [ ] Site déployé et accessible
- [ ] `VITE_API_URL` pointe vers le back-end en production
- [ ] Authentification fonctionne
- [ ] Les cours s'affichent correctement
- [ ] Les quiz fonctionnent
- [ ] Dashboard élève OK
- [ ] Dashboard professeur OK
- [ ] Test sur mobile/tablette
- [ ] Test sur Chrome/Firefox/Safari
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS activé (automatique)

---

## 🎯 RÉSUMÉ RAPIDE

```powershell
# 1. Créer le projet
cd C:\Users\NH\Downloads\superprof\frontend
npm create vite@latest . -- --template react-ts
npm install

# 2. Pousser sur GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/repo.git
git push -u origin main

# 3. Déployer sur Vercel
# Aller sur vercel.com
# Import project depuis GitHub
# Configurer VITE_API_URL
# Deploy

# 4. Votre site est en ligne !
# https://votre-projet.vercel.app
```

---

## 📞 SUPPORT

### Documentation officielle
- Vercel : https://vercel.com/docs
- Vite : https://vitejs.dev/guide/

### En cas de problème
1. Vérifier les logs sur Vercel Dashboard
2. Tester localement avec `npm run build && npm run preview`
3. Consulter la FAQ Vercel
4. Communauté Discord Vercel

---

**Votre front-end est maintenant déployé et accessible publiquement ! 🎉**

**URL de production** : `https://votre-projet.vercel.app`

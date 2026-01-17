# 🚀 DÉPLOIEMENT VERCEL - GUIDE VISUEL ÉTAPE PAR ÉTAPE

## 📋 MÉTHODE LA PLUS SIMPLE (Sans code - 10 minutes)

Si vous avez déjà le code front-end prêt, suivez ces étapes :

---

## ÉTAPE 1 : Créer un compte GitHub (si pas déjà fait)

```
1. Aller sur https://github.com
2. Cliquer sur "Sign up"
3. Choisir un nom d'utilisateur
4. Entrer votre email
5. Créer un mot de passe
6. Vérifier votre email
```

---

## ÉTAPE 2 : Créer un repository GitHub

```
1. Se connecter à GitHub
2. Cliquer sur le "+" en haut à droite
3. Sélectionner "New repository"

Remplir :
   Repository name : plateforme-elearning-frontend
   Description     : Plateforme e-learning BTS STMG - Front-end
   Visibility      : Private (recommandé)
   
   ❌ NE PAS cocher "Add a README file"
   ❌ NE PAS ajouter .gitignore
   ❌ NE PAS choisir de licence

4. Cliquer sur "Create repository"
```

---

## ÉTAPE 3 : Pousser votre code sur GitHub

### Ouvrir PowerShell et exécuter :

```powershell
# Aller dans votre dossier frontend
cd C:\Users\NH\Downloads\superprof\frontend

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit"

# Ajouter le repository distant (REMPLACER votre-username)
git remote add origin https://github.com/votre-username/plateforme-elearning-frontend.git

# Renommer la branche en main
git branch -M main

# Pousser le code
git push -u origin main
```

**💡 Remplacer `votre-username` par votre nom d'utilisateur GitHub**

---

## ÉTAPE 4 : Créer un compte Vercel

```
1. Aller sur https://vercel.com
2. Cliquer sur "Sign Up"
3. Choisir "Continue with GitHub"
4. Se connecter avec votre compte GitHub
5. Autoriser Vercel (cliquer "Authorize Vercel")
```

---

## ÉTAPE 5 : Importer le projet sur Vercel

```
1. Vous êtes maintenant sur le Dashboard Vercel
2. Cliquer sur "Add New..." (bouton noir en haut à droite)
3. Sélectionner "Project"

4. Vous voyez la liste de vos repositories GitHub
5. Chercher "plateforme-elearning-frontend"
6. Cliquer sur "Import" à côté du repository
```

---

## ÉTAPE 6 : Configurer le projet

### Section "Configure Project"

```
Framework Preset : Vite
   (Vercel détecte automatiquement)

Root Directory : ./
   (Laisser par défaut)

Build and Output Settings :
   Build Command    : npm run build
   Output Directory : dist
   Install Command  : npm install
   
   (Tout est détecté automatiquement, ne rien changer)
```

---

## ÉTAPE 7 : Ajouter les variables d'environnement

### Descendre jusqu'à "Environment Variables"

```
Cliquer sur "Add" pour chaque variable :

Variable 1 :
   Name  : VITE_API_URL
   Value : https://votre-backend.railway.app/api/v1
   ☑️ Production
   ☑️ Preview
   ☑️ Development
   Cliquer "Save"

Variable 2 :
   Name  : VITE_APP_NAME
   Value : Plateforme E-Learning BTS STMG
   ☑️ Production
   ☑️ Preview
   ☑️ Development
   Cliquer "Save"
```

**⚠️ IMPORTANT** : Remplacer `votre-backend.railway.app` par l'URL réelle de votre API

---

## ÉTAPE 8 : Déployer !

```
1. Cliquer sur le bouton "Deploy" (en bas)

2. Attendre... (1-2 minutes)
   Vous verrez :
   - Building...
   - Assigning domains...
   - Finalizing...

3. ✅ Congratulations! 🎉

4. Votre site est en ligne !
   URL : https://nom-du-projet-random.vercel.app
```

---

## ÉTAPE 9 : Vérifier que ça fonctionne

```
1. Cliquer sur "Visit" ou copier l'URL

2. Votre site s'ouvre dans le navigateur

3. Vérifier :
   ✅ La page d'accueil s'affiche
   ✅ Pas d'erreurs dans la console (F12)
   ✅ Le design Tailwind est appliqué
   
4. Tester la connexion à l'API :
   - Essayer de se connecter
   - Si erreur CORS, voir plus bas
```

---

## ÉTAPE 10 : Configurer le back-end pour autoriser Vercel

### Sur votre back-end (Railway), ajouter l'URL Vercel au CORS :

```javascript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',  // Développement local
    'https://votre-app.vercel.app'  // Production Vercel
  ],
  credentials: true
}));
```

Ou via variable d'environnement sur Railway :

```
FRONTEND_URL=https://votre-app.vercel.app
```

Puis dans le code :

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 🔄 DÉPLOIEMENT AUTOMATIQUE

### Maintenant, à chaque modification :

```powershell
# 1. Modifier votre code localement
# Par exemple : src/App.tsx

# 2. Commiter les changements
git add .
git commit -m "Amélioration de l'interface"

# 3. Pousser sur GitHub
git push origin main

# 4. Vercel déploie automatiquement !
# Aller sur https://vercel.com/dashboard pour voir
```

**⏱️ Temps de déploiement automatique : 1-2 minutes**

---

## 🌐 UTILISER UN DOMAINE PERSONNALISÉ (Optionnel)

### Si vous voulez `elearning-bts.fr` au lieu de `xyz.vercel.app` :

```
1. Acheter un domaine (Namecheap, OVH, etc.)
   Coût : ~10€/an

2. Sur Vercel :
   - Aller dans votre projet
   - Settings → Domains
   - Cliquer "Add"
   - Entrer votre domaine : elearning-bts.fr
   - Cliquer "Add"

3. Vercel vous donne des DNS à configurer :
   Copier les valeurs

4. Aller chez votre registrar (Namecheap/OVH)
   - DNS Management
   - Ajouter les enregistrements fournis par Vercel
   
5. Attendre 5 min à 24h (souvent <1h)

6. Votre site est sur votre domaine !
   https://elearning-bts.fr
```

---

## 🔍 VOIR LES LOGS ET DÉPLOIEMENTS

### Sur Vercel Dashboard :

```
1. Cliquer sur votre projet

2. Onglets disponibles :
   
   📊 Deployments :
      - Voir tous les déploiements
      - Logs détaillés
      - Rollback si besoin
   
   ⚙️ Settings :
      - Variables d'environnement
      - Domaines
      - Configuration
   
   📈 Analytics (optionnel) :
      - Nombre de visiteurs
      - Performance
```

---

## 🆘 PROBLÈMES FRÉQUENTS

### ❌ Erreur : "Build failed"

**Solution** :
```powershell
# Tester le build localement
cd frontend
npm run build

# Corriger les erreurs TypeScript
# Puis recommiter et pousser
```

### ❌ Page blanche après déploiement

**Solution** : Créer `vercel.json` :
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

### ❌ Erreur CORS

**Solution** : Configurer le back-end (voir étape 10)

### ❌ Variables d'environnement non définies

**Solution** :
```
1. Vercel → Projet → Settings → Environment Variables
2. Vérifier que VITE_API_URL est bien défini
3. Vérifier le préfixe VITE_ (pas REACT_APP_)
4. Redéployer : Deployments → ... → Redeploy
```

---

## ✅ CHECKLIST FINALE

Avant de partager l'URL :

```
- [ ] Site accessible sur l'URL Vercel
- [ ] Page d'accueil s'affiche correctement
- [ ] Design Tailwind appliqué
- [ ] Connexion à l'API fonctionne
- [ ] Login/Register fonctionnent
- [ ] Pas d'erreurs dans la console (F12)
- [ ] Test sur mobile (responsive)
- [ ] Test sur Chrome/Firefox/Safari
- [ ] CORS configuré sur le back-end
- [ ] Variables d'environnement correctes
```

---

## 📱 PARTAGER AVEC VOS ÉLÈVES

Une fois déployé :

```
📧 Email type :

Bonjour,

La plateforme e-learning est maintenant en ligne !

🌐 Accès : https://votre-app.vercel.app

Pour vous connecter :
1. Cliquer sur "S'inscrire"
2. Entrer votre email @etablissement.fr
3. Créer un mot de passe
4. Accepter les conditions RGPD
5. Se connecter

Bon apprentissage !
```

---

## 🎯 RÉCAPITULATIF VISUEL

```
┌─────────────────────────────────────────────────┐
│  1. Créer compte GitHub                         │
│     ↓                                            │
│  2. Créer repository                            │
│     ↓                                            │
│  3. Pousser le code (git push)                  │
│     ↓                                            │
│  4. Créer compte Vercel                         │
│     ↓                                            │
│  5. Importer le projet                          │
│     ↓                                            │
│  6. Configurer (Vite, dist, etc.)               │
│     ↓                                            │
│  7. Ajouter variables d'environnement           │
│     ↓                                            │
│  8. Déployer (clic sur Deploy)                  │
│     ↓                                            │
│  9. Vérifier que ça fonctionne                  │
│     ↓                                            │
│ 10. Configurer CORS sur le back-end             │
│     ↓                                            │
│ ✅ SITE EN LIGNE !                              │
│     https://votre-app.vercel.app                │
└─────────────────────────────────────────────────┘
```

---

## 💡 ASTUCE PRO

### Créer des environnements de preview

Chaque branche GitHub = URL de preview automatique

```powershell
# Créer une branche de dev
git checkout -b dev

# Modifier le code
# ...

# Commiter et pousser
git push origin dev

# Vercel crée automatiquement une URL :
# https://votre-app-git-dev-username.vercel.app

# Tester avant de merger dans main
```

---

## 📊 STATISTIQUES

### Avec le plan gratuit Vercel Hobby :

```
✅ Déploiements : Illimités
✅ Bande passante : 100 GB/mois
✅ Build time : 100h/mois
✅ HTTPS : Automatique
✅ Domaine perso : 1 domaine inclus

💰 Coût : 0€/mois

Suffisant pour :
- 500-1000 élèves simultanés
- 10 000+ visites/mois
- 100+ déploiements/mois
```

---

**Votre front-end est maintenant déployé sur Vercel ! 🎉**

**Prochaine étape** : Déployer le back-end sur Railway.app  
(Voir `guide-deploiement.md`)

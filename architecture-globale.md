# ARCHITECTURE GLOBALE DE LA PLATEFORME E-LEARNING BTS STMG

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEURS                             │
│  (Élèves, Professeurs, Administrateurs)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONT-END (React + Vite)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Dashboard   │  │ Cours & Quiz │  │ Gestion des notes  │    │
│  │ Élève/Prof  │  │              │  │ et progression     │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
│                                                                 │
│  Technologies: React, TypeScript, Tailwind CSS, React Router   │
│  Hébergement: Vercel ou Netlify                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                        HTTPS/REST API
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACK-END API (Node.js + Express)                │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Authentif.   │  │ Gestion     │  │ Quiz & Évaluation    │  │
│  │ JWT + bcrypt │  │ Cours       │  │                      │  │
│  └──────────────┘  └─────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Upload       │  │ Stats &     │  │ Logs RGPD            │  │
│  │ Fichiers     │  │ Reporting   │  │ & Sécurité           │  │
│  └──────────────┘  └─────────────┘  └──────────────────────┘  │
│                                                                 │
│  Middleware: Auth JWT, CORS, Rate Limiting, Helmet             │
│  ORM: Prisma                                                    │
│  Hébergement: Railway.app ou VPS                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BASE DE DONNÉES (PostgreSQL)                   │
│  ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Users   │ │Courses │ │Quizzes │ │Attempts  │ │Activity  │  │
│  │         │ │        │ │        │ │          │ │Logs      │  │
│  └─────────┘ └────────┘ └────────┘ └──────────┘ └──────────┘  │
│                                                                 │
│  Relations complexes avec contraintes d'intégrité              │
│  Index optimisés pour les requêtes fréquentes                  │
│  Hébergement: Railway.app PostgreSQL ou AWS RDS                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STOCKAGE FICHIERS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ PDF de cours │  │ Vidéos       │  │ Documents élèves     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Options: Cloudinary, AWS S3, ou système de fichiers local     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flux de données principaux

### 1. Authentification & Autorisation
```
Utilisateur → Login Form (Front)
              ↓
         POST /api/v1/auth/login
              ↓
         Vérification email/password (bcrypt)
              ↓
         Génération JWT token
              ↓
         Retour token + infos user
              ↓
         Stockage localStorage (Front)
              ↓
         Toutes requêtes suivantes incluent:
         Header: Authorization: Bearer <token>
```

### 2. Consultation d'un cours (Élève)
```
Élève clique sur un cours
         ↓
    GET /api/v1/courses/:id
         ↓
    Middleware vérifie JWT
         ↓
    Vérification rôle & classe
         ↓
    Prisma récupère cours + ressources
         ↓
    Retour JSON au front
         ↓
    Affichage cours + lecture PDF/vidéo
         ↓
    POST /api/v1/resources/:id/view
         ↓
    Enregistrement dans student_progress
```

### 3. Passage d'un quiz
```
Élève démarre quiz
         ↓
    POST /api/v1/quizzes/:id/start
         ↓
    Vérification tentatives restantes
         ↓
    Création quiz_attempt
         ↓
    Retour questions (sans bonnes réponses)
         ↓
    Élève répond aux questions
         ↓
    POST /api/v1/quizzes/:id/submit
         ↓
    Calcul automatique du score
         ↓
    Enregistrement student_answers
         ↓
    Mise à jour quiz_attempt (score, %)
         ↓
    Retour résultat détaillé
```

### 4. Création d'un cours (Professeur)
```
Professeur → Formulaire création cours
         ↓
    POST /api/v1/courses
         ↓
    Middleware vérifie rôle=TEACHER
         ↓
    Prisma crée le cours
         ↓
    Upload ressources (multipart/form-data)
         ↓
    POST /api/v1/courses/:id/resources
         ↓
    Stockage fichiers (Cloudinary/S3/local)
         ↓
    Création resource en BDD
         ↓
    Publication du cours (is_published=true)
         ↓
    Visible par les élèves de la classe
```

### 5. Tableau de bord professeur
```
Professeur → Dashboard
         ↓
    GET /api/v1/teachers/dashboard
         ↓
    Middleware vérifie rôle=TEACHER
         ↓
    Requêtes Prisma multiples:
    - Nombre d'élèves actifs
    - Moyenne de classe
    - Dernières activités
    - Élèves en difficulté (<50%)
         ↓
    Agrégation des données
         ↓
    Retour JSON avec statistiques
         ↓
    Affichage graphiques (Chart.js)
```

---

## Modèle de sécurité

### Couches de protection

```
1. TRANSPORT
   └─ HTTPS obligatoire en production
   └─ Certificats SSL/TLS (gratuit via Let's Encrypt)

2. AUTHENTIFICATION
   └─ Mots de passe hashés (bcrypt, 10 rounds)
   └─ JWT avec expiration (7-30 jours)
   └─ Refresh token pour renouvellement

3. AUTORISATION
   └─ Middleware de vérification de rôle
   └─ Vérification ownership (prof → ses cours)
   └─ Validation des paramètres d'entrée

4. DONNÉES SENSIBLES
   └─ Variables d'environnement (.env)
   └─ Secrets jamais commitées dans Git
   └─ Chiffrement côté base (PostgreSQL transparent)

5. INJECTION & XSS
   └─ Prisma protège contre SQL injection
   └─ Validation des inputs (express-validator)
   └─ Sanitization HTML (DOMPurify côté front)

6. RATE LIMITING
   └─ 100 requêtes / 15 min par IP
   └─ Protection contre brute force

7. CONFORMITÉ RGPD
   └─ Consentement explicite à l'inscription
   └─ Droit à l'export des données
   └─ Droit à l'oubli (suppression compte)
   └─ Logs d'activité pour traçabilité
   └─ Conservation limitée des données
```

---

## Choix techniques justifiés

### Pourquoi Node.js + Express ?
✅ JavaScript partout (front + back)
✅ Écosystème riche (npm)
✅ Performances I/O non-bloquantes
✅ Communauté active et documentation abondante
✅ Facilité de déploiement

### Pourquoi PostgreSQL ?
✅ Base relationnelle robuste (ACID)
✅ Gratuit et open-source
✅ Gestion parfaite des relations complexes
✅ Index performants
✅ Conforme RGPD (export, suppression)

### Pourquoi Prisma ORM ?
✅ TypeScript natif (typage fort)
✅ Migration de schéma facilitée
✅ Protection SQL injection automatique
✅ Requêtes optimisées
✅ Interface graphique Prisma Studio

### Pourquoi React + Vite ?
✅ Composants réutilisables
✅ Vite ultra-rapide en développement
✅ Écosystème mature
✅ Tailwind pour design rapide
✅ TypeScript pour fiabilité

### Pourquoi Railway/Vercel ?
✅ Déploiement en 1 clic
✅ HTTPS automatique
✅ Gratuit pour petits projets
✅ Scaling automatique
✅ CI/CD intégré
✅ Pas besoin de compétences DevOps avancées

---

## Coûts estimés

### Option hébergement gratuit (jusqu'à ~100 élèves)
- **Railway.app** : Gratuit jusqu'à $5/mois de crédit
- **Vercel** : Gratuit pour projets personnels
- **PostgreSQL** : Inclus dans Railway (500MB)
- **Total** : 0€/mois

### Option hébergement professionnel (200-500 élèves)
- **Railway Pro** : ~20$/mois
- **Stockage fichiers (Cloudinary)** : 0-25$/mois
- **Nom de domaine** : ~10€/an
- **Total** : ~25-30€/mois (~300€/an)

### Option VPS auto-géré (500+ élèves)
- **VPS Hetzner CX21** : ~5€/mois
- **PostgreSQL** : Inclus
- **Stockage** : 40GB SSD inclus
- **Nom de domaine** : ~10€/an
- **Total** : ~70€/an

---

## Prochaines étapes recommandées

### Immédiat (Semaine 1)
1. Initialiser le projet Git
2. Configurer la structure back-end (Express + Prisma)
3. Configurer la structure front-end (Vite + React)
4. Créer le schéma Prisma
5. Migrer la base de données

### Court terme (Semaines 2-4)
1. Implémenter l'authentification
2. Créer les endpoints CRUD des cours
3. Créer les endpoints CRUD des quiz
4. Développer les composants front-end de base
5. Connecter front et back

### Moyen terme (Mois 2)
1. Upload de fichiers (PDF, vidéos)
2. Tableaux de bord (élève + professeur)
3. Système de notation automatique
4. Export CSV des résultats
5. Tests avec une classe pilote

### Long terme (Mois 3+)
1. Stabiliser et corriger les bugs
2. Former les professeurs
3. Déployer en production
4. Suivre le plan d'évolution (gamification, notifications, etc.)

---

## Ressources et documentation

### Tutoriels utiles
- **Prisma** : https://www.prisma.io/docs/getting-started
- **Express + TypeScript** : https://blog.logrocket.com/how-to-set-up-node-typescript-express/
- **React + Vite** : https://vitejs.dev/guide/
- **Tailwind CSS** : https://tailwindcss.com/docs

### Communautés d'aide
- Stack Overflow (tag : express, react, prisma)
- Discord : Reactiflux, Node.js
- Reddit : r/node, r/reactjs

---

**Cette architecture est conçue pour être :**
- ✅ Simple à maintenir
- ✅ Évolutive selon les besoins
- ✅ Sécurisée et conforme RGPD
- ✅ Économique en hébergement
- ✅ Accessible aux non-développeurs experts

**Bonne construction de votre plateforme e-learning ! 🚀**

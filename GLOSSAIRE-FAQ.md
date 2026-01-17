# 📖 GLOSSAIRE & FAQ

## Glossaire des termes techniques

### A

**API (Application Programming Interface)**
Interface qui permet à deux applications de communiquer. Dans notre cas, le front-end (React) communique avec le back-end (Express) via une API REST.

**Authentification**
Processus de vérification de l'identité d'un utilisateur (login/mot de passe).

**Autorisation**
Processus de vérification des droits d'un utilisateur (ce qu'il peut faire ou non).

**Axios**
Bibliothèque JavaScript pour faire des requêtes HTTP depuis le navigateur.

### B

**Back-end**
Partie "serveur" de l'application, invisible pour l'utilisateur. Gère la logique métier, la base de données, la sécurité.

**bcrypt**
Algorithme de hashage sécurisé pour les mots de passe. Rend impossible la récupération du mot de passe original.

### C

**CORS (Cross-Origin Resource Sharing)**
Mécanisme de sécurité qui permet à un site web d'autoriser des requêtes depuis un autre domaine.

**CRUD (Create, Read, Update, Delete)**
Les 4 opérations de base sur les données : Créer, Lire, Modifier, Supprimer.

**CSV (Comma-Separated Values)**
Format de fichier pour exporter des données (type Excel simple).

### D

**Database (Base de données)**
Système de stockage organisé des données. Nous utilisons PostgreSQL.

**Déploiement**
Action de mettre l'application en ligne pour qu'elle soit accessible publiquement.

### E

**Endpoint**
Point d'accès de l'API. Exemple : `GET /api/v1/courses` est un endpoint pour récupérer les cours.

**Express.js**
Framework web pour Node.js, simplifie la création d'API.

### F

**Front-end**
Partie "client" de l'application, visible dans le navigateur. Interface utilisateur.

### G

**GDPR / RGPD (Règlement Général sur la Protection des Données)**
Loi européenne protégeant les données personnelles des utilisateurs.

### H

**Hash**
Transformation irréversible d'une donnée (mot de passe) en chaîne aléatoire.

**HTTPS**
Version sécurisée du protocole HTTP, chiffre les communications.

### J

**JSON (JavaScript Object Notation)**
Format de données structuré utilisé pour échanger des informations entre le front et le back.
```json
{"nom": "Dupont", "prenom": "Jean", "age": 18}
```

**JWT (JSON Web Token)**
Token d'authentification sécurisé, permet de rester connecté sans renvoyer le mot de passe à chaque requête.

### M

**Middleware**
Fonction intermédiaire qui s'exécute avant le traitement d'une requête (ex: vérifier le token JWT).

**Migration**
Modification de la structure de la base de données (ajout de table, colonne, etc.).

### N

**Node.js**
Environnement d'exécution JavaScript côté serveur.

**npm (Node Package Manager)**
Gestionnaire de paquets pour installer des bibliothèques JavaScript.

### O

**ORM (Object-Relational Mapping)**
Outil qui simplifie l'interaction avec la base de données. Nous utilisons Prisma.

### P

**PostgreSQL**
Système de gestion de base de données relationnelle open-source.

**Prisma**
ORM moderne pour Node.js avec TypeScript.

**PWA (Progressive Web App)**
Application web qui fonctionne comme une app native (installable, hors-ligne).

### R

**React**
Bibliothèque JavaScript pour construire des interfaces utilisateur.

**REST (Representational State Transfer)**
Architecture standard pour créer des API web.

**RBAC (Role-Based Access Control)**
Contrôle d'accès basé sur les rôles (élève, professeur, admin).

**Rate Limiting**
Limitation du nombre de requêtes par utilisateur pour éviter les abus.

### S

**SQL (Structured Query Language)**
Langage pour interroger les bases de données relationnelles.

**SSL/TLS**
Protocoles de sécurisation des communications (HTTPS).

### T

**Tailwind CSS**
Framework CSS utilitaire pour créer rapidement des interfaces modernes.

**Token**
Chaîne de caractères unique servant à identifier un utilisateur authentifié.

**TypeScript**
Surcouche de JavaScript avec typage fort, réduit les erreurs.

### V

**Vite**
Outil de build ultra-rapide pour les applications front-end modernes.

**VPS (Virtual Private Server)**
Serveur virtuel pour héberger votre application.

---

## ❓ FAQ (Questions Fréquentes)

### Questions Générales

**Q : Combien de temps faut-il pour développer cette plateforme ?**
R : Pour un MVP fonctionnel :
- Développeur expérimenté : 4-6 semaines
- Développeur débutant : 8-12 semaines
- Avec aide externe : 2-4 semaines

**Q : Quel est le coût total pour démarrer ?**
R : Avec Railway.app et Vercel : **0€/mois** jusqu'à 100 élèves actifs.
Ensuite environ 30€/mois pour 200-500 élèves.

**Q : Peut-on utiliser cette plateforme pour d'autres matières que le BTS STMG ?**
R : Absolument ! L'architecture est générique et adaptable à n'importe quelle matière ou niveau.

**Q : Est-ce conforme au RGPD ?**
R : Oui, l'architecture intègre toutes les mesures nécessaires :
- Consentement explicite
- Droit d'accès et d'export
- Droit à l'oubli
- Logs d'activité

**Q : Peut-on l'utiliser en classe sans connexion internet ?**
R : Pas par défaut, mais la phase 2 du plan d'évolution prévoit un mode hors-ligne (PWA).

---

### Questions Techniques

**Q : Pourquoi Node.js et pas PHP/Python/Java ?**
R : 
- JavaScript partout (front + back = même langage)
- Écosystème riche (npm)
- Performance excellente pour les API REST
- Facilité de déploiement
- Documentation abondante

**Q : Pourquoi PostgreSQL et pas MySQL/MongoDB ?**
R :
- PostgreSQL est plus robuste et moderne que MySQL
- Supporte mieux les relations complexes que MongoDB
- Open-source et gratuit
- Excellent support JSON si besoin

**Q : Peut-on changer de stack technologique ?**
R : Oui, l'architecture reste valable. Le schéma de BDD et les endpoints API peuvent être réimplémentés dans n'importe quel langage.

**Q : Où sont stockés les fichiers PDF et vidéos ?**
R : 3 options :
1. Stockage local (simple mais limité)
2. Cloudinary (recommandé, gratuit jusqu'à 25GB)
3. AWS S3 (pour grandes volumétries)

**Q : Comment gérer les grosses vidéos ?**
R : 2 approches :
1. Les héberger sur YouTube/Vimeo et mettre le lien
2. Les compresser avant upload
3. Utiliser un CDN (Cloudinary, AWS CloudFront)

---

### Questions Sécurité

**Q : Les mots de passe sont-ils sécurisés ?**
R : Oui, ils sont hashés avec bcrypt (10 rounds). Impossible de les récupérer en clair.

**Q : Que se passe-t-il si quelqu'un vole le token JWT ?**
R : Le token expire au bout de 7-30 jours. De plus, l'utilisation de HTTPS empêche l'interception.

**Q : Comment protéger contre les attaques par force brute ?**
R : Rate limiting : 100 requêtes maximum par 15 minutes par IP.

**Q : Les données sont-elles chiffrées ?**
R : Oui :
- En transit : HTTPS (TLS/SSL)
- Au repos : chiffrement de PostgreSQL (optionnel mais recommandé)

**Q : Que faire en cas de faille de sécurité ?**
R :
1. Couper l'accès si critique
2. Corriger immédiatement
3. Informer la CNIL si données personnelles exposées
4. Informer les utilisateurs concernés

---

### Questions Déploiement

**Q : Faut-il des compétences DevOps ?**
R : Non, avec Railway.app et Vercel, tout est automatisé. Suivre simplement le guide de déploiement.

**Q : Peut-on déployer sur son propre serveur ?**
R : Oui, le guide-deploiement.md explique comment utiliser un VPS.

**Q : Comment faire les mises à jour ?**
R : Avec Railway/Vercel :
- Pousser sur GitHub
- Déploiement automatique (CI/CD)

**Q : Comment faire une sauvegarde de la base de données ?**
R : Sur Railway : automatique quotidiennement.
Sur VPS : script cron fourni dans le guide.

**Q : Que faire si le site tombe ?**
R :
1. Vérifier les logs (Railway Dashboard)
2. Vérifier les variables d'environnement
3. Vérifier la connexion base de données
4. Contacter le support Railway si nécessaire

---

### Questions Fonctionnelles

**Q : Peut-on créer des quiz avec plusieurs bonnes réponses ?**
R : Oui, le type `MULTIPLE` est prévu dans le schéma de BDD.

**Q : Comment corriger les réponses courtes automatiquement ?**
R : Phase 1 : correction manuelle par le professeur.
Phase 4 : utilisation d'IA (OpenAI) pour correction automatique.

**Q : Les élèves peuvent-ils refaire un quiz ?**
R : Oui, le professeur définit le nombre de tentatives autorisées (`maxAttempts`).

**Q : Peut-on importer des quiz depuis un fichier Excel ?**
R : Pas dans le MVP, mais facile à ajouter en phase 2.

**Q : Les élèves peuvent-ils discuter entre eux ?**
R : Pas dans le MVP. Prévu en phase 3 (forum de discussion).

**Q : Peut-on organiser des classes virtuelles (visio) ?**
R : Pas dans le MVP. Prévu en phase 3 avec intégration Jitsi Meet.

---

### Questions RGPD

**Q : Que contient l'export de données RGPD ?**
R : Toutes les données personnelles :
- Informations de profil
- Résultats aux quiz
- Commentaires postés
- Historique de connexions
- Temps passé sur chaque cours

**Q : Comment un élève peut-il supprimer son compte ?**
R : Demande via l'interface ou contact avec l'admin. Suppression complète dans les 30 jours.

**Q : Combien de temps les données sont conservées ?**
R : Configurable. Par défaut :
- Logs d'activité : 1 an
- Résultats des quiz : illimité (sauf demande de suppression)
- Comptes inactifs : à définir selon votre politique

**Q : Faut-il déclarer la plateforme à la CNIL ?**
R : Oui, un registre des traitements doit être tenu. Pas de déclaration préalable nécessaire depuis le RGPD, mais obligation de tenir un registre interne.

---

### Questions Pédagogiques

**Q : Comment identifier les élèves en difficulté ?**
R : Le tableau de bord professeur affiche automatiquement :
- Élèves avec moyenne < 50%
- Élèves n'ayant pas terminé les cours
- Temps passé anormalement bas

**Q : Peut-on créer des parcours différenciés ?**
R : Pas dans le MVP. Prévu en phase 4 avec parcours adaptatifs.

**Q : Comment motiver les élèves à utiliser la plateforme ?**
R : Phase 2 introduit la gamification :
- Points et badges
- Classement de classe
- Streaks de connexion
- Récompenses virtuelles

**Q : Les parents peuvent-ils suivre la progression ?**
R : Pas dans le MVP. Prévu en phase 5 (espace parents).

---

### Questions Coûts

**Q : Y a-t-il des coûts cachés ?**
R : Non. Seuls coûts possibles :
- Nom de domaine : ~10€/an (optionnel)
- Hébergement si dépassement gratuit : ~30€/mois
- Stockage vidéos volumineux : variable

**Q : Peut-on monétiser la plateforme ?**
R : Oui, plusieurs modèles possibles :
- Freemium (gratuit + version payante)
- Abonnement par établissement
- Licence annuelle

**Q : Le code est-il libre d'utilisation ?**
R : Dépend de la licence que vous choisissez :
- MIT : totalement libre
- GPL : libre mais partage obligatoire
- Propriétaire : usage restreint

---

### Questions Performance

**Q : Combien d'élèves simultanés la plateforme peut gérer ?**
R :
- Railway gratuit : ~50-100 élèves simultanés
- Railway Pro : ~500-1000 élèves simultanés
- VPS optimisé : 1000+ élèves

**Q : Que faire si le site est lent ?**
R :
1. Activer le cache Redis
2. Optimiser les requêtes SQL
3. Compresser les images
4. Utiliser un CDN pour les fichiers statiques
5. Scaler horizontalement (plus de serveurs)

**Q : Peut-on améliorer la rapidité de chargement ?**
R : Oui :
- Lazy loading des images
- Code splitting (React)
- Compression Gzip
- Mise en cache navigateur

---

## 🔧 Commandes Utiles

### Backend (Node.js)

```powershell
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Compiler TypeScript
npm run build

# Démarrer en production
npm start

# Migrer la base de données
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface visuelle BDD)
npx prisma studio
```

### Frontend (React)

```powershell
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Compiler pour production
npm run build

# Prévisualiser la version de production
npm run preview
```

### Git

```powershell
# Initialiser un dépôt
git init

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Initial commit"

# Lier au dépôt distant
git remote add origin <url>

# Pousser vers GitHub
git push -u origin main
```

### PostgreSQL

```powershell
# Se connecter à la base
psql -U postgres

# Lister les bases de données
\l

# Se connecter à une base
\c elearning_db

# Lister les tables
\dt

# Quitter
\q
```

---

**Vous avez une question qui n'est pas dans cette FAQ ?**

Consultez :
1. La documentation officielle des technologies utilisées
2. Stack Overflow
3. Les communautés Discord/Reddit
4. Engager un développeur pour vous accompagner

---

**Bonne chance dans votre projet e-learning ! 🚀🎓**

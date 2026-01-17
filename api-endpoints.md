# API REST - Documentation des Endpoints

## BASE URL : `/api/v1`

---

## 1. AUTHENTIFICATION

### POST `/auth/register`
**Description** : Inscription d'un nouvel utilisateur (élève/professeur)
**Body** :
```json
{
  "email": "eleve@example.com",
  "password": "motdepasse123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "student",
  "classe": "BTS STMG 1ère année",
  "gdprConsent": true
}
```
**Response** : `201 Created`

### POST `/auth/login`
**Description** : Connexion utilisateur
**Body** :
```json
{
  "email": "eleve@example.com",
  "password": "motdepasse123"
}
```
**Response** :
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "eleve@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "student",
    "classe": "BTS STMG 1ère année"
  }
}
```

### POST `/auth/logout`
**Description** : Déconnexion (log l'activité)
**Headers** : `Authorization: Bearer <token>`

### POST `/auth/refresh`
**Description** : Renouveler le token JWT

---

## 2. GESTION DES UTILISATEURS

### GET `/users/me`
**Description** : Récupérer les infos de l'utilisateur connecté
**Headers** : `Authorization: Bearer <token>`

### PUT `/users/me`
**Description** : Modifier son profil
**Headers** : `Authorization: Bearer <token>`
**Body** :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

### GET `/users` *(TEACHER/ADMIN)*
**Description** : Liste des utilisateurs (filtrable par classe, rôle)
**Query params** : `?role=student&classe=BTS STMG 1ère année`

### DELETE `/users/:id/gdpr` *(ADMIN)*
**Description** : Suppression complète des données (droit à l'oubli RGPD)

### POST `/users/:id/export` *(USER/ADMIN)*
**Description** : Demander l'export de ses données personnelles

---

## 3. GESTION DES COURS

### GET `/courses`
**Description** : Liste des cours (filtrée selon le rôle)
**Query params** : `?classe=BTS STMG 1ère année&published=true`

### GET `/courses/:id`
**Description** : Détails d'un cours avec ressources

### POST `/courses` *(TEACHER)*
**Description** : Créer un nouveau cours
**Body** :
```json
{
  "title": "Introduction à l'économie",
  "description": "Chapitre 1 - Les bases",
  "classe": "BTS STMG 1ère année",
  "isPublished": false
}
```

### PUT `/courses/:id` *(TEACHER)*
**Description** : Modifier un cours

### DELETE `/courses/:id` *(TEACHER)*
**Description** : Supprimer un cours

---

## 4. RESSOURCES DE COURS

### POST `/courses/:courseId/resources` *(TEACHER)*
**Description** : Ajouter une ressource (PDF, vidéo, lien)
**Body (multipart/form-data)** :
```json
{
  "type": "pdf",
  "title": "Cours complet économie",
  "file": <fichier>,
  "description": "Support de cours"
}
```

### GET `/courses/:courseId/resources`
**Description** : Liste des ressources d'un cours

### DELETE `/resources/:id` *(TEACHER)*
**Description** : Supprimer une ressource

### POST `/resources/:id/view` *(STUDENT)*
**Description** : Enregistrer la consultation d'une ressource

---

## 5. QUIZ

### GET `/courses/:courseId/quizzes`
**Description** : Liste des quiz d'un cours

### GET `/quizzes/:id`
**Description** : Détails d'un quiz avec questions

### POST `/quizzes` *(TEACHER)*
**Description** : Créer un quiz
**Body** :
```json
{
  "courseId": 1,
  "title": "Quiz Chapitre 1",
  "description": "Évaluation des connaissances",
  "durationMinutes": 30,
  "maxAttempts": 2,
  "questions": [
    {
      "questionText": "Qu'est-ce que le PIB ?",
      "questionType": "mcq",
      "points": 2,
      "options": [
        {"optionText": "Produit Intérieur Brut", "isCorrect": true},
        {"optionText": "Produit International Brut", "isCorrect": false},
        {"optionText": "Produit Industriel Brut", "isCorrect": false}
      ]
    }
  ]
}
```

### POST `/quizzes/:id/start` *(STUDENT)*
**Description** : Démarrer une tentative de quiz
**Response** :
```json
{
  "attemptId": 123,
  "startedAt": "2026-01-17T10:00:00Z",
  "questions": [...]
}
```

### POST `/quizzes/:id/submit` *(STUDENT)*
**Description** : Soumettre les réponses
**Body** :
```json
{
  "attemptId": 123,
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 3
    },
    {
      "questionId": 2,
      "answerText": "Ma réponse courte"
    }
  ]
}
```
**Response** :
```json
{
  "score": 15,
  "maxScore": 20,
  "percentage": 75,
  "passed": true,
  "details": [...]
}
```

---

## 6. PROGRESSION & STATISTIQUES

### GET `/students/me/progress`
**Description** : Progression personnelle de l'élève
**Response** :
```json
{
  "coursesCompleted": 5,
  "totalCourses": 10,
  "averageScore": 82.5,
  "quizzesTaken": 12,
  "totalTimeSpent": 320
}
```

### GET `/teachers/dashboard` *(TEACHER)*
**Description** : Tableau de bord professeur
**Response** :
```json
{
  "totalStudents": 45,
  "activeStudents": 38,
  "coursesPublished": 8,
  "averageClassScore": 76.8,
  "recentActivity": [...],
  "topPerformers": [...],
  "strugglingStudents": [...]
}
```

### GET `/teachers/courses/:id/stats` *(TEACHER)*
**Description** : Statistiques détaillées d'un cours

### GET `/teachers/quizzes/:id/results` *(TEACHER)*
**Description** : Résultats d'un quiz (tous les élèves)

### GET `/teachers/students/:id/progress` *(TEACHER)*
**Description** : Suivi individuel d'un élève

---

## 7. COMMENTAIRES & MESSAGERIE

### GET `/courses/:courseId/comments`
**Description** : Commentaires publics d'un cours

### POST `/courses/:courseId/comments`
**Description** : Poster un commentaire
**Body** :
```json
{
  "commentText": "Question sur le chapitre 2",
  "isPrivate": false,
  "parentCommentId": null
}
```

### GET `/messages/private` *(STUDENT/TEACHER)*
**Description** : Messages privés

---

## 8. EXPORTS & RAPPORTS

### GET `/teachers/export/results` *(TEACHER)*
**Description** : Exporter les résultats en CSV/Excel
**Query params** : `?courseId=1&format=csv`

### GET `/users/me/export-data` *(USER)*
**Description** : Exporter ses données personnelles (RGPD)

---

## 9. LOGS & ACTIVITÉ

### GET `/activity-logs` *(ADMIN)*
**Description** : Logs d'activité système

### GET `/users/me/activity`
**Description** : Historique personnel de connexions

---

## CODES DE RÉPONSE HTTP

- `200 OK` : Succès
- `201 Created` : Ressource créée
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Non autorisé (rôle)
- `404 Not Found` : Ressource introuvable
- `500 Internal Server Error` : Erreur serveur

## SÉCURITÉ

- Toutes les routes nécessitant une authentification requièrent le header :
  `Authorization: Bearer <jwt_token>`
- Rate limiting : 100 requêtes/15 min par IP
- CORS configuré pour le domaine front-end uniquement

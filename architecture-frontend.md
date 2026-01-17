# STRUCTURE FRONT-END - REACT + VITE + TAILWIND

## Architecture des dossiers

```
frontend/
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── assets/                  # Images, icônes
│   ├── components/              # Composants réutilisables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── Alert.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── courses/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseList.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── ResourceViewer.tsx
│   │   │   └── CommentSection.tsx
│   │   ├── quiz/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   ├── QuizResults.tsx
│   │   │   └── QuizTimer.tsx
│   │   ├── dashboard/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── ActivityFeed.tsx
│   │   └── forms/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── CourseForm.tsx
│   │       └── QuizForm.tsx
│   ├── pages/                   # Pages principales
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── student/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CoursesPage.tsx
│   │   │   ├── CourseDetailPage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── teacher/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ManageCoursesPage.tsx
│   │   │   ├── CreateCoursePage.tsx
│   │   │   ├── CreateQuizPage.tsx
│   │   │   ├── StudentsPage.tsx
│   │   │   ├── StatisticsPage.tsx
│   │   │   └── ExportPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/                # Appels API
│   │   ├── api.ts               # Configuration Axios
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── quizService.ts
│   │   ├── userService.ts
│   │   └── statsService.ts
│   ├── hooks/                   # Custom hooks React
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useQuiz.ts
│   │   └── useLocalStorage.ts
│   ├── context/                 # Context API React
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── utils/                   # Fonctions utilitaires
│   │   ├── formatDate.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/                   # Types TypeScript
│   │   ├── user.ts
│   │   ├── course.ts
│   │   ├── quiz.ts
│   │   └── api.ts
│   ├── routes/                  # Configuration des routes
│   │   ├── AppRoutes.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── RoleBasedRoute.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Composants principaux

### 1. Layout global (Header + Sidebar + Content)
```tsx
// src/components/layout/Layout.tsx
- Navigation adaptée au rôle (élève/professeur)
- Menu responsive (burger sur mobile)
- Notifications en temps réel
```

### 2. Dashboard Élève
```tsx
// Affichage :
- Progression générale (cercle de progression)
- Cours récents
- Quiz à venir
- Statistiques personnelles
- Activité récente
```

### 3. Dashboard Professeur
```tsx
// Affichage :
- Nombre d'élèves actifs
- Moyenne de classe
- Graphiques de progression
- Liste des élèves en difficulté
- Activité récente des élèves
```

### 4. Lecteur de cours
```tsx
// Fonctionnalités :
- Affichage PDF inline
- Lecture vidéo (YouTube, Vimeo)
- Navigation entre ressources
- Commentaires en bas de page
- Suivi du temps passé
```

### 5. Interface de Quiz
```tsx
// Fonctionnalités :
- Chronomètre décompte
- Questions une par une ou toutes
- Sauvegarde automatique des réponses
- Révision avant soumission
- Affichage des résultats avec correction
```

---

## Routing (React Router)

```tsx
// Routes publiques
/login
/register

// Routes élève (protégées)
/student/dashboard
/student/courses
/student/courses/:id
/student/quiz/:id
/student/progress
/student/profile

// Routes professeur (protégées + role)
/teacher/dashboard
/teacher/courses
/teacher/courses/create
/teacher/courses/:id/edit
/teacher/quizzes/create
/teacher/students
/teacher/statistics
/teacher/export

// Routes admin
/admin/users
/admin/logs
```

---

## Gestion de l'état

### 1. Context API pour l'authentification
```tsx
// AuthContext fournit :
- Utilisateur actuel
- Token JWT
- Fonctions login/logout
- Vérification du rôle
```

### 2. React Query pour les données serveur
```tsx
// Gestion du cache, loading, erreurs
- Courses
- Quizzes
- User data
- Statistics
```

---

## Responsive Design (Tailwind)

### Breakpoints :
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

### Composants adaptés :
- Sidebar → Menu burger sur mobile
- Tables → Cards sur mobile
- Grids → Colonnes réduites

---

## Design System (Tailwind Classes)

### Couleurs principales :
```css
Primary : blue-600 (boutons, liens)
Success : green-500 (validation, réussite)
Warning : yellow-500 (attention)
Danger : red-500 (erreur, suppression)
Neutral : gray-100 à gray-900
```

### Composants stylisés :
- Cards avec ombre : `shadow-md rounded-lg`
- Boutons : `px-4 py-2 rounded-md hover:opacity-90`
- Inputs : `border border-gray-300 rounded-md focus:ring-2`

---

## Accessibilité

- Labels pour tous les inputs
- Contraste des couleurs WCAG AA
- Navigation au clavier
- Aria-labels sur les boutons icônes
- Messages d'erreur explicites

---

## Performance

- Lazy loading des pages (React.lazy)
- Images optimisées (compression)
- Pagination des listes longues
- Debounce sur les recherches
- Cache des requêtes API

---

## Sécurité front-end

- Validation des formulaires côté client
- Protection XSS (sanitize HTML)
- Token JWT stocké en httpOnly cookie ou localStorage sécurisé
- Redirection automatique si token expiré
- HTTPS obligatoire en production

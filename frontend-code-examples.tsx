// ========================================
// EXEMPLE 5 : Context d'authentification React
// ========================================
// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  classe?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      setToken(response.token);
      setUser(response.user);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur de connexion');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === 'STUDENT',
    isTeacher: user?.role === 'TEACHER',
    isAdmin: user?.role === 'ADMIN',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};


// ========================================
// EXEMPLE 6 : Service API Frontend
// ========================================
// frontend/src/services/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// ========================================
// EXEMPLE 7 : Service Courses Frontend
// ========================================
// frontend/src/services/courseService.ts

import { api } from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  classe: string;
  isPublished: boolean;
  teacher: {
    firstName: string;
    lastName: string;
  };
  resources: Resource[];
}

export interface Resource {
  id: number;
  type: 'pdf' | 'video' | 'link' | 'document';
  title: string;
  fileUrl?: string;
  externalUrl?: string;
}

export const courseService = {
  // Récupérer tous les cours
  async getCourses(filters?: { classe?: string; published?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.classe) params.append('classe', filters.classe);
    if (filters?.published !== undefined) params.append('published', String(filters.published));
    
    const response = await api.get<Course[]>(`/courses?${params}`);
    return response.data;
  },

  // Récupérer un cours par ID
  async getCourseById(id: number) {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  // Créer un cours (professeur)
  async createCourse(data: {
    title: string;
    description: string;
    classe: string;
  }) {
    const response = await api.post<Course>('/courses', data);
    return response.data;
  },

  // Ajouter une ressource à un cours
  async addResource(courseId: number, formData: FormData) {
    const response = await api.post(
      `/courses/${courseId}/resources`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  // Marquer une ressource comme consultée
  async markResourceViewed(resourceId: number) {
    await api.post(`/resources/${resourceId}/view`);
  }
};


// ========================================
// EXEMPLE 8 : Composant Dashboard Élève
// ========================================
// frontend/src/pages/student/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { quizService } from '../../services/quizService';
import { statsService } from '../../services/statsService';

interface StudentStats {
  coursesCompleted: number;
  totalCourses: number;
  averageScore: number;
  quizzesTaken: number;
  totalTimeSpent: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, coursesData, quizzesData] = await Promise.all([
        statsService.getStudentProgress(),
        courseService.getCourses({ classe: user?.classe, published: true }),
        quizService.getUpcomingQuizzes()
      ]);

      setStats(statsData);
      setRecentCourses(coursesData.slice(0, 5));
      setUpcomingQuizzes(quizzesData);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const progressPercentage = stats
    ? (stats.coursesCompleted / stats.totalCourses) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour {user?.firstName} !
        </h1>
        <p className="text-gray-600 mt-2">
          Classe : {user?.classe}
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Cours complétés"
          value={`${stats?.coursesCompleted} / ${stats?.totalCourses}`}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Moyenne générale"
          value={`${stats?.averageScore.toFixed(1)}%`}
          icon="📊"
          color="green"
        />
        <StatCard
          title="Quiz réalisés"
          value={stats?.quizzesTaken || 0}
          icon="✅"
          color="purple"
        />
        <StatCard
          title="Temps d'étude"
          value={`${stats?.totalTimeSpent || 0}h`}
          icon="⏱️"
          color="orange"
        />
      </div>

      {/* Progression globale */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Progression globale</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage.toFixed(0)}% de vos cours terminés
        </p>
      </div>

      {/* Deux colonnes : Cours récents + Quiz à venir */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cours récents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cours récents</h2>
          <div className="space-y-4">
            {recentCourses.length === 0 ? (
              <p className="text-gray-500">Aucun cours disponible</p>
            ) : (
              recentCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>
        </div>

        {/* Quiz à venir */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quiz à venir</h2>
          <div className="space-y-4">
            {upcomingQuizzes.length === 0 ? (
              <p className="text-gray-500">Aucun quiz prévu</p>
            ) : (
              upcomingQuizzes.map((quiz: any) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant StatCard
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-4xl ${colorClasses[color]} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Composant CourseCard
const CourseCard: React.FC<{ course: any }> = ({ course }) => {
  return (
    <a
      href={`/student/courses/${course.id}`}
      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
    >
      <h3 className="font-semibold text-gray-900">{course.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <span>Prof. {course.teacher.lastName}</span>
      </div>
    </a>
  );
};

// Composant QuizCard
const QuizCard: React.FC<{ quiz: any }> = ({ quiz }) => {
  return (
    <a
      href={`/student/quiz/${quiz.id}`}
      className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
    >
      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        Durée : {quiz.durationMinutes} min
      </p>
      {quiz.availableUntil && (
        <p className="text-xs text-red-600 mt-1">
          Disponible jusqu'au {new Date(quiz.availableUntil).toLocaleDateString()}
        </p>
      )}
    </a>
  );
};

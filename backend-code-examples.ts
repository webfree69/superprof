// ========================================
// EXEMPLE 2 : Middleware d'authentification JWT
// ========================================
// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

// Extension du type Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware pour vérifier le token JWT
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token manquant ou invalide' 
      });
    }

    const token = authHeader.substring(7); // Retirer "Bearer "

    // Vérifier et décoder le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Utilisateur introuvable ou inactif' 
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expiré' });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification du token' 
    });
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé : rôle insuffisant' 
      });
    }

    next();
  };
};


// ========================================
// EXEMPLE 3 : Service d'authentification
// ========================================
// backend/src/services/authService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'TEACHER';
    classe?: string;
    gdprConsent: boolean;
  }) {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Valider le consentement RGPD
    if (!data.gdprConsent) {
      throw new Error('Le consentement RGPD est obligatoire');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        classe: data.classe,
        gdprConsent: true,
        gdprConsentDate: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        classe: true
      }
    });

    // Logger l'inscription
    await this.logActivity(user.id, 'REGISTER', req);

    return user;
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string, req: any) {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier que le compte est actif
    if (!user.isActive) {
      throw new Error('Ce compte est désactivé');
    }

    // Mettre à jour la date de dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Logger la connexion
    await this.logActivity(user.id, 'LOGIN', req);

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        classe: user.classe
      }
    };
  }

  /**
   * Logger une activité utilisateur (RGPD)
   */
  private async logActivity(
    userId: number, 
    action: string, 
    req: any
  ) {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        details: {
          timestamp: new Date().toISOString()
        }
      }
    });
  }

  /**
   * Renouveler un token JWT
   */
  async refreshToken(oldToken: string) {
    try {
      const decoded = jwt.verify(
        oldToken,
        process.env.JWT_SECRET as string
      ) as any;

      // Générer un nouveau token
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        },
        process.env.JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return newToken;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }
}


// ========================================
// EXEMPLE 4 : Contrôleur pour les quiz
// ========================================
// backend/src/controllers/quizController.ts

import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class QuizController {
  /**
   * Créer un nouveau quiz (professeur uniquement)
   */
  async createQuiz(req: Request, res: Response) {
    try {
      const { 
        courseId, 
        title, 
        description, 
        durationMinutes, 
        maxAttempts,
        questions 
      } = req.body;

      // Vérifier que le professeur a bien accès au cours
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId: req.user!.id
        }
      });

      if (!course) {
        return res.status(403).json({ 
          error: 'Accès refusé à ce cours' 
        });
      }

      // Créer le quiz avec ses questions et options
      const quiz = await prisma.quiz.create({
        data: {
          courseId,
          title,
          description,
          durationMinutes,
          maxAttempts,
          questions: {
            create: questions.map((q: any, index: number) => ({
              questionText: q.questionText,
              questionType: q.questionType,
              points: q.points || 1,
              orderIndex: index,
              explanation: q.explanation,
              options: {
                create: q.options?.map((opt: any, optIndex: number) => ({
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect,
                  orderIndex: optIndex
                }))
              }
            }))
          }
        },
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      });

      res.status(201).json(quiz);
    } catch (error) {
      console.error('Erreur création quiz:', error);
      res.status(500).json({ error: 'Erreur lors de la création du quiz' });
    }
  }

  /**
   * Démarrer une tentative de quiz (élève)
   */
  async startQuiz(req: Request, res: Response) {
    try {
      const quizId = parseInt(req.params.id);
      const studentId = req.user!.id;

      // Vérifier que le quiz existe et est publié
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            include: {
              options: true
            },
            orderBy: { orderIndex: 'asc' }
          }
        }
      });

      if (!quiz || !quiz.isPublished) {
        return res.status(404).json({ error: 'Quiz introuvable' });
      }

      // Vérifier le nombre de tentatives
      const previousAttempts = await prisma.quizAttempt.count({
        where: {
          quizId,
          studentId,
          isCompleted: true
        }
      });

      if (previousAttempts >= quiz.maxAttempts) {
        return res.status(403).json({ 
          error: 'Nombre maximum de tentatives atteint' 
        });
      }

      // Créer la tentative
      const attempt = await prisma.quizAttempt.create({
        data: {
          quizId,
          studentId,
          attemptNumber: previousAttempts + 1,
          maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0)
        }
      });

      // Retourner le quiz sans révéler les bonnes réponses
      const questionsForStudent = quiz.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        points: q.points,
        options: q.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText
          // Ne pas envoyer isCorrect
        }))
      }));

      res.json({
        attemptId: attempt.id,
        quiz: {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          durationMinutes: quiz.durationMinutes,
          questions: questionsForStudent
        },
        startedAt: attempt.startedAt
      });
    } catch (error) {
      console.error('Erreur démarrage quiz:', error);
      res.status(500).json({ error: 'Erreur lors du démarrage du quiz' });
    }
  }

  /**
   * Soumettre les réponses d'un quiz
   */
  async submitQuiz(req: Request, res: Response) {
    try {
      const { attemptId, answers } = req.body;
      const studentId = req.user!.id;

      // Vérifier que la tentative appartient bien à l'élève
      const attempt = await prisma.quizAttempt.findFirst({
        where: {
          id: attemptId,
          studentId
        },
        include: {
          quiz: {
            include: {
              questions: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

      if (!attempt) {
        return res.status(404).json({ error: 'Tentative introuvable' });
      }

      if (attempt.isCompleted) {
        return res.status(400).json({ error: 'Quiz déjà soumis' });
      }

      // Calculer le score
      let totalScore = 0;
      const answerResults = [];

      for (const answer of answers) {
        const question = attempt.quiz.questions.find(
          q => q.id === answer.questionId
        );

        if (!question) continue;

        let isCorrect = false;
        let pointsEarned = 0;

        // Vérifier la réponse selon le type
        if (question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE') {
          const correctOption = question.options.find(opt => opt.isCorrect);
          isCorrect = answer.selectedOptionId === correctOption?.id;
          pointsEarned = isCorrect ? question.points : 0;
        } else if (question.questionType === 'MULTIPLE') {
          // Logique pour questions à choix multiples
          // À implémenter selon vos besoins
        } else if (question.questionType === 'SHORT_ANSWER') {
          // Les réponses courtes nécessitent une correction manuelle
          // On peut implémenter une comparaison de chaînes simple
          isCorrect = false; // À corriger manuellement par le prof
        }

        totalScore += pointsEarned;

        // Sauvegarder la réponse
        await prisma.studentAnswer.create({
          data: {
            attemptId,
            questionId: question.id,
            selectedOptionId: answer.selectedOptionId,
            answerText: answer.answerText,
            isCorrect,
            pointsEarned
          }
        });

        answerResults.push({
          questionId: question.id,
          isCorrect,
          pointsEarned,
          correctAnswer: question.options.find(opt => opt.isCorrect)?.optionText
        });
      }

      // Calculer le temps passé
      const timeSpent = Math.floor(
        (Date.now() - attempt.startedAt.getTime()) / (1000 * 60)
      );

      // Mettre à jour la tentative
      const percentage = (totalScore / attempt.maxScore!) * 100;
      
      await prisma.quizAttempt.update({
        where: { id: attemptId },
        data: {
          submittedAt: new Date(),
          score: totalScore,
          percentage,
          timeSpentMinutes: timeSpent,
          isCompleted: true
        }
      });

      res.json({
        score: totalScore,
        maxScore: attempt.maxScore,
        percentage: percentage.toFixed(2),
        passed: percentage >= 50, // Critère de réussite
        details: answerResults
      });
    } catch (error) {
      console.error('Erreur soumission quiz:', error);
      res.status(500).json({ error: 'Erreur lors de la soumission' });
    }
  }
}

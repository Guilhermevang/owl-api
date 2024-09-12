// middlewares/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import admin from '@config/firebase.config';
import CustomException from '@entities/exceptions/custom-exception';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send('Não autorizado. Token não encontrado.');
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Erro ao verificar o token Firebase ID:', error);
    res.status(401).send(new CustomException("UNAUTHORIZED").toJson());
  }
}

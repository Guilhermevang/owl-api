import { Request, Response, NextFunction } from 'express';

export function authorize(requiredRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      res.status(401).send('Não autorizado. Usuário não autenticado.');
      return;
    }

    const userRole = user.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      res.status(403).send('Acesso negado. Permissões insuficientes.');
      return;
    }

    next();
  };
}
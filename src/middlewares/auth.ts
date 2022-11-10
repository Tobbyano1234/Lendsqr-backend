import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status';

const secret = (process.env.JWT_SECRET as string) || 'examples';

export async function auth(req: Request | any, res: Response, next: NextFunction) {
  try {
    const token = req.headers.token;
    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({
        Error: 'Kindly sign in as a User',
      });
      return;
    }

    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res.status(httpStatus.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.FORBIDDEN).json({ Error: 'User is not not logged in' });
  }
}

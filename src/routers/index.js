import express from 'express';
import { authRouter } from './auth.router.js';
import { usersRouter } from './users.router.js';
import { resumesRouter } from './resumes.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter); //인증 라우터
apiRouter.use('/users', usersRouter);   //유저 라우터
apiRouter.use('/resumes', requireAccessToken, resumesRouter);   //이력서 라우터

export { apiRouter };

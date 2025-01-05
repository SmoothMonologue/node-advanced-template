import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

const usersRouter = express.Router();

//내 프로필 조회 api
usersRouter.get('/me', requireAccessToken, (req, res, next) => {
  try {
    const data = req.user;

    //'내 정보 조회에 성공했습니다.' 받아오기
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export { usersRouter };

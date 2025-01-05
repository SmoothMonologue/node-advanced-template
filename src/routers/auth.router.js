import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';

const authRouter = express.Router();

//회원 가입 시도 시 회원 가입 양식 생성
authRouter.post('/sign-up', signUpValidator, async (req, res, next) => {
  try {
    //메일, 비번, 이름 요구
    const { email, password, name } = req.body;

    //유저 테이블에서 해당 이메일을 가진 유저 탐색
    const existedUser = await prisma.user.findUnique({ where: { email } });

    // 이메일이 중복된 경우
    if (existedUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
      });
    }

    //비번 암호화
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    //유저 생성
    const data = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    //비번 초기화
    data.password = undefined;

    //회원 가입 완료
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

//로그인 시도 시 로그인 양식 생성
authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    //메일, 비번 요구
    const { email, password } = req.body;

        //유저 테이블에서 해당 이메일을 가진 유저 탐색
    const user = await prisma.user.findUnique({ where: { email } });

    //비번 체크
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    //틀리면 로그인 실패
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.UNAUTHORIZED,
      });
    }

    //제이슨 웹 토큰 받기 위해 유저 아이디 확인
    const payload = { id: user.id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

export { authRouter };

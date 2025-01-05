//조이, 메세지 수입
import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

//메일과 비번 합치기
const schema = Joi.object({
  //'이메일을 입력해 주세요.', '이메일 형식이 올바르지 않습니다.' 받아오기
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
  }),
  //'비밀번호를 입력해 주세요.' 받아오기
  password: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
  }),
});

//로그인 양식 생성
export const signInValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

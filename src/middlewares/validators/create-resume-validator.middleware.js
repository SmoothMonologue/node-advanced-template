//조이 수입
import Joi from 'joi';
//메세지 수입
import { MESSAGES } from '../../constants/message.constant.js';
//이력서 최소 길이 수입
import { MIN_RESUME_LENGTH } from '../../constants/resume.constant.js';

//제목과 내용 합치기
const schema = Joi.object({
  //'제목을 입력해주세요.' 받아오기
  title: Joi.string().required().messages({
    'any.required': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED,
  }),
  //'자기소개를 입력해주세요.', '자기소개는 150자 이상 작성해야 합니다.' 받아오기
  content: Joi.string().min(MIN_RESUME_LENGTH).required().messages({
    'any.required': MESSAGES.RESUMES.COMMON.CONTENT.REQUIRED,
    'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
  }),
});

//이력서 초안 생성
export const createResumeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

//조이, 메세지, 이력서 최소 길이 수입
import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { MIN_RESUME_LENGTH } from '../../constants/resume.constant.js';

// 제목, 내용 합치기
const schema = Joi.object({
  title: Joi.string(),
  //'자기소개는 150자 이상 작성해야합니다.' 받아오기
  content: Joi.string().min(MIN_RESUME_LENGTH).messages({
    'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
  }),
})
  .min(1)
  //'수정 할 정보를 입력해주세요.' 받아오기
  .messages({
    'object.min': MESSAGES.RESUMES.UPDATE.NO_BODY_DATA,
  });

  //이력서 수정 양식 생성
export const updateResumeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

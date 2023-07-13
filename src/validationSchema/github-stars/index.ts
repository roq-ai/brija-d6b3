import * as yup from 'yup';

export const githubStarValidationSchema = yup.object().shape({
  date: yup.date().required(),
  star_count: yup.number().integer().required(),
  repository_id: yup.string().nullable(),
});

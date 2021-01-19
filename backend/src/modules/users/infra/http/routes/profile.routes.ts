import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import ProfileController from '../controllers/ProfileController'
import ensureAuthenticaded from '../middlewares/ensureAuthenticated'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticaded)
profileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            password: Joi.when('old_password', {
                is: Joi.exist(),
                then: Joi.required(),
            }),
            password_confirmation: Joi.when('password', {
                is: Joi.exist(),
                then: Joi.valid(Joi.ref('password')).required(),
            }),
        },
    }),
    profileController.update,
)
profileRouter.get('/', profileController.show)

export default profileRouter

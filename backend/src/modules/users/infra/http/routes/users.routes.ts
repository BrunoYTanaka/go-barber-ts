import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import { celebrate, Joi, Segments } from 'celebrate'
import UsersController from '../controllers/UsersController'
import UserAvatarController from '../controllers/UserAvatarController'
import ensureAuthenticaded from '../middlewares/ensureAuthenticated'

const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

const usersRouter = Router()
const upload = multer(uploadConfig.multer)

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
)

usersRouter.patch(
    '/avatar',
    ensureAuthenticaded,
    upload.single('avatar'),
    userAvatarController.update,
)

export default usersRouter

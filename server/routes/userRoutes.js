import express from 'express';
import { getPublishedImages, getUser, loginUser, registerUser, oauthLogin } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/oauth-login', oauthLogin); // <--- new endpoint
userRouter.get('/data', protect, getUser);
userRouter.get('/published-images', getPublishedImages);

export default userRouter;

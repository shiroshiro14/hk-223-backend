import express from 'express';
import * as UserControllers from '../controllers/userController.js'

const router = express.Router();

router.post('/login', UserControllers.userLogin)
router.post("/logout", UserControllers.userLogout)
router.post('/signup', UserControllers.userSignup)
export default router;
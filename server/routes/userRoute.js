import express from 'express';
import { authData } from '../middlrWare/auth.js';
import { checkAuth, signUp, updateProfile, userLogin } from '../controller/userController.js';

const  userRouter=express.Router();



userRouter.post('/register',signUp);
userRouter.post('/login',userLogin);
userRouter.put('/update-profile',authData,updateProfile);
userRouter.get('/check',authData,checkAuth);




export default userRouter;
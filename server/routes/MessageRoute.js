import express from 'express';
import { authData } from '../middlrWare/auth.js';
import { getUserForSidebar, markMessageAsSeen, selectedUser, sendMessage } from '../controller/messageController.js';
import { userSocketMap,io } from '../server.js';

const  messageRouter=express.Router();


messageRouter.get('/get-user',authData,getUserForSidebar)
messageRouter.get('/:id',authData,selectedUser)
messageRouter.put('/mark/:id',authData,markMessageAsSeen)
messageRouter.post('/send/:id',authData,sendMessage)





export default messageRouter;
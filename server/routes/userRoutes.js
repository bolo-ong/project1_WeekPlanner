const express = require('express');
const { signUp, signIn, signOut, signInSuccess } = require('../controllers/userController');
const userRouter = express.Router();


userRouter.post('/signin', signIn);
userRouter.post('/signup', signUp);
userRouter.get('/signout', signOut);
userRouter.get('/signin/success', signInSuccess)


module.exports = userRouter;
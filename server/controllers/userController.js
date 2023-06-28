require('dotenv').config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// const accessToken = async (req, res) => {
//     try {
//         const token = req.cookies.accessToken
//         const data = jwt.verify(token, ACCESS_TOKEN_SECRET)

//         const userData = await User.findOne({ userId: data.userId })
//         const { pw, ...others } = userData.toObject();

//         res.status(200).json(others);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        const data = jwt.verify(token, REFRESH_TOKEN_SECRET)

        const accessToken = jwt.sign({ userId: data.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '4h' });

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const signUp = async (req, res) => {
    const { userId, pw } = req.body
    try {
        const exitingUser = await User.findOne({ userId: userId })
        if (exitingUser) {
            return res.status(400).json({ message: '이미 사용중인 아이디 입니다.' })
        }

        const hashedPw = await bcrypt.hash(pw, 10);

        const user = new User({ userId: userId, pw: hashedPw })
        await user.save();

        const accessToken = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '4h' });
        const refreshToken = jwt.sign({ userId: user.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    const { userId, pw } = req.body
    try {
        const exitingUser = await User.findOne({ userId: userId })
        if (!exitingUser) {
            return res.status(404).json({ message: '입력하신 아이디를 다시 확인해 주세요.' })
        }

        const matchPw = await bcrypt.compare(pw, exitingUser.pw)

        if (!matchPw) {
            return res.status(400).json({ message: '입력하신 비밀번호를 다시 확인해 주세요.' })
        }

        const accessToken = jwt.sign({ userId: exitingUser.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '4h' });
        const refreshToken = jwt.sign({ userId: exitingUser.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const signInSuccess = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken
        const data = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)

        const userData = await User.findOne({ userId: data.userId })
        const { pw, ...others } = userData.toObject();

        res.status(200).json(others);
    } catch (error) {
        refreshToken(req, res);
    }
}

const signOut = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.sendStatus(200);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { signUp, signIn, signOut, signInSuccess }

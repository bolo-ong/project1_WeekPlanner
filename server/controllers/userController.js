require('dotenv').config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    const { inputId, inputPw } = req.body
    try {
        const existingUser = await User.findOne({ userId: inputId })
        if (existingUser) {
            return res.status(400).json({ message: '이미 사용중인 아이디 입니다.' })
        }

        const hashedPw = await bcrypt.hash(inputPw, 10);

        const accessToken = jwt.sign({ userId: inputId }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ userId: inputId }, REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

        //실서비스의 경우 secure: true로 변경
        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })

        await new User({
            userId: inputId,
            pw: hashedPw,
            refreshToken: [refreshToken]
        }).save();

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    const { inputId, inputPw } = req.body
    try {
        const signInRequestUser = await User.findOne({ userId: inputId })
        if (!signInRequestUser) {
            return res.status(404).json({ message: '입력하신 아이디를 다시 확인해 주세요.' })
        }

        const matchPw = await bcrypt.compare(inputPw, signInRequestUser.pw)

        if (!matchPw) {
            return res.status(400).json({ message: '입력하신 비밀번호를 다시 확인해 주세요.' })
        }

        const accessToken = jwt.sign({ userId: signInRequestUser.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ userId: signInRequestUser.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })

        await User.updateOne(
            { userId: signInRequestUser.userId },
            { $push: { refreshToken: refreshToken } }
        );

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const signInSuccess = async (req, res) => {
    try {
        const existingAccessToken = req.cookies.accessToken
        const accessTokenData = jwt.verify(existingAccessToken, ACCESS_TOKEN_SECRET);

        res.sendStatus(200);
    } catch (error) {

        //accessToken만료 시 refreshToken을 이용한 토큰 재발급
        try {
            const existingRefreshToken = req.cookies.refreshToken;
            const refreshTokenData = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);

            const requestUser = await User.findOne({ refreshToken: existingRefreshToken })
            if (!requestUser) { //해당 유저의 DB에 존재하지 않는 refreshToken으로 요청이 왔기 때문에 해킹위험을 감지
                await requestUser.updateOne({ hacked: true });
                throw new Error('Hacking attempt detected');
            }

            const accessToken = jwt.sign({ userId: refreshTokenData.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const refreshToken = jwt.sign({ userId: refreshTokenData.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

            res.cookie("accessToken", accessToken, {
                secure: false,
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                secure: false,
                httpOnly: true,
            });

            await requestUser.updateOne({ $pull: { refreshToken: existingRefreshToken } });
            await requestUser.updateOne({ $push: { refreshToken: refreshToken } });

            res.sendStatus(200);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

const signOut = async (req, res) => {
    try {
        const existingRefreshToken = req.cookies.refreshToken
        const refreshTokenData = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET)
        const signOutRequestUser = await User.findOne({ userId: refreshTokenData.userId })

        await signOutRequestUser.updateOne({ $pull: { refreshToken: existingRefreshToken } });

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');


        res.sendStatus(200);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { signUp, signIn, signOut, signInSuccess }

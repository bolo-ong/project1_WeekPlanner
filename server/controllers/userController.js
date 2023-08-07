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

        const accessToken = jwt.sign({ userId: inputId }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId: inputId }, REFRESH_TOKEN_SECRET, { expiresIn: '30s' });

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

        const accessToken = jwt.sign({ userId: signInRequestUser.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
        const refreshToken = jwt.sign({ userId: signInRequestUser.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '30s' });

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

        if (!existingAccessToken) {
            const existingRefreshToken = req.cookies.refreshToken;

            if (existingRefreshToken) {
                const refreshTokenData = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);

                const accessToken = jwt.sign({ userId: refreshTokenData.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
                const refreshToken = jwt.sign({ userId: refreshTokenData.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '30s' });

                res.cookie("accessToken", accessToken, {
                    secure: false,
                    httpOnly: true,
                });
                res.cookie("refreshToken", refreshToken, {
                    secure: false,
                    httpOnly: true,
                });

                await User.updateOne(
                    { userId: refreshTokenData.userId },
                    {
                        $pull: { refreshToken: existingRefreshToken },
                        $push: { refreshToken: refreshToken }
                    }
                );
            } else {
                return res.status(401).json({ message: error.message });
            }
        }
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

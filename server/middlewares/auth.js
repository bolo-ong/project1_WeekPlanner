const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (token) {
            const data = jwt.verify(token, ACCESS_TOKEN_SECRET)
            const userData = await User.findOne({ userId: data.userId })
            const { pw, refreshToken, ...others } = userData.toObject();

            req.userData = others;
        }
        //  else {
        //     return res.status(401).json({ message: '로그인 후 이용해 주세요.' })
        // }
        next();

    } catch (error) {
        res.status(500).json({ message: '인증 오류 입니다.' })
    }
}


module.exports = auth;
import jwt from 'jsonwebtoken';

export function jwt(user) {
    let t = jwt.sign({
        userId: user._id,
        role: user.role,
        userName: user.username
    },
        process.env.SECRET_KEY, // תיקון שם המשתנה
        {
            expiresIn: 60 * 3
        }
    )
    return t;
}

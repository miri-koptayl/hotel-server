import jwt from 'jsonwebtoken';

export function jwtt(user) {
    let t = jwt.sign({
        userId: user._id,
        role: user.role,
        userName: user.username
        
    },
    
        process.env.SECRET_KEY, // תיקון שם המשתנה
        {
            expiresIn: 60 * 60
        }
    )
    return t;
}

import jwt from 'jsonwebtoken';

export function jwtt(user) {
    console.log(process.env.SECRET_KEY); // לבדוק אם המפתח נמצא

    let t = jwt.sign({
        userId: user._id,
        role: user.role,
        userName: user.username
        
    },
    
        process.env.SECRET_KEY,
        {
            expiresIn: 60 * 60
        }
    )
    return t;
}

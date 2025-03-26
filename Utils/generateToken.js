import jwt from 'jsonwebtoken';
export  function gwt(user) {
    let t = jwt.sign({
        userId: user._id,
        role: user.role,
        userName: user.username
    },
        process.env.SECRET_KAY,
        {
            expiresIn: 60 * 3
        }
    )
    return t;
}
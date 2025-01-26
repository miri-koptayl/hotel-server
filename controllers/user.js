import { userModel } from "../models/user.js";

export const getAllUsers = async (req, res) => {
    try {
        let data = await userModel.find().select('-password');
        res.json(data)
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get all", message: err.message })
    }
}

export const addUserSignUp = async (req, res) => {
    if (!req.body.phone || !req.body.email || !req.body.username || !req.body.password)
        return res.status(404).json({ title: "missing data", message: "missing data" })

    try {

        let newUser = new userModel(req.body)
        let data = await newUser.save();


        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot add ", message: err.message })
    }
}

export const update = async (req, res) => {
    let { id } = req.params;

    if (req.body.password && req.body.password.length < 2)
        return res.status(404).json({ title: "wrong paswword", message: "wrong data" })
    try {

        let data = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ title: "error cannot update by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot update by id", message: err.message })
    }

}
export const updateUserPassword = async (req, res) => {
    if (!req.body.newPassword)
        return res.status(404).json({ title: "missing data", message: "missing new password" });

    try {
        let user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ title: "user not found", message: "user not found" });
        }

        user.password = req.body.newPassword;

        let updatedUser = await user.save();

        res.json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "error", message: err.message });
    }
}

export const getUserById = async (req, res) => {

    let { id } = req.params;
    try {

        let data = await userModel.findById(id).select('-password');;
        if (!data)
            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: err.message })
    }
}

export const getUserByUserNamePasswordLogin = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password)
            return res.status(404).json({ title: "missing username or pssword", message: "missing details" })
        let data = await userModel.findOne({ username: username, password: password });
        if (!data)
            return res.status(404).json({ title: "cannot login", message: "no user with such details" })
        res.json(data)
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: err.message })
    }
}



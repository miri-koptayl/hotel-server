import { roomModel } from "../models/room.js"

export const getAllRooms = async (req, res) => {

    try {

        let data = await roomModel.find();
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get all", message: "somethongs wrong" })
    }

}

export const getByID = async (req, res) => {

    let { id } = req.params;
    try {

        let data = await roomModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: "somethongs wrong" })
    }

}

export const deleteByID = async (req, res) => {


    let { id } = req.params;
    try {

        let data = await roomModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: "somethongs wrong" })
    }

}
export const updateByID = async (req, res) => {


    let { id } = req.params;

    if (req.body.num && req.body.num < 2 || req.body.numBads && req.body.numBads < 2)
        return res.status(404).json({ title: "wrong name or numBads", message: "wrong data" })
    try {

        let data = await roomModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ title: "error cannot update by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot update by id", message: "somethongs wrong" })
    }

}
//לבדוק האם נכון 
export const add = async (req, res) => {



    if (!req.body.num || !req.body.numBads)
        return res.status(404).json({ title: "missing num or numBads", message: "missing data" })
    if (req.body.num < 2 || req.body.numBads < 2)
        return res.status(404).json({ title: "wrong num or numBads", message: "wrong data" })
    try {

        let newRoom = new roomModel(req.body)
        let data = await newRoom.save();


        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot add by num", message: "somethongs wrong" })
    }

}
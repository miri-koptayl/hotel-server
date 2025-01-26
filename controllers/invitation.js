import { roomModel } from "../models/room.js";
import { invitationModel } from "../models/invitation.js"
import { userModel } from "../models/user.js";

export const getAllIinvitation = async (req, res) => {

    try {
        let data = await invitationModel.find();
        res.json(data)
    }
    catch (err) {

        res.status(400).json({ title: "error cannot get all", message: err.message })
    }

}


export const getinvitationsByUserId = async (req, res) => {
    let { userid } = req.params;
    try {
        let data = await invitationModel.find({ userId: userid });
        res.json(data)
    }
    catch (err) {

        res.status(400).json({ title: "error cannot get by id", message: err.message })
    }
}
export const completeInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params; // קבלת מזהה ההזמנה מתוך הכתובת

        // בדיקת פרמטרים נדרשים
        if (!invitationId) {
            return res.status(400).json({
                title: "Missing required details",
                message: "invitationId is required",
            });
        }

        // עדכון שדה isFinish ל-true
        const updatedInvitation = await invitationModel.findByIdAndUpdate(
            invitationId,
            { isFinish: true }, // ערכים לעדכון
            { new: true } // מחזיר את ההזמנה לאחר העדכון
        );

        if (!updatedInvitation) {
            return res.status(404).json({
                title: "Invitation not found",
                message: `No invitation found with ID ${invitationId}`,
            });
        }

        // החזרת התוצאה המעודכנת
        return res.json({
            title: "Invitation updated",
            updatedInvitation,
        });
    } catch (err) {
        res.status(500).json({
            title: "Error updating invitation",
            message: err.message,
        });
    }
};

export const addInvitation = async (req, res) => {
    try {
        let { userId, rooms } = req.body;

        // בדיקת פרמטרים נדרשים
        if (!userId || !rooms || !rooms.length) {
            return res.status(404).json({
                title: "Missing required details",
                message: "userId and rooms are required",
            });
        }

        // בדיקת קיום המשתמש
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                title: "Error adding invitation",
                message: "No user with such ID",
            });
        }

        // בדיקת סטטוס החדרים
        let availableRooms = [];
        for (let item of rooms) {
            const room = await roomModel.findById(item.id);

            if (!room) {
                return res.status(404).json({
                    title: "Room not found",
                    message: `Room with ID ${item.id} does not exist`,
                });
            }

            if (room.isOccupied) {
                return res.status(400).json({
                    title: "Room unavailable",
                    message: `Room with ID ${room.id} is already occupied`,
                });
            }

            availableRooms.push(room);
        }

        // עדכון סטטוס החדרים ל"תפוסים"
        for (let room of availableRooms) {
            room.isOccupied = true;
            await room.save();
        }

        // יצירת הזמנה חדשה
        const invitation = new invitationModel({
            userId,
            rooms: availableRooms.map((room) => room._id),
        });
        await invitation.save();

        return res.json(invitation);
    } catch (err) {
        res.status(400).json({
            title: "Error cannot add invitation",
            message: err.message,
        });
    }
};
export const delInvitation = async (req, res) => {
    try {
        const { invitationId } = req.body; // מקבלים את מזהה ההזמנה למחיקה

        // בדיקת פרמטרים נדרשים
        if (!invitationId) {
            return res.status(400).json({
                title: "Missing required details",
                message: "invitationId is required",
            });
        }

        // מציאת ההזמנה ומחיקתה
        const deletedInvitation = await invitationModel.findByIdAndDelete(invitationId);

        // בדיקה אם ההזמנה קיימת
        if (!deletedInvitation) {
            return res.status(404).json({
                title: "Invitation not found",
                message: `No invitation found with ID ${invitationId}`,
            });
        }

        // שחרור החדרים הקשורים להזמנה
        for (let room of deletedInvitation.orderRooms) {
            const roomToUpdate = await roomModel.findById(room._id);
            if (roomToUpdate) {
                roomToUpdate.isOccupied = false;
                await roomToUpdate.save();
            }
        }

        return res.json({
            title: "Invitation deleted",
            deletedInvitation,
        });
    } catch (err) {
        res.status(500).json({
            title: "Error deleting invitation",
            message: err.message,
        });
    }
};

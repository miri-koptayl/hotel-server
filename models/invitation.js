import { Schema, model, Types } from "mongoose";
import { roomSchema } from "./room.js";



const invitationSchema = Schema({
    id: Number,
    date: { type: Date, default: new Date() },
    deadline: { type: Date, default: new Date() },
    address: String,//כתובת קבלה
    userId: { type: Types.ObjectId, ref: "user" },
    orderRooms: [roomSchema],
    isFinish: { type: Boolean, default: false },
    Servicefees: Number,
    finaPrice: Number

})

export const invitationModel = model("invitation", invitationSchema);
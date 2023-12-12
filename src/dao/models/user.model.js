import mongoose from "mongoose";

const usersColection ='users'
const usersSchema=new mongoose.Schema(
    {
        nombre: String, 
        apellido: String,
        email: {
            type:String, unique:true, required: true 
        },
        edad: Number,
        deleted: {
            type: Boolean, default: false
        }
    },
    {
        timestamps: true,
        strict: true 
    }
)

export const usuraiosModelo=mongoose.model(usersColection, usersSchema)
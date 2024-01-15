import mongoose, { Schema } from "mongoose"

const usuariosEsquema=new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String, unique: true
        },
       age: Number,
        password: String,
        usuario: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }, 
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'carts'
        }
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    }
)

export const usuariosModelo=mongoose.model("usuarios", usuariosEsquema)
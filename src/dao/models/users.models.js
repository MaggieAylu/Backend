import mongoose, { Schema } from "mongoose"

const usuariosEsquema=new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        email: {
            type: String, unique: true
        },
        edad: Number,
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
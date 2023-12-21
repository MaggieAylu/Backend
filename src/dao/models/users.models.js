import mongoose from "mongoose"

const usuariosEsquema=new mongoose.Schema(
    {
        nombre: String,
        email: {
            type: String, unique: true
        },
        password: String,
        usuario: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        } 
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    }
)

export const usuariosModelo=mongoose.model("usuarios", usuariosEsquema)
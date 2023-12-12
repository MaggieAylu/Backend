import mongoose from "mongoose"

const chatCollection = 'chat'
const chatSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true, 
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: DataTransfer.now,
        },
    },
    { timestamps: true },
)


export const ChatModel = mongoose.model(chatCollection, chatSchema)
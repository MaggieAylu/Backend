import mongoose from "mongoose"

export const chatModels = mongoose.model(
    "message",
    new mongoose.Schema(
        {
            emisor: {
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
        { timestamps: true }
    )
)

const Chat = mongoose.model('message', chatModels)
export default Chat
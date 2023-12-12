import { ChatModel } from "../models/chat.model"


export class MessageManagerMongo {
  async getMessagesMongo() {
    try {
      return await ChatModel.find({ deleted: false }).lean()
    } catch (error) {
      console.log(error.messsage)
      return null
    }
  }
  async addMessageMongo(
    user,
    message,
  ) {
    try {
        let mensaje = {
            user: user,
            message: message,
          }
       let nuevoMensaje = await ChatModel.create(mensaje)
        return nuevoMensaje
    } catch (error) {
        console.log(`error inesperado en el servidor -Intente mas tarde`, error.message)
        return error.mensaje
    }
  }
}
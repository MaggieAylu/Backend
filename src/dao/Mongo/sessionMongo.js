import { usuariosModelo } from "../models/users.models.js"


export class SessionManagerDB{
    contructor(){
        this.model = usuariosModelo
    }
    async getUsuarios(){
        try {
            let data = await  usuariosModelo.find(first_name) 
            return data
        } catch (error) {
            if (error) {
                console.log(error)  
                return null 
            }
        }
        
    }
}



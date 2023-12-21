// import { usuariosModelo } from "../models/users.models.js"

// export class SessionManagerDB {
//     constructor() {
//         this.model = usuariosModelo
//     }

//     async registerUser(signupForm) {
//         try {
//             const result = await this.model.create(signupForm)
//             return result
//         } catch (error) {
//             console.log("registerUser: ", error.message)
//             throw new Error ("Error completing registration")
//         }
//     }

//     async loginUser(loginForm) {
//         try {
//             const result = await this.model.findOne({email: loginForm.email})

//             if (!result) {
//                 return null
//             }
            
//             if (result.password !== loginForm.password) {
//                 return null
//             }
            
//             return result
//         } catch (error) {
//             console.log("loginUser: ", error.message)
//             throw new Error ("Error logging in. Please try again.")
//         }
//     }
// }
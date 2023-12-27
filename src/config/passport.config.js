import passport from "passport"
import local from "passport-local"
import { usuariosModelo } from "../dao/models/users.models.js"
import { createHash, isValidPassword } from "../utils.js"
import github from 'passport-github2'


export const inicializarPassport=()=>{

    passport.use('github', new github.Strategy(
        {
            clientID: "", 
            clientSecret: "", 
            callbackURL: "", 
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                // console.log(profile)
                let usuario=await usuariosModelo.findOne({email: profile._json.email})
                if(!usuario){
                    let nuevoUsuario={
                        nombre: profile._json.name,
                        email: profile._json.email, 
                        profile
                    }

                    usuario=await usuariosModelo.create(nuevoUsuario)
                }
                return done(null, usuario)


            } catch (error) {
                return done(error)
            }
        }
    ))

        passport.use('signup', new local.Strategy(
        {
            passReqToCallback: true, usernameField: 'email' //, passwordField: "clave"
        },
        async(req, username, password, done)=>{
            try {
                console.log("Estrategia local registro de Passport...!!!")
                let {nombre, email}=req.body
                if(!nombre || !email || !password){
                    // return res.redirect('/signup?error=Complete todos los datos')
                    return done(null, false)
                }
            
                let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                console.log(regMail.test(email))
                if(!regMail.test(email)){
                    // return res.redirect('/signup?error=Mail con formato incorrecto...!!!')
                    return done(null, false)
                }
            
                let existe=await usuariosModelo.findOne({email})
                if(existe){
                    // return res.redirect(`/signup?error=Existen usuarios con email ${email} en la BD`)
                    return done(null, false)
                }
                
                // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
                password=createHash(password)
                console.log(password)
                // // let usuario
                try {
                    let usuario=await usuariosModelo.create({nombre, email, password})
                    // res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
                    return done(null, usuario)
                    // previo a devolver un usuario con done, passport graba en la req, una propiedad
                    // user, con los datos del usuario. Luego podré hacer req.user
                } catch (error) {
                    // res.redirect('/signup?error=Error inesperado. Reintente en unos minutos')
                    return done(null, false)
                }
                   
            } catch (error) {
                return done(error)
            }
        }
    ))

    // serializador / deserializador
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await usuariosModelo.findById(id)
        return done(null, usuario)
    })

} 


// export const inicializarPassport=()=>{

//     passport.use('signup', new local.Strategy(
//         {
//             passReqToCallback: true, usernameField: 'email' //, passwordField: "clave"
//         },
//         async(req, username, password, done)=>{
//             try {
//                 console.log("Estrategia local registro de Passport...!!!")
//                 let {nombre, email}=req.body
//                 if(!nombre || !email || !password){
//                     // return res.redirect('/signup?error=Complete todos los datos')
//                     return done(null, false)
//                 }
            
//                 let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
//                 console.log(regMail.test(email))
//                 if(!regMail.test(email)){
//                     // return res.redirect('/signup?error=Mail con formato incorrecto...!!!')
//                     return done(null, false)
//                 }
            
//                 let existe=await usuariosModelo.findOne({email})
//                 if(existe){
//                     // return res.redirect(`/signup?error=Existen usuarios con email ${email} en la BD`)
//                     return done(null, false)
//                 }
                
//                 // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
//                 password=createHash(password)
//                 console.log(password)
//                 // // let usuario
//                 try {
//                     let usuario=await usuariosModelo.create({nombre, email, password})
//                     // res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
//                     return done(null, usuario)
//                     // previo a devolver un usuario con done, passport graba en la req, una propiedad
//                     // user, con los datos del usuario. Luego podré hacer req.user
//                 } catch (error) {
//                     // res.redirect('/signup?error=Error inesperado. Reintente en unos minutos')
//                     return done(null, false)
//                 }
                   
//             } catch (error) {
//                 return done(error)
//             }
//         }
//     ))

//     passport.use('login', new local.Strategy(
//         {
//             usernameField: 'email'
            
//         },
//         async(username, password, done)=>{
//             try {
//                 if(!username || !password){
//                     return done (null, false)
//                 }
//                 let usuario=await usuariosModelo.findOne({email:username}).lean()
//                 if(!usuario){
//                     return done(null, false)
//                 }
//                 if(!isValidPassword(usuario, password)){
//                     return done(null, false)
//                 }
//                 console.log(Object.keys(usuario))
//                 delete usuario.password
//                 return done(null, usuario)
                
//             } catch (error) {
//                 done(error, null)
//             }
//         }
//     ))

//     // serializador / deserializador
//     passport.serializeUser((usuario, done)=>{
//         return done(null, usuario._id)
//     })

//     passport.deserializeUser(async(id, done)=>{
//         let usuario=await usuariosModelo.findById(id)
//         return done(null, usuario)
//     })

// } 


    

 // fin inicializarPassport
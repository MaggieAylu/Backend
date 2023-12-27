import { Router } from 'express' 
import { usuariosModelo } from '../dao/models/users.models.js' 
// import crypto from 'crypto'
import { isValidPassword } from '../utils.js'
import { createHash } from '../utils.js'
import passport from 'passport'


export const router=Router()

router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    console.log(req.user)
    req.session.usuario=req.user
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Acceso OK...!!!", usuario: req.user
    })
})

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        error: "Error al autenticar con Github"
    })
})

// router.get('/errorLogin', (req,res)=>{
//     return res.redirect('/login?error=Error en el proceso de login... :(')
// })

// router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), async(req, res)=>{
//     // let {email, password}=req.body
//     // if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//     //             req.session.email = email
//     //             req.session.role = "admin"
//     //             req.session.usuario = {
//     //                 nombre: "Admin",
//     //                 email: "adminCoder@coder.com"
//     //             }
//     // } else {
//     //     let userData = await usuariosModelo.findOne({ email })
//     //     if(!userData){
//     //         return res.render("login", { error: "The data entered are incorrect" })
//     //     }

//     // }

//     // if(!email || !password){
//     //     return res.redirect('/login?error=Complete todos los datos')
//     // }

//     // // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")

//     // let usuario=await usuariosModelo.findOne({email, password})
//     // if(!usuario){
//     //     return res.redirect(`/login?error=credenciales incorrectas`)
//     // }

//     // if (email !== "adminCoder@coder.com" && password !== "adminCod3r123"){
//     //     req.session.role= "user"
//     // }
//     console.log(req.user)
    
//     req.session.usuario={
//         nombre: req.user.nombre,
//         email: req.user.email,
//         role: req.user.role
//     }

//     res.redirect('/products')

// })

router.get('/errorSignup',(req,res)=>{
    return res.redirect('/signup?error=Error en el proceso de registro')
})

router.post('/signup', passport.authenticate('signup', {failureRedirect:'/api/sessions/errorSignup'}), async(req,res)=>{

    let {email}=req.body
//     // let {nombre, email, password}=req.body
//     // if(!nombre || !email || !password){
//     //     return res.redirect('/signup?error=Complete todos los datos')
//     // }

//     // let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
//     // console.log(regMail.test(email))
//     // if(!regMail.test(email)){
//     //     return res.redirect('/signup?error=Mail con formato incorrecto...!!!')
//     // }

//     // let existe=await usuariosModelo.findOne({email})
//     // if(existe){
//     //     return res.redirect(`/signup?error=Existen usuarios con email ${email} en la BD`)
//     // }
    
//     // password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
//     // let usuario
//     // try {
//     //     usuario=await usuariosModelo.create({nombre, email, password})
//     //     res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
        
//     // } catch (error) {
//     //     res.redirect('/signup?error=Error inesperado. Reintente en unos minutos')
//     // }

    res.redirect(`/login?message=Usuario ${email} registrado correctamente`)

})

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })

    res.redirect('/login')

}) 

export {router as sessionRouter}


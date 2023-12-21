import { Router } from 'express' 
import { usuariosModelo } from '../dao/models/users.models.js' 
import crypto from 'crypto'



export const router=Router()

router.post('/login', async(req, res)=>{
    let {email, password}=req.body
    const loginForm = req.body

    if (loginForm.email === "adminCoder@coder.com" && loginForm.password === "adminCod3r123") {
        req.session.email = loginForm.email
        req.session.role = "admin"
    } else {
        let userData = await usuariosModelo.findOne({ email: loginForm.email })
        if(!userData){
            return res.render("login", { error: "The data entered are incorrect" })
        }

    }

    if(!email || !password){
        return res.redirect('/login?error=Complete todos los datos')
    }

    password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")

    let usuario=await usuariosModelo.findOne({email, password})
    if(!usuario){
        return res.redirect(`/login?error=credenciales incorrectas`)
    }
    
    // req.session.usuario={
    //     nombre:usuario.nombre, email:usuario.email
    // }

    res.redirect('/api/productsmongo')

})

router.post('/signup',async(req,res)=>{

    let {nombre, email, password}=req.body
    if(!nombre || !email || !password){
        return res.redirect('/signup?error=Complete todos los datos')
    }

    let regMail=/^(([^<>()\[\]\\., :\s@”]+(\.[^<>()\[\]\\., :\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    console.log(regMail.test(email))
    if(!regMail.test(email)){
        return res.redirect('/signup?error=Mail con formato incorrecto...!!!')
    }

    let existe=await usuariosModelo.findOne({email})
    if(existe){
        return res.redirect(`/signup?error=Existen usuarios con email ${email} en la BD`)
    }
    
    password=crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
    let usuario
    try {
        usuario=await usuariosModelo.create({nombre, email, password})
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
        
    } catch (error) {
        res.redirect('/signup?error=Error inesperado. Reintente en unos minutos')
    }

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
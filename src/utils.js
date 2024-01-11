import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport"

export const SECRETKEY="2024"

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (usuario,password) => bcrypt.compareSync(password, usuario.password)
export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/imagenes"))
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const generaToken=(usuario)=>jwt.sign({...usuario}, SECRETKEY, {expiresIn: "1h"})

export const passportCall=(estrategia)=>{
    return function(req, res, next) {
        passport.authenticate(estrategia, function(err, user, info, status) {
          if (err) { return next(err) }
          if (!user) {
                return res.errorCliente(info.message?info.message:info.toString())
          }
          req.user=user
          return next()
        })(req, res, next)
      }
}





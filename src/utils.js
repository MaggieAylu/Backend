import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password)
export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/imagenes"))
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({ storage: storage })

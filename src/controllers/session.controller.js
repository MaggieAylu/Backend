export class SessionsController {
    static Login = async (req, res) => {
        res.render("login", { message: "Registered user"})
    }

    static signup = async (req, res) => {
        res.render("signup", { error: "Error completing registration" })
    }

    static current = async (req,res) =>{
        res.render("current", {message: "Here's the user"})
    }
}


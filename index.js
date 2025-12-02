import express from "express"
import cors from "cors"
import mysql2 from "mysql2"

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD} = process.env

const app = express ()
const port = 3333

app.use(cors())
app.use(express.json())

app.get("/", (request, response) =>{
    const selectCommand = "SELECT name, email FROM beatrizfirmado_02mb"

    database.query(selectCommand, (error, users) =>{
        if (error){
            console.log(error)
            return
        }

        response.json(users)
    })
})


// ⭐⭐ LOGIN FUNCIONANDO ⭐⭐
app.post("/login", (request, response) => {
    const { email, password } = request.body.user

    const selectCommand = "SELECT * FROM beatrizfirmado_02mb WHERE email = ?"

    database.query(selectCommand, [email], (error, user) => {

        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro no login" })
        }

        if (user.length === 0 || user[0].password !== password) {
            return response.status(400).json({ message: "Usuário ou senha incorretos!" })
        }

        response.json({
            id: user[0].id,
            name: user[0].name,
            email: user[0].email
        })

    })
})



app.post("/cadastrar", (request, response) =>{
    const {user} = request.body
    console.log (user)

    const insertCommand=`
    INSERT INTO beatrizfirmado_02mb (name, email, password)
    VALUES (?, ?, ?)
    `

    database.query (insertCommand, [user.name, user.email, user.password], (error) =>{

        if (error){

            // ⭐⭐ FUNCIONA EM TODAS AS VERSÕES ⭐⭐
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                return response
                .status(400)
                .json({ message: "Email já cadastrado!" })
            }

            console.log(error)
            return response.status(500).json({ message: "Erro ao cadastrar!" })
        } 

        response.status(201).json({message: "Usuário cadastrado com sucesso!"})
    })
})



app.listen(port, () =>{
    console.log(`Server running on port ${port}!`)
})

const database = mysql2.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionLimit: 11
})

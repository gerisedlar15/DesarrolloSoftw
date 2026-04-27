//importamos express
import express from "express"

//1: creamos una bella instancia de app :)
const app = express()

app.get("/", (req, res)=>{
    res.send("<h1>si aparece soy una crackk/ <h1>")
})
app.get("/usuarios",(req,res)=> {
    const usuarios= [
        { 
            id:1,
            nombre: "geru",
        }
    ]

    res.json(usuarios)
})
const PORT = 3001
//"escuchamos "nuestar app
app.listen(PORT, () => {
    console.log('escuchando en http://localhost:3001')
})

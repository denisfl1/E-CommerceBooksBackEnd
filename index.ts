import express from 'express';
import router from './routes/linkRoute';
const cors = require("cors")


const app = express()
const port = 5000



app.listen(port,()=>{

    console.log("Running on Port",port)

})

app.use(express.json({limit:'50mb'}))

app.use(cors())

app.use('/',router)




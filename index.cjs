// index.cjs (CommonJS)
const express =  require("express");
const { connection } = require("./db");

require('dotenv').config()

const app = express();
app.use(express.json());

var cors = require('cors');
const { paymentRouter } = require("./Routes/Payment.routes");
app.use(cors())


// Import Swagger dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

app.use('/api/v1', paymentRouter);

app.use('/*', (req, res) => {
    res.status(404).send({ Error: 'Page not found' })
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500).send({Error: err.message || 'Internal Server Error'})
})


app.listen(process.env.port, async()=>{
    try{
        await connection
        console.log("connection");
     }catch(err){
        console.log("not connected");
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.port}`)
})

module.exports = app;
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
app.use(cors());
// app.options("*", cors())
import productRouter from './routers/products.js';
import categoryRouter from './routers/categories.js';
import userRouter from './routers/users.js';
import orderRouter from './routers/orders.js'
// import AccessToken from './helpers/jwt.js'
import connectDB from './connection/conn.js'



app.options("*", cors())
// app.use(AccessToken)

const api = process.env.API_URL
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use(`${api}/products`, productRouter)
app.use(`${api}/category`, categoryRouter)
app.use(`${api}/user`, userRouter)
app.use(`${api}/orders`, orderRouter)


const serverStart = () => {
    try {
        app.listen(PORT, () => console.log("server starting at", PORT));
        connectDB()
    } catch (error) {
        console.log(error.message)

    }
}

serverStart()
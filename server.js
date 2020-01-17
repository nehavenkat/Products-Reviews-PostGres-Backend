const express = require("express");
const dotenv = require("dotenv");
const listEndPoints = require("express-list-endpoints");

dotenv.config();
const server = express();
const db = require('./db');
const productreviewsRouter= require("./src/routes/productreviews")
server.use(express.json());
server.use('/products',productreviewsRouter)
server.get('/',async (req,res) =>
{
const response = await db.query("SELECT * FROM products")
res.send(response.rows)
}
)
console.log(listEndPoints(server));

server.listen(process.env.PORT,() =>
console.log(`SERVER IS LISTENING ON ${process.env.PORT}`))
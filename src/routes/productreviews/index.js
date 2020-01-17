const express = require("express")
const db = require("../../../db")
const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const products = await db.query(`SELECT * FROM products LIMIT $1 OFFSET $2`,[req.query.limit,req.query.offset])
        res.send(products.rows)
    }
    catch (ex) {
        res.status(500).send(ex)
    }
    })
router.get('/:id', async (req,res) => {
try {
    const products = await db.query(`SELECT * FROM products WHERE _id =$1`, [req.params.id])
        if (products.rowCount === 0)
            return res.status(404).send("Not Found");
        else
            return res.send(products.rows[0])
} catch (error) {
    res.status(500).send(error)
    
}
})
router.post('/', async (req, res) => {
    try {
        const result = await db.query(`INSERT INTO products (name,description,brand,imageurl,price,category)
                                   VALUES($1,$2,$3,$4,$5,$6)
                                   RETURNING *`,
    [req.body.name, req.body.description, req.body.brand, req.body.imageurl, req.body.price, req.body.category])
        res.send(result.rows[0])
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put("/:id", async (req, res) => {
    try {
        console.log(req.body, req.params.id)
        const result = await db.query(`UPDATE products SET 
                                       name= $1,
                                       description = $2,
                                       brand= $3,
                                       imageurl= $4 ,
                                       price= $5,
                                       category= $6
                                       WHERE _id= $7`,
  [req.body.name, req.body.description, req.body.brand, req.body.imageurl, req.body.price, req.body.category, req.params.id]);
           
        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("OK")
    }
    catch (ex) {
        res.status(500).send(ex)
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const result = await db.query(`DELETE FROM products WHERE _id = $1`, [req.params.id])

        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("OK")
    }
    catch (ex) {
        res.status(500).send(ex)
    }
})

router.get("/:id/reviews", async (req, res)=>{
    try{
      const reviews = await db.query(`SELECT * FROM reviews WHERE _id = $1`, 
                                       [ req.params.id])
      res.send(reviews.rows)
    }
  catch (ex) {
       res.status(500).send(ex)
    }
})

router.post('/:id/reviews',async (req,res) => {
    try {
    const newReview = await db.query(`INSERT INTO reviews (comment,rate,productid)
                                       VALUES ($1,$2,$3) 
                                       RETURNING *`,
             [ req.body.comment, req.body.rate, req.body.productid])
res.send(newReview.rows[0])
    } catch (error) {
        res.status(500).send(error)  
        console.log(req.params.productid)
    }
})

router.put("/:asin/reviews/:reviewId", async (req, res)=>{
    try{
        const updatedReview = await db.query(`UPDATE Reviews 
                                        SET rate = $1,
                                        comment = $2
                                        WHERE _id = $3`,
                                        [ req.body.rate, req.body.comment, req.params.reviewId])

        if (updatedReview.rowCount === 0)
            return res.status(404).send("NOT FOUND!")
        else
            res.send("OK")
    }
    catch(ex){
        res.status(500).send(ex)
    }
})

router.delete("/:asin/reviews/:reviewId", async(req,res)=>{
    try{
        const deleteQuery = await db.query("DELETE FROM Reviews WHERE _id = $1", [req.params.reviewId])

        if (deleteQuery.rowCount === 0)
            return res.status(404).send("NOT FOUND!")
        else 
            res.send("OK")
    }
    catch(ex){
        res.status(500).send(ex)
    }
})
//router.get('/:id/reviews', async (req, res) => {
  //  try {
    //    const reviews = await db.query(`SELECT * FROM products JOIN reviews ON reviews._id=reviews._id WHERE reviews._id =$1`, [req.params.id])
      //  if (reviews.rowCount === 0)
        //    return res.status(404).send("NOT FOUND");
        //else
          //  return res.send(reviews.rows[0])
    //} catch (error) {
      //  res.status(500).send(error)
    //}
//})


module.exports = router;
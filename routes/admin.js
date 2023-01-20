const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

router.use("/add-product", (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'><input type='text'  name='title'/><button type='submit'>submit</button></form>"
  );
});

router.use("/product", adminController.AddProduct);

module.exports = router;

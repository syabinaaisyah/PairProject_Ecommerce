const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

//Role User
// NAVBAR: 
// myProfile (can log out & top up) 
// myOrder
// column Balance -> only display balance

// Tambahkan routing login/register
// localhost:3000/

router.get("/products", Controller.getAllProducts); // *instance method* "Almost sold out" if stock < 5, *search bar* & *filter* category

router.get("/myProfile", Controller.myProfile); // For Logout & Top Up Balance (form)
router.get("/logout", Controller.logout); // For Logout
router.post("/myProfile", Controller.topUpBalance); // Top Up UPDATE Balance

router.get("/products/:id", Controller.getProductbyId); // show Description + Tombol BUY

router.get("/products/:id/shop", Controller.shop); // get item price, click "Pay Button" -> deduct balance
router.post("/products/:id/shop", Controller.deductBalance); // Pay Button -> deduct balance --> create order, redirect to myOrder

router.get("/myOrders", Controller.getTransactionbyUserId); // query Transaction where userId, order by Created Date


// Role Admin
router.get("/admin/dashboard", Controller.dashboardAdmin); 
// 2 table (product and category), ada button add & delete hanya untuk Product. 
// Category uneditable, undeletable, unaddable. Table Category only shows how many products uploaded in the category (fn.COUNT)
// all users -> statistic umur dan gender (percentage range usia dan gender) fn.COUNT-> tombol see all.
// Section transactions -> fn.SUM, fn.MIN, fn.MAX, fn.AVG, all income & See All (sort by latest transaction)

router.get("/admin/products/add", Controller.showAddProductsForm); 
// passing data category + hooks before create stock: 0 + validasi not null & not empty
router.post("/admin/products/add", Controller.postAddProductsForm); // redirect back to /admin/products

router.get("/admin/products/edit", Controller.showEditProductsForm); // passing old Values
router.post("/admin/products/edit", Controller.postAddProductsForm); // redirect back to /admin/products

router.get("/admin/products/delete", Controller.deleteProductById) 

router.get("/admin/showUsers", Controller.showUsers) // see all customers
router.get("/admin/showTransaction", Controller.showTransaction) // see all transactions and the customers' name

// *helper*: format Rupiah

module.exports = router
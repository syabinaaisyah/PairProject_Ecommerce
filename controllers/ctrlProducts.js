const {Product, Category} = require('../models');
const {Op} = require('sequelize');
const formatCurrency = require('../helpers/formatCurrency');

exports.products = async (req, res) => {
  let {search} = req.query;
  // let searchName = {};
 try {
let data = ''
  if (search) {
    data = await Product.findAll({
      include: {
        model: Category,  
        required: false  
    },
    where: {
      name: {[Op.iLike]: `%${search}%`}
    },
    order: [["price", "ASC"]],
 });
  } else {
     data = await Product.findAll({
     include: {
         model: Category,  
         required: false  
     },
     order: [["price", "ASC"]],
  });
   } 
  res.render('product', {data, formatCurrency, msg: ''})
 } catch (error) {
  console.log("🚀 ~ exports.products= ~ error:", error)
  res.send(error.message)
 }
}

exports.addProducts = async (req, res) => {
 try {
  const data = await Product.findAll()
  res.render('addProducts', {data})
 } catch (error) {
  console.log("🚀 ~ exports.addProducts= ~ error:", error)
  res.send(error.message)
 }
}

exports.postProducts = async (req, res) => {
 try {
  const {name, price, stock, description, imgUrl, CategoryId} = req.body;
  if (!name || !price || !stock || !description || !imgUrl || !CategoryId) {
   return res.send({ msg: 'Field cannot be empty!' });
   }
  await Product.create({name, price, stock, description, imgUrl, CategoryId})
  res.redirect('/products')
 } catch (error) {
  console.log("🚀 ~ exports.postProducts= ~ error:", error)
  res.send(error.message)
 }
}

exports.buy = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.send({ msg: 'Product not found!' });
    }

    if (product.stock < 1) {
      return res.send({ msg: 'Out of stock!' });
    }

    const updatedStock = product.stock - 1;
    await product.update({ stock: updatedStock });
  // console.log('berhasil horeeyy');
  res.redirect('/products')
 } catch (error) {
  console.log("🚀 ~ exports.buy= ~ error:", error)
  res.send(error.message)
 }
}

exports.update = async (req, res) => {
 try {
  const {id} = req.params;
  const data = await Product.findByPk(id)
   // res.send(data)
   if (!data) {
    return res.send({ msg: 'product is not found!' });
}
  res.render('update', {data})  
 } catch (error) {
  console.log("🚀 ~ exports.update= ~ error:", error)
  res.send(error.message)
 }
}

exports.postUpdate = async (req, res) => {
  const {id} = req.params;
  const {name, price, stock, description, imgUrl, CategoryId} = req.body;
  
 try {
  if (!name && !price && !stock && !description && !imgUrl && !CategoryId) {
   return res.send({ msg: 'Please fiil the field!' });
}
  const data = await Product.findByPk(id)
  if (!data) {
   return res.send({ msg: 'product is not found!' });
}
const data2 = await Product.findByPk(id)
  await data2.update({name, price, stock, description, imgUrl, CategoryId})
  res.redirect('/products');
//  res.render('/products', {data})  
 } catch (error) {
  console.log("🚀 ~ exports.update= ~ error:", error)
  res.send(error.message)
 }
}

exports.deleteProduct = async (req, res) => {
 try {
  const {id} = req.params;
  const data = await Product.findByPk(id)
  if (!data) {
   return res.send({ msg: 'Product is not found' });
}
  await Product.destroy({
   where: {id}
  })
  res.redirect('/products')
 } catch (error) {
  console.log("🚀 ~ exports.delete ~ error:", error)
  res.send(error.message)
 }
}
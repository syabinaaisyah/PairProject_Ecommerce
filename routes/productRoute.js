const { planning } = require('../controllers/ctrlLogin');
const { products, addProducts, postProducts, buy, update, postUpdate, deleteProduct } = require('../controllers/ctrlProducts');

const router = require('express').Router();

router.get('/products', products);
router.get('/products/add', addProducts);
router.post('/products/add', postProducts);
router.post('/products/:id/buy', buy);
router.get('/products/:id/update', update);
router.post('/products/:id/update', postUpdate);
router.get('/products/:id/delete', deleteProduct);
router.get('/rought', planning)

module.exports = router;
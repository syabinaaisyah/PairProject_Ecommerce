const { formatCurrency } = require('../helper/formatCurrency');
const { Product, Category, Customer, User, Order, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');

class Controller {
    // USER ROLE
    static async getAllProducts(req, res) {
        try {
            const { search, category } = req.query;
            let where = {};
            if (search) where.name = { [Op.iLike]: `%${search}%` };
            if (category) where.CategoryId = category;
            // console.log("🚀 ~ Controller ~ getAllProducts ~ category:", category)
            const categories = await Category.findAll();
            const products = await Product.findAll({
                where,
                include: { model: Category, as: 'category' },
            });
            // console.log("🚀 ~ Controller ~ getAllProducts ~ products:", products)

            products.forEach((product) => {
                product.status = product.showStatus();
            });

            res.render('products', {
                title: 'Products',
                products,
                categories,
                selectedCategory: category || '',
                search: search || '',
                formatCurrency
            })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async myProfile(req, res) {
        try {
            // console.log(`masuk controller`);
            
            const user = await Customer.findOne({ where: { UserId: req.user.id } });
            // console.log("🚀 ~ Controller ~ myProfile ~ user:", user)
            res.render('profile', { user });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static logout(req, res) {
        req.session.destroy(() => res.redirect('/login'));
    }

    static async topUpBalance(req, res) {
        try {
            const { balance } = req.body;
            await Customer.increment('balance', {
                by: parseInt(balance),
                where: { UserId: req.user.id },
            });
            res.redirect('/myProfile');
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async getProductbyId(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            res.render('productDetail', { product });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async shop(req, res) {
        try {
            // console.log(`masuk controller shop`);
            
            const product = await Product.findByPk(req.params.id);
            res.render('shop', { product, formatCurrency });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async deductBalance(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            const customer = await Customer.findOne({ where: { UserId: req.user.id } });

            if (customer.balance < product.price) {
                return res.send('Insufficient balance.');
            }

            await Customer.decrement('balance', {
                by: product.price,
                where: { UserId: req.user.id },
            });

            await Order.create({
                CustomerId: customer.id,
                ProductId: product.id,
            });

            res.redirect('/myOrders');
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
    

    static async getTransactionbyUserId(req, res) {
        try {
            const orders = await Order.findAll({
                where: { CustomerId: req.user.CustomerId },
                include: [
                    { model: Product, as: 'product' },
                    { model: Customer, as: 'customer' },
                ],
                order: [['createdAt', 'DESC']],
            });
            res.render('transactionsUser', { orders });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    // ADMIN ROLE
    static async dashboardAdmin(req, res) {
        try {
            
            const products = await Product.findAll();
            const productCount = await Product.count();
    
            const categoryStats = await Category.findAll({
                attributes: [
                    'name',
                    [fn('COUNT', col('products.id')), 'productCount']
                ],
                include: { model: Product, as: 'products', attributes: [] },
                group: ['Category.id']
            });
            // console.log("🚀 ~ Controller ~ dashboardAdmin ~ categoryStats:", categoryStats)
    
            const userStats = await Customer.customerStat()
            // console.log("🚀 ~ Controller ~ dashboardAdmin ~ userStats:", userStats)
    
            const transactions = await Order.findAll({
                attributes: [
                    'CustomerId',
                    [fn('COUNT', col('product.price')), 'totalTransaction'],
                    [fn('SUM', col('product.price')), 'totalIncome'],
                    [fn('MAX', col('product.price')), 'highestTransaction'],
                    [fn('MIN', col('product.price')), 'lowestTransaction'],
                    [fn('AVG', col('product.price')), 'averageTransaction']
                ],
                include: [{
                    model: Product,
                    as: 'product', 
                    attributes: []
                }],
                group: ['Order.CustomerId']
            });
            // console.log("🚀 ~ Controller ~ dashboardAdmin ~ transactions[0]:", transactions[0])
    
            res.render('adminDashboard', {
                products,
                productCount,
                categoryStats,
                userStats,
                transactions,
                formatCurrency
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
    

    static async showAddProductsForm(req, res) {
        try {
            const categories = await Category.findAll();
            const { errors } = req.query
            res.render('addProduct', { categories, errors});
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async postAddProductsForm(req, res) {
        try {
            const { name, price, description, imageURL, CategoryId } = req.body;
            await Product.create({
                name,
                price,
                description,
                imageURL,
                CategoryId
            });
            console.log(`sudah selesai create`);
            
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err);
            if (err.name === "SequelizeValidationError") {
                const errors = err.errors.map(x => x.message)
                res.redirect(`/admin/products/add?errors=${errors}`)
                return
            }
            res.send(err)
        }
    }

    static async showEditProductsForm(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            const categories = await Category.findAll();
            res.render('editProduct', { product, categories });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async postEditProductsForm(req, res) {
        try {
            // console.log("🚀 ~ Controller ~ postEditProductsForm ~ req:", req.params)
            const {id} = req.params
            const {name, price, stock, description, imageURL, CategoryId} = req.body
            // console.log("🚀 ~ Controller ~ postEditProductsForm ~ body:", req.body)
            await Product.update(
                { name, price, stock, description, imageURL, CategoryId},
                {
                    where: {
                        id
                    },
                }
            )
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deleteProductById(req, res) {
        try {
            await Product.destroy({ where: { id: req.params.id } });
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async showUsers(req, res) {
        try {
            const users = await User.findAll({
                include: [{
                    model: Customer,
                    as: 'customer', 
                    attributes: ['name', 'gender']
                }],
            });
            console.log("🚀 ~ Controller ~ showUsers ~ users:", users[0])
            res.render('users', { users });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    static async showTransaction(req, res) {
        try {
            const transactions = await Order.findAll({
                include: [
                    { model: Customer, as: 'customer' },
                    { model: Product, as: 'product' },
                ],
                order: [['createdAt', 'DESC']],
            });
            res.render('transactionsAdmin', { transactions, formatCurrency });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
}

module.exports = Controller;

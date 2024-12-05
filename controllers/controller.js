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
            res.render('transactions', { orders });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }

    // ADMIN ROLE
    static async dashboardAdmin(req, res) {
        try {
            
            const productCount = await Product.count();
    
            const categoryStats = await Category.findAll({
                attributes: [
                    'name',
                    [fn('COUNT', col('products.id')), 'productCount']
                ],
                include: { model: Product, as: 'products', attributes: [] },
                group: ['Category.id']
            });
    
            const userStats = await Customer.findAll({
                attributes: [
                    [fn('COUNT', col('gender')), 'total'],
                    'gender'
                ],
                group: ['gender']
            });
    
            // const transactions = await Order.findAll({
            //     attributes: [
            //         'CustomerId',
            //         [fn('SUM', col('Products.price')), 'totalIncome'],
            //         [fn('MAX', col('Products.price')), 'highestTransaction'],
            //         [fn('MIN', col('Products.price')), 'lowestTransaction'],
            //         [fn('AVG', col('Products.price')), 'averageTransaction']
            //     ],
            //     include: [{
            //         model: Product,
            //         as: 'Products', 
            //         attributes: []
            //     }],
            //     group: ['Order.CustomerId']
            // });
    
            res.render('adminDashboard', {
                productCount,
                categoryStats,
                userStats,
                // transactions,
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
    

    static async showAddProductsForm(req, res) {
        try {
            const categories = await Category.findAll();
            res.render('addProduct', { categories });
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
                CategoryId,
                stock: 0,
            });
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err);
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
            const users = await Customer.findAll();
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
            res.render('transactions', { transactions });
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
}

module.exports = Controller;

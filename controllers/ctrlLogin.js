const { User, Customer } = require("../models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


exports.home = async (req, res) => {
  try {
    const message = req.query.message || null;
    const errors = req.session.errors || null; // Assuming errors are stored in the session or passed directly
    req.session.errors = null; // Clear errors after rendering
    res.render("home", { errors, message });
  } catch (error) {
    console.log("🚀 ~ exports.home= ~ error:", error);
    res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const message = req.query.message || null;
    const errors = req.session.errors || null; // Assuming errors are stored in the session or passed directly
    req.session.errors = null; // Clear errors after rendering
    res.render("home", { message, errors });

    // res.render("home");
  } catch (error) {
    console.log("🚀 ~ exports.login= ~ error:", error);
    res.send(error.message);
  }
};

exports.loginPage = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    // console.log("🚀 ~ exports.loginPage= ~ user:", user)
    if (user && bcrypt.compareSync(password, user.password)) {
      // Store user ID and role in session
      // console.log(`masuk ke dalam sini`);
      
      req.session.CustomerId = user.id;
      req.session.role = user.role;

      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard'); // Redirect to admin dashboard
      }
      return res.redirect('/products'); // Redirect normal users
    } else {
      return res.redirect('/login?error=Invalid email or password');
    }
  } catch (error) {
    console.log("🚀 ~ exports.loginPage= ~ error:", error);
    res.status(500).send(error.message);
  }
};

exports.register = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log("🚀 ~ exports.register= ~ error:", error);
    res.send(error.message);
  }
};

exports.registPage = async (req, res) => {
  try {
    const { email, password, dateOfBirth, role, name, gender, address, phoneNumber } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user in Users table
    const user = await User.create({
      email,
      password: hashedPassword,
      dateOfBirth,
      role,
    });

    // Create customer in Customers table
    await Customer.create({
      name,
      address,
      phoneNumber,
      gender,
      UserId: user.id,
    });

    res.redirect("/");
  } catch (error) {
    console.log("🚀 ~ exports.registPage= ~ error:", error);
    res.status(500).render("register", {
      errors: [{ msg: "Something went wrong. Please try again." }],
      oldInput: req.body,
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/login?message=You%20are%20logged%20out');
    });
  } catch (error) {
    console.log("🚀 ~ exports.logOut= ~ error:", error);
    res.send(error.message);
  }
};

const { User, Customer } = require("../models");
const bcrypt = require("bcryptjs");

exports.planning = async (req, res) => {
  try {
    res.render("homePage");
  } catch (error) {
    console.log("🚀 ~ exports.home= ~ error:", error);
    res.send(error.message);
  }
};

exports.home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("🚀 ~ exports.home= ~ error:", error);
    res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("🚀 ~ exports.login= ~ error:", error);
    res.send(error.message);
  }
};

exports.loginPage = async (req, res) => {
  try {
    const { name, password } = req.body;
    const customer = await Customer.findOne({
      where: { name },
    });
    if (!customer) {
      return res.send("Invalid name or password.");
    }
    const validatePassword = bcrypt.compareSync(password, customer.password);
    // console.log(validatePassword)
    if (!validatePassword) {
      return res.send("Invalid name or password.");
    }
    req.session.CustomerId = customer.id;
    res.redirect("/products");
  } catch (error) {
    console.log("🚀 ~ exports.loginPage= ~ error:", error);
    res.send(error.message);
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
    const { name, gender, email, password } = req.body;
    const userAlreadyExist = await User.findOne({ where: { name } });
    if (userAlreadyExist) {
      return res.send("name already exists.");
    }

    const emailAlreadyExist = await User.findOne({ where: { email } });
    if (emailAlreadyExist) {
      return res.send("Email already exists.");
    }
    await User.create({ name, gender, email, password });
    res.redirect("/login");
  } catch (error) {
    console.log("🚀 ~ exports.regisPage= ~ error:", error);
    res.send(error.message);
  }
};

exports.logOut = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        return res.send(err.message);
      }
      return res.redirect("/login");
    });
  } catch (error) {
    console.log("🚀 ~ exports.logOut= ~ error:", error);
    res.send(error.message);
  }
};

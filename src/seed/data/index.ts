const products = require("./products.json") as JSON;
const cart = require("./cart.json") as JSON;
const orders = require("./orders.json") as JSON;

const seedData = {
  Product: products,
  Cart: cart,
  Order: orders,
};

module.exports = seedData;

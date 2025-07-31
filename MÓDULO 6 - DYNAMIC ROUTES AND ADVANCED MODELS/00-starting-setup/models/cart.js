const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 };
    let updatedProduct;
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }

        //analyze the cart => finding existing product
        const existingProductIndex = cart.products.findIndex(
          (prod) => prod.id === id
        );
        const existingProduct = cart.products[existingProductIndex];
        //add new product / increase quantity
        if (existingProduct) {
          updatedProduct = {
            ...existingProduct,
            quantity: existingProduct.quantity + 1,
          };
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + parseFloat(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let updatedCart = { ...JSON.parse(fileContent) };
      const currentProduct = updatedCart.products.find(
        (prod) => prod.id === id
      );
      if (!currentProduct) {
        return;
      }
      const currentProdQty = currentProduct.quantity;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - (productPrice * currentProdQty);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    })
  }
};

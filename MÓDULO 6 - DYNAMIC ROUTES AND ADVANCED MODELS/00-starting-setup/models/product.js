const fs = require("fs");
const path = require("path");

const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const exitingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        let updatedProduct = [...products];
        updatedProduct[exitingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err);          
        })
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static delete(id) {
    getProductsFromFile((products) => {
      const currentProd = products.find(prod => prod.id === id);
      const updateProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, currentProd.price);
        }
      })
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};

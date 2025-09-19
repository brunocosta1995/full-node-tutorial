const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const existingProductIndex = this.cart.items.findIndex(
    (cartProd) => cartProd.productId.toString() === product._id.toString()
  );
  let newQuantity = 1;
  const newCartItems = [...this.cart.items];
  if (existingProductIndex >= 0) {
    newQuantity = this.cart.items[existingProductIndex].quantity + 1;
    newCartItems[existingProductIndex].quantity = newQuantity;
  } else {
    newCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = { items: newCartItems };
  this.cart = updatedCart;
  return this.save();  
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(
      (prod) => prod.productId.toString() !== productId.toString()
    );
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
}

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../util/database").getDb;
// const { ObjectId } = require("mongodb");

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; //{items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb;
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   static fetchById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(String(userId)) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const existingProductIndex = this.cart.items.findIndex(
//       (cartProd) => cartProd.productId.toString() === product._id.toString()
//     );
//     let newQuantity = 1;
//     const newCartItems = [...this.cart.items];
//     if (existingProductIndex >= 0) {
//       newQuantity = this.cart.items[existingProductIndex].quantity + 1;
//       newCartItems[existingProductIndex].quantity = newQuantity;
//     } else {
//       newCartItems.push({
//         productId: new ObjectId(String(product._id)),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = { items: newCartItems };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(String(this._id)) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const multipleId = this.cart.items.map((items) => {
//       return items.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: multipleId } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => {
//           return {
//             ...prod,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === prod._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteCartItem(prodId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(
//       (prod) => prod.productId.toString() !== prodId.toString()
//     );
//     if (updatedCartItems) {
//       const updatedCart = { items: [...updatedCartItems] };
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: new ObjectId(String(this._id)) },
//           { $set: { cart: updatedCart } }
//         )
//         .then(() => {
//           console.log("Product from Cart Deleted");
//         })
//         .catch((err) => console.log(err));
//     }
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(String(this._id)),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         console.log("Order Added");
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(String(this._id)) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({
//         "user._id": new ObjectId(String(this._id)),
//       })
//       .toArray();
//   }
// }

// module.exports = User;

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Define relação 1:N, onde um Product pertence a um User e, se o User for deletado, seus Products também serão removidos.
// Relação 1:N: um Product pertence a um User (FK com CASCADE) e um User pode ter vários Products.
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// 'through' detalha onde a relação entre N:N vai estar criar que é CartItem
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem});


sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Bruno", email: "teste@teste.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

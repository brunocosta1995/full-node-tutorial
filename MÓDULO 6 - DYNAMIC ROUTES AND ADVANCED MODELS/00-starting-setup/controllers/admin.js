const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: null
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; //retorna a string do query parameter
  const prodId = req.params.productId;
  if (!editMode) {
    res.redirect('/');
  }
  Product.findById(prodId, product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/edit/edit-product',
      editing: editMode,
      product: product
    })

  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);  
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(prodId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);  
  Product.delete(prodId);
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

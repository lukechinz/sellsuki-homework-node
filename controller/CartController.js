const cartService = require('../service/CartService');

exports.createCart = async (products) => {
    try {
        if (products == undefined) {
            throw "have no product to select"
        }

        return cartService.createCart(products);
    } catch (err) {
        throw err;
    }
};
const axios = require('axios');
const config = require('../resources/config');

exports.createCart = async (products) => {
    try {
        let books = await getBookListFromAPI();

        let cartProduct = transformCartProduct(products, books);

        let promotionBooks = [];
        let nonPromotionBooks = [];

        cartProduct.forEach(product => {
            if (config.promotionBooks.includes(product.productId)) {
                promotionBooks.push(product);
            } else {
                nonPromotionBooks.push(product);
            }
        });

        let maxRound = Math.max(...promotionBooks.map(s => s.amount));

        let totalDiscountPrice = 0;
        let totalPrice = Number(nonPromotionBooks
            .map(item => item.price)
            .reduce((prev, next) => Number(prev) + Number(next)));

        for (let index = 0; index < maxRound; index++) {
            let sum = 0;
            let uniqueProductAmount = 0;

            promotionBooks
                .filter(book => book.amount > 0)
                .forEach(book => {
                    sum += Number(book.price);
                    book.amount = book.amount - 1;
                    uniqueProductAmount++;
                });

            let discountPercent = getPercentDiscount(uniqueProductAmount);

            totalPrice += sum;
            totalDiscountPrice += (sum * discountPercent / 100);
        }

        let result = {
            products: generateResponse(products, books),
            discount: totalDiscountPrice,
            net: totalPrice - totalDiscountPrice
        }

        return result;
    } catch (err) {
        throw err;
    }
};

function getPercentDiscount(uniqueProductAmount) {
    let percentDiscount = 0;
    switch (uniqueProductAmount) {
        case 2:
            percentDiscount = 10;
            break;
        case 3:
            percentDiscount = 11;
            break;
        case 4:
            percentDiscount = 12;
            break;
        case 5:
            percentDiscount = 13;
            break;
        case 6:
            percentDiscount = 14;
            break;
        case 7:
            percentDiscount = 15;
            break;
    }

    return percentDiscount;
}

function transformCartProduct(cartProducts, books) {
    let data = [];

    cartProducts.forEach(cartProduct => {
        const book = books.find(obj => obj.id == cartProduct.productId);

        if (book == undefined) {
            throw "Product not found";
        }

        data.push({
            productId: cartProduct.productId,
            amount: cartProduct.amount,
            price: book.price,
        });
    });

    return data;
}

function generateResponse(cartProducts, books) {
    let data = [];

    cartProducts.forEach(cartProduct => {
        const book = books.find(obj => obj.id == cartProduct.productId);

        data.push({
            productId: cartProduct.productId,
            title: book.title,
            amount: cartProduct.amount,
            price: book.price,
            totalPrice: Number(book.price) * cartProduct.amount
        });
    });

    return data;
}

async function getBookListFromAPI() {
    try {
        const response = await axios.get(config.endpoint.booklist).then(resp => resp.data);
        return response.books;
    } catch (error) {
        throw "Cannot get book data";
    }
}
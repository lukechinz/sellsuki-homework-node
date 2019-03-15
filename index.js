var app = require('express')();
const config = require('./resources/config');

var cartController = require('./controller/CartController');

app.use(require('body-parser').json());

app.post('/api/cart', async (req, res) => {
    try {
        let result = await cartController.createCart(req.body.products);

        res.json(result);
    } catch (err) {
        let result = {
            code: '500',
            message: err
        }

        res.status(500).json(result);
    }
});

var port = config.port;
app.listen(port, function () {
    console.log('Starting server on port ' + port);
});
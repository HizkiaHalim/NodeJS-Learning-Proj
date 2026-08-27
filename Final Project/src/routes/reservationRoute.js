const express = require('express');
const reservation = require('../controllers/reservationController');
const middleWare = require('../middlewares/reservationMiddlewares');

const router = express.Router();

router.get('/get-cart', middleWare.reservationMiddleware, reservation.GetCart);

router.post('/add-to-cart', middleWare.reservationMiddleware, reservation.AddToCart);

router.post('/remove-from-cart', middleWare.reservationMiddleware, reservation.RemoveFromCart);

router.put('/minus-from-cart', middleWare.reservationMiddleware, reservation.MinusFromCart);

router.post('/checkout', middleWare.reservationMiddleware, reservation.Checkout);

router.put('/update-status', middleWare.adminReservationMiddleware, reservation.UpdateReservationStatus);


module.exports = router;
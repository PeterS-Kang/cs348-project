const { getTickets, getUserPurchases, purchaseTicket, getAllPurchases } = require('../controllers/TicketsController');

const router = require('express').Router();

router.get('/', getTickets);

router.get('/purchases/:userID', getUserPurchases)

router.get('/all-purchases', getAllPurchases)

router.post('/buy-ticket', purchaseTicket)

module.exports = router
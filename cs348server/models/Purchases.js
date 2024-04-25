const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Purchases = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    event: {
        type: mongoose.Types.ObjectId,
        ref: 'Event'
    },
    ticket: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Ticket'
    }],
    purchase_date: {
        type: Date,
        required: true,
        default: new Date()
    }
})

const PurchasesModel = mongoose.model("Purchases", Purchases);

module.exports = PurchasesModel;
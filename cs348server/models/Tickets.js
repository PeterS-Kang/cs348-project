    const mongoose = require('mongoose');

    const Schema = mongoose.Schema;

    const Ticket = new Schema({
        event: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Event'
        },
        ticketNumber: {
            type: Number,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            default: null
        }
    })

    const TicketModel = mongoose.model("Ticket", Ticket);

    module.exports = TicketModel;
const mongoose = require('mongoose');
const Ticket = require('../models/Tickets')

const Schema = mongoose.Schema;

const Event = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    num_of_tickets: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
})

Event.index({price: 1})
Event.index({date: 1})

Event.pre('findOneAndDelete', async function(next) {
    try {
        console.log('bruhhh')
        const eventID = this.getQuery()._id
        console.log(eventID);
        const event = this.model.findById(eventID);
        if (event) {
            console.log("yaY");
            await Ticket.deleteMany({ event: eventID});
        }
        next()
    } catch (error) {
        next(error);
    }
})

const EventModel = mongoose.model("Event", Event);

module.exports = EventModel;
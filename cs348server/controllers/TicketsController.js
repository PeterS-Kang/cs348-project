const Ticket = require('../models/Tickets');
const User = require('../models/Users');
const Event = require('../models/Events')
const Purchase = require('../models/Purchases')

module.exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json({tickets: tickets});
    } catch (error) {
        console.log("Server error:",error);
        res.status(500).json({message: 'Server error'});
    }
}

module.exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.status(200).json({purchases: purchases});
    } catch (error) {
        console.log("Server error getAllPurchases")
        res.status(500).json({message: "Server error"})
    }
}

module.exports.getUserPurchases = async(req, res) => {
    try {
        const userID = req.params.userID;
        console.log(userID)
        const purchases = await Purchase.find({user: userID}).populate('ticket').populate('event');
        res.status(200).json({purchases: purchases})
    } catch (error) {
        console.log("Server error getUserPurchases")
        res.status(500).json({message: "Server error"})
    }
}

module.exports.purchaseTicket = async (req, res) => {
    try {
        const userID = req.body.userID;
        const eventID = req.body.eventID;

        const user = await User.findById(userID);
        const event = await Event.findById(eventID);

        if (!user) {
            console.log("User does not exist")
            return res.status(404).json({message: "User does not exist"})
        }

        if (!event) {
            console.log("Event does not exist")
            return res.status(404).json({message: "Event does not exist"})
        }

        const ticket = await Ticket.findOne({ event: eventID, user: null})
        
        if (ticket) {
            const purchase = await Purchase.findOne({user: userID, event: eventID});
            if (purchase) {
                purchase.ticket.push(ticket._id);
                await purchase.save();
            } else {
                const newPurchase = new Purchase({
                    user: userID,
                    event: eventID,
                    ticket: [ticket._id],
                });
    
                await newPurchase.save();
            }

            ticket.user = userID;
            await ticket.save();

            event.num_of_tickets--;
            event.save();

            return res.status(200).json({ticketPurchased: true})
        } else {
            res.status(404).json({message: "Ticket not found"})
        }


    } catch (error) {
        console.log("Server error:", error)
        res.status(500).json({message: "Server error"})
    }
}
const Event = require('../models/Events');
const User = require('../models/Users')
const Ticket = require('../models/Tickets');
const { default: mongoose } = require('mongoose');


// returns all events
module.exports.getEvents = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: "majority"
    })
    try {
        const events = await Event.find();

        await session.commitTransaction()
        session.endSession()

        res.status(200).json({events: events});
    } catch (error) {
        console.log("Server error getEvents:",error);
        res.status(500).json({message: 'Server error'});
    }
}

module.exports.filterEvents = async(req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: "majority"
    })
    try {
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const price = req.body.price
        console.log(startDate, endDate, price)
        
        if (startDate === "" && endDate === "" && price === "") {
            const events = await Event.find()

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json({events: events})
        }

        if ((startDate !== "" || endDate !== "") && price !== "") {
            if (price !== "max") {
                let dashIndex = price.indexOf("-");
                let startPrice = price.substring(0, dashIndex);
                let endPrice = price.substring(dashIndex + 1);
    
                console.log(startPrice, endPrice)
    
                let dateFilter = {}
                if (startDate) {
                    dateFilter.$gte = startDate
                }
    
                if (endDate) {
                    dateFilter.$lte = endDate
                }
    
                const events = await Event.find({
                    $and: [
                        { price: { $gte: startPrice, $lte: endPrice } },
                        { date: dateFilter }
                    ]
                });
    
                console.log(events)

                await session.commitTransaction()
                session.endSession()
    
                return res.status(200).json({events: events})
            }
            else {
                let dateFilter = {}
                if (startDate) {
                    dateFilter.$gte = startDate
                }
    
                if (endDate) {
                    dateFilter.$lte = endDate
                }
    
                const events = await Event.find({
                    $and: [
                        { price: { $gt: 200 } },
                        { date: dateFilter }
                    ]
                });
    
                console.log(events)

                await session.commitTransaction()
                session.endSession()
    
                return res.status(200).json({events: events})
            }
        }

        if (startDate === "" && endDate === "") {
            if (price !== "max") {
                let dashIndex = price.indexOf("-");
                let startPrice = price.substring(0, dashIndex);
                let endPrice = price.substring(dashIndex + 1);
    
                console.log(startPrice, endPrice)
                const events = await Event.find({
                    price: {
                        $gte: startPrice,
                        $lte: endPrice
                    }
                })

                await session.commitTransaction()
                session.endSession()
    
                return res.status(200).json({events: events})
            } else {
                const events = await Event.find({
                    price: {
                        $gt: 200
                    }
                })

                await session.commitTransaction()
                session.endSession()
    
                return res.status(200).json({events: events})
            }
        }

        if (price === "") {
            let dateFilter = {}
            if (startDate) {
                dateFilter.$gte = startDate
            }

            if (endDate) {
                dateFilter.$lte = endDate
            }

            const events = await Event.find({
                date: dateFilter
            })

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json({events: events})
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log("filter events err: ", error)
    }
}

module.exports.getUserEvents = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction({
        readConcern: {level: 'local'}
    })
    try {
        const userID = req.params.userID;
        const events = await Event.find({ organizer: userID})

        await session.commitTransaction()
        session.endSession()
        res.status(200).json({events: events});
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log("Server error getUserEvents:", error)
        res.status(500).json({message: "Server error"})
    }
}

// creates a new event
module.exports.createEvent = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: {level: 'snapshot'},
        writeConcern: {w: 'majority'}
    })
    try {
        const name = req.body.name;
        const description = req.body.description;
        const venue = req.body.venue;
        const date = req.body.date;
        const organizerID = req.body.organizerID;
        const tickets = Number(req.body.tickets);
        const price = req.body.price

        console.log("price:",price)
        

        const event = new Event({
            name: name,
            description: description,
            venue: venue,
            date: date,
            organizer: organizerID,
            num_of_tickets: tickets,
            price: Number(price)
        });

        await event.save();

        const allTickets = [];
        for (let i = 1; i <= tickets; i++) {
            const ticket = new Ticket({
                event: event._id,
                ticketNumber: i,
            });
            allTickets.push(ticket);
        }

        await Ticket.insertMany(allTickets);

        await session.commitTransaction()
        session.endSession()
    
        res.status(200).json({eventCreated: true, event: event});
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log("Server error createEvent:",error);
        res.status(500).json("Server error");
    }
}

// deletes an event
module.exports.deleteEvent = async(req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: {level: 'snapshot'},
        writeConcern: {w: 'majority'}
    })
    try {
        const eventID = req.body.eventID;
        const userID = req.body.userID;
        const event = await Event.findById(eventID);
        const user = await User.findById(userID);

        if (event && user) {
            if (user._id.toString() == event.organizer.toString()) {
                await Event.findByIdAndDelete(eventID);
                const events = await Event.find({ organizer: userID})

                await session.commitTransaction()
                session.endSession()  

                res.status(200).json({events: events});
            } else {
                console.log("User is not organizer of event");

                await session.abortTransaction()
                session.endSession()

                res.status(400).json({message: "User is not organizer of event"});
            }
        } else {
            console.log("Event or User not found");
            await session.abortTransaction()
            session.endSession()

            res.status(404).json({message: "Event or User not found"});
        }
    } catch (error) {
        console.log("Server error:",error);
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({message: "Server error"});
    }
}

// modify an event
module.exports.modifyEvent = async(req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction({
        readConcern: {level: 'snapshot'},
        writeConcern: {w: 'majority'}
    })
    try {
        const eventID = req.body.eventID;
        const userID = req.body.userID;
        const name = req.body.name;
        const description = req.body.description;
        const venue = req.body.venue;
        const date = req.body.date;
        const tickets = req.body.tickets;
        const price = req.body.price

        const event = await Event.findById(eventID);
        const user = await User.findById(userID);

        if (event && user) {
            if (event.organizer.toString() === user._id.toString()) {
                event.name = name;
                event.description = description;
                event.venue = venue;
                event.date = date;
                event.num_of_tickets = tickets;
                event.price = price;
                await event.save();
                console.log(event)

                await session.commitTransaction()
                session.endSession()     

                res.status(200).json({modifiedEvent: true, message: "event saved successfully"})
            } else {
                console.log("user is not organizer of event");

                await session.abortTransaction()
                session.endSession()

                res.status(400).json({message: "User is not organizer of event"})
            }
        } else {
            await session.abortTransaction()
            session.endSession()

            console.log("Event or user not found");
            res.status(404).json({message: "event or user not found"});
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        console.log("Server error:", error);
        res.status(500).json({message: "Server error"})
    }
}
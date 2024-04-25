const { getEvents, createEvent, deleteEvent, modifyEvent, getUserEvents, filterEvents } = require('../controllers/EventsController');

const router = require('express').Router();

// gets all events
router.get('/', getEvents);

router.get('/get-events/:userID', getUserEvents);

// creates an event
router.post('/create-event', createEvent);

// deletes an event
router.post('/delete-event', deleteEvent);

// modify an event
router.post('/modify-event', modifyEvent);

router.post('/filter-events', filterEvents)

module.exports = router;
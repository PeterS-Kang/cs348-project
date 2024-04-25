import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link for navigation
import '../App.css'; // Import CSS file for styling

const ModifyEventsPage = () => {
  // Define state variables for events and new event
  const location = useLocation();
  const {username, userID} = location.state
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', venue: '', num_of_tickets: '', price: '' });
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/events/get-events/${userID}`)
        .then((res) => {
            setEvents(res.data.events)
        })
        .catch((err) => {
            console.log(err)
        })
  }, [])
  // Function to handle input change for new event
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  // Function to add new event
  const handleAddEvent = () => {
    console.log(userID)
    if (newEvent.name && newEvent.date && newEvent.description && newEvent.venue && !isNaN(Number(newEvent.num_of_tickets)) && newEvent.num_of_tickets && newEvent.price && !isNaN(Number(newEvent.price))) {
        console.log(newEvent.price)
        axios.post('http://localhost:8000/events/create-event', {
            name: newEvent.name,
            description: newEvent.description,
            venue: newEvent.venue,
            date: newEvent.date,
            organizerID: userID,
            tickets: newEvent.num_of_tickets,
            price: newEvent.price
        })
        .then((res) => {
            console.log(res)
            if (res.data.eventCreated) {
                setEvents(prevEvents => [...prevEvents, res.data.event]);
                setNewEvent({ name: '', description:'', date: '', venue: '', num_of_tickets: '', price: '' });
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
  };

  // Function to delete event
  const handleDeleteEvent = (eventId) => {
    console.log("delete:",eventId)
    axios.post('http://localhost:8000/events/delete-event', {
        eventID: eventId,
        userID: userID
    })
        .then((res) => {
            console.log(res)
            setEvents(res.data.events)
        })
        .catch((err) => {
            console.log(err)
        })
  };

  // Function to start editing event
  const handleEditEvent = (eventId) => {
    setEditingEventId(eventId);
    const eventToEdit = events.find(event => event._id === eventId);
    setNewEvent(eventToEdit);
  };

  // Function to save edited event
  const handleSaveEditEvent = () => {
    axios.post('http://localhost:8000/events/modify-event', {
        eventID: newEvent._id,
        userID: userID,
        name: newEvent.name,
        description: newEvent.description,
        venue: newEvent.venue,
        date: newEvent.date,
        tickets: newEvent.num_of_tickets,
        price: newEvent.price
    })
        .then((res) => {
            if (res.data.modifiedEvent) {
                const updatedEvents = events.map(event => {
                    if (event._id === newEvent._id) {
                      return newEvent;
                    }
                    return event;
                  });
                  setEvents(updatedEvents);
                  setEditingEventId(null);
                  setNewEvent({ name: '', description: '', date: '', venue: '', num_of_tickets: '', price: '' });
            }
        })
        .catch((err) => {
            console.log(err)
        })
  };

  // Function to cancel editing event
  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setNewEvent({ name: '', description: '', date: '', venue: '', num_of_tickets: '', price: '' });
  };

  return (
    <div className="modify-events">
      <h1>Modify Events</h1>
      <Link to="/home" state={{username: username, userID: userID}}>
        <button className="back-button">Back to Home</button>
      </Link>
      {/* Form to add or edit event */}
      <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
        <input type="text" name="name" placeholder="Event Name" value={newEvent.name} onChange={handleNewEventChange} required />
        <input type="text" name="description" placeholder="Event Description" value={newEvent.description} onChange={handleNewEventChange} required />
        <input type="date" name="date" value={newEvent.date} onChange={handleNewEventChange} required />
        <input type="text" name="venue" placeholder="Venue/Location" value={newEvent.venue} onChange={handleNewEventChange} required />
        <input type="text" name="num_of_tickets" placeholder="Number of Tickets" value={newEvent.num_of_tickets} onChange={handleNewEventChange} required />
        <input type="text" name="price" placeholder="Price of Ticket" value={newEvent.price} onChange={handleNewEventChange} required />
        {editingEventId ?
          <>
            <button type="button" onClick={handleSaveEditEvent}>Save</button>
            <button type="button" onClick={handleCancelEditEvent}>Cancel</button>
          </>
          :
          <button type="submit">Add Event</button>
        }
      </form>

      {/* Display existing events */}
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <div>Event Name: {event.name}</div>
            <div>Event Description: {event.description}</div>
            <div>Event Date: {event.date}</div>
            <div>Event Venue: {event.venue}</div>
            <div>Number of tickets: {event.num_of_tickets}</div>
            <div>Price of ticket: {event.price}</div>
            {editingEventId === event._id ?
              <>
                <button onClick={handleSaveEditEvent}>Save</button>
                <button onClick={handleCancelEditEvent}>Cancel</button>
              </>
              :
              <>
                <button onClick={() => handleEditEvent(event._id)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModifyEventsPage;

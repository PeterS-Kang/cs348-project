import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link for navigation
import '../App.css'; // Import CSS file for styling

const Home = () => {
    const location = useLocation()
    const {username, userID} = location.state
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()

    const [events, setEvents] = useState([]);
    const [purchases, setPurchases] = useState([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [price, setPrice] = useState("")

    const filterEvents = () => {
      console.log("filter")
      // no start date but end date
      axios.post('http://localhost:8000/events/filter-events', {
        startDate: startDate,
        endDate: endDate,
        price: price
      })
        .then((res) => {
          console.log(res.data)
          setEvents(res.data.events)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const purchaseTicket = (eventID) => {
        axios.post('http://localhost:8000/tickets/buy-ticket', {
            userID: userID,
            eventID: eventID
        })
            .then((res) => {
                if (res.data.ticketPurchased) {
                    console.log("Ticket purchasd successfully")
                    setUpdate(false)
                }
                else {
                    console.log("Ticket purchase failed")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        setUpdate(true)
        axios.get('http://localhost:8000/events/')
            .then((res) => {
                setEvents(res.data.events)
            })
            .catch((err) => {
                console.log(err)
            })
    },[update])

    useEffect(() => {
        setUpdate(true)
        axios.get(`http://localhost:8000/tickets/purchases/${userID}`)
            .then((res) => {
                setPurchases(res.data.purchases)
                console.log(res.data.purchases[0].ticket.length) 
            })
            .catch((err) => {
                console.log(err)
            })
    }, [update])

    const handleLogout = () => {
        navigate('/')
        console.log('Logging out...');
        // You may want to redirect the user to the login page after logout
    };

  return (
    <div className="homepage">
      <header>
        <div className="user-info">
          <span>Welcome, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <h1>Welcome to EventMaster</h1>
        {/* Button to navigate to add event page */}
        <Link to="/editor" state={{username: username, userID: userID}}>
          <button className="add-event-btn">Modify Events</button>
        </Link>
      </header>
      <main>
        <section className="featured-events">
          <h2>Events</h2>
          <div className='filter-options'>
            {/* Filter by Date */}
            <label htmlFor="startDate">Start Date:</label>
      <input
        type="date"
        id="startDate"
        onChange={(e) => {
          const startDate = e.target.value;
          setStartDate(startDate);
        }}
      />
      <label htmlFor="endDate">End Date:</label>
      <input
        type="date"
        id="endDate"
        onChange={(e) => {
          const endDate = e.target.value;
          setEndDate(endDate);
        }}
      />

            {/* Filter by Price */}
            <label htmlFor="priceFilter">Filter by Price:</label>
            <select
              id="priceFilter"
              onChange={(e) => {
                // Handle filtering logic based on price
                const selectedPrice = e.target.value;
                console.log(selectedPrice)
                setPrice(selectedPrice)
                // Perform filtering based on selectedPrice
              }}
            >
              <option value="">All</option>
              <option value="0-50">$0 - $50</option>
              <option value="51-100">$51 - $100</option>
              <option value="101-150">$101 - $150</option>
              <option value="151-200">$151 - $200</option>
              <option value="max">$200 +</option>
              {/* Add more price ranges as needed */}
            </select>
            <button onClick={filterEvents}>Apply</button>
          </div>
          {/* Featured events can be displayed here */}
          <div className='event-display'>
          {
            events.map((event) => {
                return (
                    <div className="event-card">
                        <div className="event-info">
                            <h3>Name: {event.name}</h3>
                            <p>Description: {event.description}</p>
                            <p>Date: {event.date}</p>
                            <p>Venue: {event.venue}</p>
                            <p>Number of Tickets: {event.num_of_tickets}</p>
                            <p>Price of Ticket: {event.price}</p>
                            <button onClick={() => purchaseTicket(event._id)}>Purchase ticket</button>
                        </div>
                    </div>
                )
            })
          }
          </div>
        </section>
        <section className="search-events">
          <h2>My Purchases</h2>
          <div className='event-display'>
          {
            purchases.map((purchase) => {
                return (
                    <div className="event-card">
                        <div className="event-info">
                            <h3>Name: {purchase.event.name}</h3>
                            <p>Description: {purchase.event.description}</p>
                            <p>Date: {purchase.event.date}</p>
                            <p>Venue: {purchase.event.venue}</p>
                            <p>Number of tickets: {purchase.ticket.length}</p>
                        </div>
                    </div>
                )
            })
          }
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; cs348 project.</p>
      </footer>
    </div>
  );
}

export default Home;

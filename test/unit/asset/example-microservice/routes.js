const express = require('express');
const { Movie, Cinema, Seat, Ticket } = require('./models');
const router = express.Router();

// Movies CRUD
router.get('/movies', async (req, res) => {
    const movies = await Movie.findAll();
    res.json(movies);
});
router.post('/movies', async (req, res) => {
    const movie = await Movie.create(req.body);
    res.json(movie);
});

// Cinemas CRUD
router.get('/cinemas', async (req, res) => {
    const cinemas = await Cinema.findAll();
    res.json(cinemas);
});
router.post('/cinemas', async (req, res) => {
    const cinema = await Cinema.create(req.body);
    res.json(cinema);
});

// Seats CRUD
router.get('/seats', async (req, res) => {
    const seats = await Seat.findAll();
    res.json(seats);
});
router.post('/seats', async (req, res) => {
    const seat = await Seat.create(req.body);
    res.json(seat);
});

// Tickets CRUD
router.get('/tickets', async (req, res) => {
    const tickets = await Ticket.findAll();
    res.json(tickets);
});
router.post('/tickets', async (req, res) => {
    const ticket = await Ticket.create(req.body);
    res.json(ticket);
});

module.exports = router;

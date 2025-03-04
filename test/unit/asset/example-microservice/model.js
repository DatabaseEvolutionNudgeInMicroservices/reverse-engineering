const { DataTypes } = require('sequelize');
const sequelize = require('./config');

const Movie = sequelize.define('Movie', {
    title: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false } // durée en minutes
});

const Cinema = sequelize.define('Cinema', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false }
});

const Seat = sequelize.define('Seat', {
    row: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.INTEGER, allowNull: false }
});

const Ticket = sequelize.define('Ticket', {
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'booked', 'sold'), defaultValue: 'available' }
});

// Relations
Cinema.hasMany(Movie);
Movie.belongsTo(Cinema);

Movie.hasMany(Seat);
Seat.belongsTo(Movie);

Seat.hasOne(Ticket);
Ticket.belongsTo(Seat);

module.exports = { sequelize, Movie, Cinema, Seat, Ticket };

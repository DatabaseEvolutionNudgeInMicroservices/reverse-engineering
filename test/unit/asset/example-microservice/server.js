require('dotenv').config();
const express = require('express');
const sequelize = require('./config');
const routes = require('./routes');
const { sequelize: db } = require('./models');

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

db.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Error syncing database:', err));

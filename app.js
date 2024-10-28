const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const errorHandler = require('./middlewares/errorMiddleware');

const config = require('./config/config.json');
const db = require('./models');
const jobRoutes = require('./routes/jobRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');

const app = express();
const PORT = config.app.port;

app.use(express.json());

// Middleware
app.use(session({
    store: new pgSession({
        pool: pool,                // Connection pool
        tableName: 'sessions'      // Table name
    }),
    secret: 'your_session_secret', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

app.post('/api/mobile/login', MobileController.login);
app.post('/api/admin/login', AdminController.login);
app.post('/api/mobile/logout', MobileController.logout); // Logout for mobile
app.post('/api/admin/logout', AdminController.logout); // Logout for admin

app.use('/api', jobRoutes);
app.use('/api/', pharmacistRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler); // Ensure this is after all routes

module.exports = app;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to sync DB:', err.message);
});

export default app;
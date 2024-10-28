// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for My Microservice',
    },
    servers: [
      {
        url: 'http://localhost:70/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust based on where your route files are
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment API',
      version: '1.0.0',
      description: 'API for handling payments',
    },
    servers: [
      {
        url: 'https://portone.onrender.com/api/v1',
      },
    ],
  },
  apis: ['./Routes/*.js', './Controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
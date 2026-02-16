const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "Task management backend with authentication, caching, and dashboard analytics",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication routes" },
      { name: "Tasks", description: "Task management routes" },
      { name: "Dashboard", description: "Dashboard analytics" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;

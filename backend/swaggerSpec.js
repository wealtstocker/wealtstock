import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description: "API documentation for Finance platform",
    },
    servers: [
      {
        url: "http://localhost:8001/api", // change if using a different port
      },
    ],
  },
  apis: ["./routes/*.js"], // Swagger will scan these files for comments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

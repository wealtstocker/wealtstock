import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Matkabazar API",
      version: "1.0.0",
      description: "API documentation for Matkabazar platform",
    },
    servers: [
      {
        url: "http://localhost:1010/api", // change if using a different port
      },
    ],
  },
  apis: ["./routes/*.js"], // Swagger will scan these files for comments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

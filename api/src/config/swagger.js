import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Blog API",
      version: "1.0.0",
      description:
        "RESTful API documentation for the Web Blog application. This API provides endpoints for user authentication, blog management, and admin operations.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://ovardov99-web-blog-api.onrender.com"
            : "http://localhost:5000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Refresh token stored in HTTP-only cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            fullName: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Blog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Blog ID",
            },
            title: {
              type: "string",
              description: "Blog post title",
            },
            content: {
              type: "string",
              description: "Blog post content",
            },
            image: {
              type: "string",
              format: "uri",
              description: "Blog post image URL",
            },
            author: {
              $ref: "#/components/schemas/User",
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              description: "Blog post status",
            },
            likes: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs who liked the post",
            },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                  author: {
                    $ref: "#/components/schemas/User",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
            },
            pages: {
              type: "integer",
              description: "Total number of pages",
            },
            total: {
              type: "integer",
              description: "Total number of items",
            },
            limit: {
              type: "integer",
              description: "Items per page",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            details: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.js"], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

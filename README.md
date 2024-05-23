# MERN E-Commerce Application

This is a MERN (MongoDB, Express.js, React.js, Node.js) full-stack e-commerce application with authentication, checkout functionality, API design, validations, Zustand store, and responsive design.

## Features

- User authentication (signup, login, logout)
- Product listing, browsing, and searching
- Shopping cart functionality
- Checkout process with order summary
- API design for handling user authentication, products, and orders
- Form validations for user input
- Zustand store for managing global state
- Responsive design for mobile and desktop devices

## Live Demo

A live demo of the project is available [here](https://ecommerce-jgeu.vercel.app/login), allowing you to explore its features and functionalities.

## Technologies Used

- **Frontend**:
  - React.js
  - Zustand (for state management)
  - React Router DOM (for routing)
  - Axios (for HTTP requests)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (for database)
  - JSON Web Tokens (JWT) for authentication
  - Mongoose (for MongoDB object modeling)

## Installation

1. Clone the repository:

   `git clone https://github.com/yourusername/your-repo.git`

2. Navigate to the project directory:

    `cd your-repo`

3. Install dependencies for the frontend and backend:

    ```
    cd client
    npm install
    cd ../server
    npm install
    ```

4. Set up environment variables:

    - Create a .env file in the server directory.
    - Add MongoDB connection URI, JWT secret key, and other necessary environment variables.

5. Start the backend server:

    ```
    cd server
    npm start
    ```

6. Start the frontend development server:

    ```
    cd client
    npm start
    ```

## License

This project is licensed under the MIT License.

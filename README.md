# Bizcocho Commnader

This project is an Angular-based system that provides various functionalities for different types of users. Below is an overview of the system features:

## System Features

1. **Login and Registration:**
  - Authentication system to allow users to log in based on their roles.
  - Registration forms for CLIENTS.

2. **Product Management (ADMIN):**
  - A page to list all available products.
  - Forms to add, edit, and delete products.

3. **Product Catalog (CLIENTS):**
  - A page to view all available products.
  - Functionality to select products and add them to a shopping cart.
  - Functionality to interact with the shopping cart (Update quantities and set desired delivery date)
  - Functionality to place orders (within the shopping cart).
  - Functionality to cancel own orders not yet taken

4. **Order Management (BAKER):**
  - A page to list all pending orders for the baker to select.
  - A page to list all orders claimed by the baker.
  - Functionality to update the status of orders (pending, in preparation, ready for pickup).

5. **User Profile:**
  - Each user can access their profile to view personal data.
  - Functionality for CLIENTS to check their orders (within the user profile)

## Getting Started

### Prerequisites
- Node.js
- Angular CLI

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MatiasBelsterli/proyecto-ria
   ```
2. Navigate to the project directory:
   ```bash
   cd proyecto-ria
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash 
   npm start
   ```
2. Open your browser and navigate to `http://localhost:4200`.

### Contributing
- Fork the repository.
- Create a new branch (`git checkout -b feature/your-feature`).
- Commit your changes (`git commit -am 'Add some feature'`).
- Push to the branch (`git push origin feature/your-feature`).
- Open a pull request.

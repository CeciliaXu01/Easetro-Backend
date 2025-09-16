# Easetro Backend
This is the Github repository for **Easetro Backend**, which handles the server-side logic, database management, and API for the Easetro platform.

## Table of contents
- [Table of contents](#Tableofcontents)
- [Installation](#installation)
- Configuration
- Features

## Installation
To set up this project for local development, follow the steps below:
1. **Clone the repository**:
`git clone https://github.com/CeciliaXu01/Easetro-Backend.git`
2. **Navigate into the project directory**
`cd repository`
3. **Install the dependencies**
`npm install`
4. **Create a `.env` file in the root directory** to store environment variables such as credentials and secret keys.
See the example configuration below.
```
# General
NODE_ENV=''
APP_PORT=''

# Database Configuration
DB_USERNAME=''
DB_PASSWORD=''
DB_NAME=''
DB_HOST=''
DB_PORT=''

# JSON Web Token (JWT)
JWT_SECRET_KEY=''
JWT_EXPIRE_IN=''

# Admin Default
ADMIN_EMAIL=''
ADMIN_PASSWORD=''

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
```


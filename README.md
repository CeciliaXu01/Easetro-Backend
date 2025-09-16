# Easetro Backend
This is the Github repository for **Easetro Backend**, which handles the server-side logic, database management, and API for the Easetro platform.

## Table of Contents :bookmark_tabs:
- [Table of Contents](#table-of-contents-bookmark_tabs)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database](#database)
- [API Documentation](#api-documentation)

## Installation 
To install and set up this project, follow the steps below:
1. **Clone the repository**:
```
git clone https://github.com/CeciliaXu01/Easetro-Backend.git
```
2. **Navigate to the project directory**:
```
cd repository
```
3. **Install the dependencies**:
```
npm install
```
4. **Create a `.env` file in the root directory** to store environment variables such as credentials and secret keys.\
See the example configuration below.

## Environment Configuration
Add the following environment variables to your `.env` file:
```
# General
NODE_ENV=''                # e.g. 'development' or 'production'
APP_PORT=''                # e.g. 3000, 5000

# Database Configuration
DB_USERNAME=''             
DB_PASSWORD=''
DB_NAME=''
DB_HOST=''                 # e.g. 'localhost'
DB_PORT=''                 # e.g. 5432

# JSON Web Token (JWT)
JWT_SECRET_KEY=''
JWT_EXPIRE_IN=''           # e.g. 30d, 12h

# Admin Default (used for initial seeding)
ADMIN_EMAIL=''
ADMIN_PASSWORD=''

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
```
>[!NOTE]
> - This repository uses Cloudinary for image uploads.
> - To set it up, create a Cloudinary account at [cloudinary.com](https://cloudinary.com/) and generate your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
> - These credentials must be added to the `.env` file for the upload functionality to work.  

## Database 
This project uses **PostgreSQL** as its relational database to store and manage application data.

### ORM & Migrations
- **ORM**: [Sequelize](https://sequelize.org/)
- **Migrations**: [Sequelize CLI](https://sequelize.org/docs/v6/other-topics/migrations/)

### Relevant Folders
|Folder|Description|
| :---: | :---: |
|`/models`|Sequelize model definitions|
|`/migrations`|Database schema migration files|
|`/seeders`|Seed data for initial setup (development) or testing|

## API Documentation
API documentation is provided via a **Postman Collection** for easy integration and testing.\

[Postman Collection Link](https://www.postman.com/material-meteorologist-80258729/easetro-ta-xc/collection/peyonu8/easetro-backend?action=share&source=copy-link&creator=43378825)\
\
This Postman collection contains API endpoints configured to use a local server (e.g., `http://localhost:5000`).

> [!NOTE]  
> - The endpoints themselves are generic and can work with any deployment of this API.  
> - However, the URLs are currently set to your local environment.  
> - If you want to use this collection, please update the **Base URL** in Postman to point to your own deployed API URL.

You can import the Postman collection and modify the URLs as needed to test your own deployment.

**Base URL (local):** `http://localhost:5000`

> [!TIP] 
> Ensure your server is running locally before making requests with the default URLs.


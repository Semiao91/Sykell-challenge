# Sykell-challenge

project stack: https://excalidraw.com/#json=L2u0TKlXOkLGJRLeB6rHH,zJ7e_XJ6-clcsxeIqjSckQ

# Instructions

🚀 URL Analysis Dashboard

This project is a full-stack web application for crawling and analyzing URLs. It includes:

    A React (Vite) frontend

    A Go (Gin) backend API

    A MySQL database (via Docker)

⚙️ Prerequisites

Before running the project, make sure you have the following installed:

    Go (>= 1.18)

    Node.js (>= 18)

    Docker

📦 Getting Started
1. Clone the repository
```
git clone https://github.com/your-username/url-analysis-dashboard.git
cd url-analysis-dashboard
```
2. Start the MySQL database with Docker

docker-compose up -d

This will spin up a MySQL 8.0 database using the configuration in docker-compose.yml.
3. Set up and run the Go API
```
cd api
go mod tidy        # Install Go dependencies
go run main.go     # Run the Go server
```
The API should now be running at http://localhost:8080.

✅ Make sure you have a .env file in the root with your DB credentials. Example:
```
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=your_secret_key
```
4. Set up and run the React frontend
```
cd ../app
npm install       # or yarn
npm run dev       # Start the dev server
```
The frontend will run on http://localhost:5173.



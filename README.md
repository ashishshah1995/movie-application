# Movie Application

Build Web application that aggregates and compares movie prices from CinemaWorld and FilmWorld providers, showing the cheapest price available for each movie.

## Project Demo

https://screenrec.com/share/AmjYrcle0v

## Features

- Get movie lists from multiple providers
- Get detailed movie information with prices
- Compare prices across providers
- Resilient HTTP client implementation


## Technologies Used

### Backend (.NET 6)

- ASP.NET Core Web API
- Polly for resilience patterns
- Memory caching
- HttpClientFactory

## Frontend (React)

- React Hooks (useState, useEffect)
- Axios for API requests
- Bootstrap for UI components
- Responsive design

# Clone repository

git clone https://github.com/ashishshah1995/movie-app.git
cd movie-app

## Backend Setup

cd MovieCompareApp
dotnet restore
dotnet run

## Frontend

cd movie-app-frontend
npm install
npm start

## Configuration

1. Set your API token using one of these methods:

### Development (choose one):

- User Secrets:

  ```bash
  dotnet user-secrets init
  dotnet user-secrets set "WebjetApiToken" "your_token_here"

  export WebjetApiToken=your_token_here
  ```

## API Documentation

### Get Movies with Prices

GET /api/movies

### Response

[
{
"title": "Star Wars: Episode IV - A New Hope",
"year": "1977",
"providers": {
"cinemaworld": 123.50,
"filmworld": 29.50
},
"cheapestProvider": "filmworld",
"cheapestPrice": 29.50
}
]

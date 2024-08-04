# EV Charging Station Finder

![EV Charging Station Finder](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGh4dDhiN3dycG0ycmd6eWdjZW10c2p4dTBlZWhrOGxhbjdmcGhoOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7WtudzD9XpxXG/giphy.gif)

## Overview
EV Charging Station Finder is a web application designed to help electric vehicle owners find the best charging station near their current location. Utilizing real-time data and an intuitive map interface, this app ensures you never run out of charge when you need it most.
THIS REPO CONTAINS THE BACKEND APIS

## Features
- **Real-time Charging Station Data:** Get all available open data ev charging station currently active at url/getAll
- **Customizable Filters:** Get filtered open data ev charging station currently active at url/destinations?parameters
- **Well documented:** Get all available exposed APIs and examples at url/

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/paladinalessandro/OpenDataHackathon.git
    cd OpenDataHackathon
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Create and configure the `.env` file:**
    ```sh
    touch .env
    ```
    Add your `MAPS_API_KEY` to the `.env` file:
    ```env
    MAPS_API_KEY=your_google_maps_api_key
    ```

## Usage

1. **Start the development server:**
    ```sh
    npm run dev
    ```
    By default, the server runs on `PORT 3000` and `HOST 127.0.0.1`. You can change these by setting the `PORT` and `HOST` environment variables in your `.env` file.

2. **Build the project and launch on your enviroment:**
    ```sh
    npm run build
    ```
3. **When launched, navigate to :**
    ```Open your browser and go to http://HOST/ and take a look at the docs
    ```


## Scripts

- `npm install`: Installs the project dependencies.
- `npm run dev`: Starts the development server with `nodemon`.
- `npm run build`: Builds the project for production.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

## License
This project is licensed under the MIT License.
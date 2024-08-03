# EV Charging Station Finder

![EV Charging Station Finder](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmJ6dXV1Z2Z0a2Q2NGRxNGpqNXhkamR4dWZ0enRyenppaWZxNmo1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TF5s5UyioGUIcLK0vo/giphy.gif)

## Overview
EV Charging Station Finder is a web application designed to help electric vehicle owners find the best charging station near their current location. Utilizing real-time data and an intuitive map interface, this app ensures you never run out of charge when you need it most.

## Features
- **Real-time Charging Station Data:** Get up-to-date information on nearby charging stations.
- **Interactive Map:** Easily visualize and navigate to the nearest charging stations.
- **User-Friendly Interface:** Clean and simple design for a seamless user experience.
- **Customizable Settings:** Set your preferences for a more personalized experience.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/ev-charging-station-finder.git
    cd ev-charging-station-finder
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

2. **Build the project:**
    ```sh
    npm run build
    ```

## Scripts

- `npm install`: Installs the project dependencies.
- `npm run dev`: Starts the development server with `nodemon`.
- `npm run build`: Builds the project for production.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

## License
This project is licensed under the MIT License.
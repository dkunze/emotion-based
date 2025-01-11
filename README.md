# Emotion-Based Playlist Generator

A web application that detects user emotions using facial expressions and generates a playlist from Spotify matching the detected emotion.

---

## Features

- **Real-time Emotion Detection**: Uses a webcam and AI models to detect emotions like happiness, sadness, and neutrality.
- **Spotify Integration**: Fetches playlists from Spotify based on the detected emotion.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Interactive UI**: Modern and user-friendly interface with Material-UI components.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/dkunze/emotion-based
   cd emotion-based
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Models**

   - Download the required models for `face-api.js` from [here](https://github.com/justadudewhohacks/face-api.js-models).
   - Place the models in the `public/models` directory of your project.

4. **Set Up Backend**

   - Create a backend folder and implement an API [here](https://developer.spotify.com/) to fetch Spotify playlists using client credentials.
   - Use your Spotify API credentials in a `.env` file:

     ```plaintext
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     ```

5. **Run the Backend**

   Navigate to your backend folder and start the server:

   ```bash
   node server.js
   ```

6. **Run the Frontend**

   Start the React development server:

   ```bash
   npm start
   ```

---

## Usage

1. Open the application in your browser at `http://localhost:3000`.
2. Click **Start Camera** to enable your webcam.
3. Click **Detect Emotion** to analyze your facial expression and detect your emotion.
4. View the detected emotion and the suggested Spotify playlists.
5. Click **Stop Camera** to disable the webcam when done.

---

## Folder Structure

```
.
├── public/
│   ├── models/
│   │   ├── tiny_face_detector_model-weights_manifest.json
│   │   ├── tiny_face_detector_model-shard1
│   │   ├── face_expression_model-weights_manifest.json
│   │   ├── face_expression_model-shard1
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
├── backend/
│   ├── server.js
├── package.json
```

---

## Deployment

### Frontend

Deploy the frontend to services like:

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

### Backend

Deploy the backend to services like:

- [Heroku](https://www.heroku.com/)
- [Render](https://render.com/)

---

## Technologies Used

- **Frontend**: React, Material-UI, face-api.js
- **Backend**: Node.js, Express, Axios, Spotify Web API
- **Deployment**: Netlify/Vercel for frontend, Heroku/Render for backend

---

## Future Enhancements

- **Multiple Face Detection**: Support for detecting emotions from multiple users simultaneously.
- **Custom Playlists**: Allow users to create custom playlists based on multiple emotions.
- **Improved Models**: Use more accurate and diverse AI models for emotion detection.

---

## License

This project is licensed under the MIT License.


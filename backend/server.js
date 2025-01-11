const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())

let accessToken = null

// Function to get Spotify access token
const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    )

    accessToken = response.data.access_token
    console.log('Access token fetched successfully.')
  } catch (error) {
    console.error(
      'Error fetching Spotify access token:',
      error.response?.data || error.message
    )
  }
}

// Endpoint to get playlists based on emotion
app.get('/spotify-playlist', async (req, res) => {
  const { emotion } = req.query
  if (!accessToken) await getSpotifyAccessToken()

  if (!accessToken) {
    return res.status(500).send('Failed to get Spotify access token.')
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${emotion}&type=playlist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    res.json(response.data.playlists.items)
  } catch (error) {
    console.error(
      'Error fetching Spotify playlists:',
      error.response?.data || error.message
    )
    res.status(500).send('Error fetching Spotify playlists')
  }
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  getSpotifyAccessToken() // Fetch token on startup
})

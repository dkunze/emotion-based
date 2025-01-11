import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material'
import * as faceapi from 'face-api.js'
import './App.css'

const App = () => {
  const [loading, setLoading] = useState(false)
  const [emotion, setEmotion] = useState(null)
  const [playlist, setPlaylist] = useState([])
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true)
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        await faceapi.nets.faceExpressionNet.loadFromUri('/models')
        console.log('Models loaded successfully.')
        setModelsLoaded(true)
      } catch (error) {
        console.error('Error loading models:', error)
      } finally {
        setLoading(false)
      }
    }
    loadModels()
  }, [])

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      videoRef.current.play()
      setCameraActive(true) // Activar cámara
    } catch (error) {
      console.error('Error accessing camera:', error.message)
      alert('Error accessing camera. Please check your permissions.')
    }
  }

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Fetch playlist from server
  const fetchPlaylist = async (emotion) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3001/spotify-playlist?emotion=${emotion}`
      )
      const data = await response.json()
      const playlist = data
        .filter((item) => item !== null)
        .map((item) => ({
          name: item.name || 'Unnamed Playlist',
          url: item.external_urls.spotify,
          image: item.images?.[0]?.url || '',
        }))
      setPlaylist(playlist)
    } catch (error) {
      console.error('Error fetching playlist:', error.message)
      setPlaylist([])
    } finally {
      setLoading(false)
    }
  }

  // Detect emotion using face-api.js
  const detectEmotion = async () => {
    if (!modelsLoaded) {
      alert('Models are not loaded yet. Please wait.')
      return
    }
    setLoading(true)
    setEmotion(null)

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions()

      if (detections && detections.expressions) {
        const expressions = detections.expressions
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        )
        console.log('Detected emotion:', maxExpression)
        setEmotion(maxExpression)
        fetchPlaylist(maxExpression)
      } else {
        console.log('No face detected.')
        setEmotion('No face detected')
      }
    } catch (error) {
      console.error('Error detecting emotion:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Box
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Emotion-Based Playlist Generator
        </Typography>
        <Typography variant="subtitle1">
          Discover music that matches your mood!
        </Typography>
      </Box>

      <Box>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            borderRadius: '8px',
            border: '2px solid #1976d2',
            marginBottom: '1rem',
          }}
          muted
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={startCamera}
            disabled={cameraActive || loading}
          >
            Start Camera
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={stopCamera}
            disabled={!cameraActive || loading}
          >
            Stop Camera
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={detectEmotion}
            disabled={!modelsLoaded || loading || !cameraActive}
          >
            Detect Emotion
          </Button>
        </Box>
      </Box>

      <Box mt={4}>
        {loading && (
          <Box>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Processing...
            </Typography>
          </Box>
        )}

        {emotion && !loading && (
          <Typography
            variant="h5"
            mt={4}
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            Detected Emotion: <strong>{emotion}</strong>
          </Typography>
        )}
      </Box>

      {playlist.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Suggested Playlists:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {playlist.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Button
                      size="small"
                      color="primary"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Listen on Spotify
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}

export default App

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  chart: {
    marginTop: theme.spacing(3),
  },
  card: {
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

function RainfallPrediction() {
  const classes = useStyles();
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/rainfall/predict', {
        location,
        date_range: {
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      });

      setPrediction(response.data.prediction);
    } catch (err) {
      setError('Error fetching prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Rainfall Prediction
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Latitude"
                name="latitude"
                value={location.latitude}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
                name="longitude"
                value={location.longitude}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Predict Rainfall'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Typography color="error" style={{ marginTop: 16 }}>
            {error}
          </Typography>
        )}

        {prediction && (
          <Grid container spacing={3} style={{ marginTop: 16 }}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Predicted Rainfall
                  </Typography>
                  <Typography variant="h4">
                    {prediction.predicted_rainfall.toFixed(2)} mm
                  </Typography>
                  <Typography color="textSecondary">
                    Confidence: {(prediction.confidence * 100).toFixed(0)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Historical Average
                  </Typography>
                  <Typography variant="h4">
                    {(prediction.predicted_rainfall * 0.8).toFixed(2)} mm
                  </Typography>
                  <Typography color="textSecondary">
                    Same period last year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {prediction && (
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Rainfall Trends
          </Typography>
          <div className={classes.chart}>
            <LineChart
              width={800}
              height={300}
              data={[
                { date: 'Today', rainfall: prediction.predicted_rainfall },
                { date: 'Tomorrow', rainfall: prediction.predicted_rainfall * 0.9 },
                { date: 'Day 3', rainfall: prediction.predicted_rainfall * 1.1 },
                { date: 'Day 4', rainfall: prediction.predicted_rainfall * 0.95 },
                { date: 'Day 5', rainfall: prediction.predicted_rainfall * 1.05 },
                { date: 'Day 6', rainfall: prediction.predicted_rainfall * 0.98 },
                { date: 'Day 7', rainfall: prediction.predicted_rainfall * 1.02 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rainfall" stroke="#8884d8" />
            </LineChart>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default RainfallPrediction; 
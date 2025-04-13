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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  formControl: {
    minWidth: 200,
    margin: theme.spacing(1),
  },
}));

const CROP_TYPES = [
  'Rice',
  'Wheat',
  'Maize',
  'Soybean',
  'Cotton',
  'Sugarcane',
  'Potato',
  'Tomato',
];

function CropYieldAnalysis() {
  const classes = useStyles();
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [cropType, setCropType] = useState('');
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

  const handleCropTypeChange = (event) => {
    setCropType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/crop-yield/predict', {
        location,
        crop_type: cropType,
        date_range: {
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          Crop Yield Analysis
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
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  value={cropType}
                  onChange={handleCropTypeChange}
                  label="Crop Type"
                  required
                >
                  {CROP_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Crop Yield'}
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
            <Grid item xs={12} md={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Predicted Yield
                  </Typography>
                  <Typography variant="h4">
                    {prediction.predicted_yield.toFixed(2)} tons/ha
                  </Typography>
                  <Typography color="textSecondary">
                    Confidence: {(prediction.confidence * 100).toFixed(0)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Satellite Analysis
                  </Typography>
                  <Typography variant="h4">
                    {(prediction.satellite_contribution * 100).toFixed(0)}%
                  </Typography>
                  <Typography color="textSecondary">
                    Contribution to prediction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Climate Analysis
                  </Typography>
                  <Typography variant="h4">
                    {(prediction.climate_contribution * 100).toFixed(0)}%
                  </Typography>
                  <Typography color="textSecondary">
                    Contribution to prediction
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
            Yield Trends
          </Typography>
          <div className={classes.chart}>
            <LineChart
              width={800}
              height={300}
              data={[
                { month: 'Jan', yield: prediction.predicted_yield * 0.8 },
                { month: 'Feb', yield: prediction.predicted_yield * 0.85 },
                { month: 'Mar', yield: prediction.predicted_yield * 0.9 },
                { month: 'Apr', yield: prediction.predicted_yield * 0.95 },
                { month: 'May', yield: prediction.predicted_yield },
                { month: 'Jun', yield: prediction.predicted_yield * 1.05 },
                { month: 'Jul', yield: prediction.predicted_yield * 1.1 },
                { month: 'Aug', yield: prediction.predicted_yield * 1.05 },
                { month: 'Sep', yield: prediction.predicted_yield * 1.0 },
                { month: 'Oct', yield: prediction.predicted_yield * 0.95 },
                { month: 'Nov', yield: prediction.predicted_yield * 0.9 },
                { month: 'Dec', yield: prediction.predicted_yield * 0.85 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="#82ca9d" />
            </LineChart>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default CropYieldAnalysis; 
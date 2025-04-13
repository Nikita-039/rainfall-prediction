import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { format, subYears } from 'date-fns';

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
    height: 400,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function HistoricalData() {
  const classes = useStyles();
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [tabValue, setTabValue] = useState(0);
  const [rainfallData, setRainfallData] = useState([]);
  const [yieldData, setYieldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');

      const [rainfallResponse, yieldResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/rainfall/historical', {
          params: {
            location: JSON.stringify(location),
            start_date: startDate,
            end_date: endDate,
          },
        }),
        axios.get('http://localhost:5000/api/crop-yield/historical', {
          params: {
            location: JSON.stringify(location),
            start_date: startDate,
            end_date: endDate,
          },
        }),
      ]);

      setRainfallData(rainfallResponse.data.data);
      setYieldData(yieldResponse.data.data);
    } catch (err) {
      setError('Error fetching historical data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Historical Data Analysis
        </Typography>
        <form className={classes.form} onSubmit={(e) => { e.preventDefault(); fetchHistoricalData(); }}>
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
                {loading ? <CircularProgress size={24} /> : 'Fetch Historical Data'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Typography color="error" style={{ marginTop: 16 }}>
            {error}
          </Typography>
        )}

        {(rainfallData.length > 0 || yieldData.length > 0) && (
          <Box mt={3}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Rainfall Data" />
              <Tab label="Crop Yield Data" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <div className={classes.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={rainfallData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rainfall" stroke="#8884d8" name="Rainfall" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <div className={classes.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={yieldData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Yield (tons/ha)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="yield" stroke="#82ca9d" name="Crop Yield" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabPanel>
          </Box>
        )}
      </Paper>
    </div>
  );
}

export default HistoricalData; 
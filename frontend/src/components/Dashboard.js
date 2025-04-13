import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chart: {
    marginTop: theme.spacing(2),
  },
}));

function Dashboard() {
  const classes = useStyles();
  const [rainfallData, setRainfallData] = useState([]);
  const [cropYieldData, setCropYieldData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const [rainfallResponse, yieldResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/rainfall/historical'),
          axios.get('http://localhost:5000/api/crop-yield/historical')
        ]);

        setRainfallData(rainfallResponse.data.data);
        setCropYieldData(yieldResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rainfall Prediction
              </Typography>
              <Typography variant="h4">
                {rainfallData[rainfallData.length - 1]?.rainfall || 'N/A'} mm
              </Typography>
              <Typography color="textSecondary">
                Next 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Crop Health
              </Typography>
              <Typography variant="h4">
                85%
              </Typography>
              <Typography color="textSecondary">
                Current Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expected Yield
              </Typography>
              <Typography variant="h4">
                {cropYieldData[cropYieldData.length - 1]?.yield || 'N/A'} tons/ha
              </Typography>
              <Typography color="textSecondary">
                Current Season
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Rainfall Trends
            </Typography>
            <div className={classes.chart}>
              <LineChart
                width={800}
                height={300}
                data={rainfallData}
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
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Crop Yield Trends
            </Typography>
            <div className={classes.chart}>
              <LineChart
                width={800}
                height={300}
                data={cropYieldData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#82ca9d" />
              </LineChart>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 
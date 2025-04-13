import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

// Import components
import Dashboard from './components/Dashboard';
import RainfallPrediction from './components/RainfallPrediction';
import CropYieldAnalysis from './components/CropYieldAnalysis';
import HistoricalData from './components/HistoricalData';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green
    },
    secondary: {
      main: '#1976D2', // Blue
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                AI-Based Rainfall Prediction & Crop Yield Analysis
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Container component="main" className={classes.main}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/rainfall" component={RainfallPrediction} />
              <Route path="/crop-yield" component={CropYieldAnalysis} />
              <Route path="/historical" component={HistoricalData} />
            </Switch>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
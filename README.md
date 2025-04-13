# AI-Based Rainfall Prediction and Crop Yield Analysis

A full-stack application that leverages machine learning, remote sensing, and data analytics to predict rainfall and analyze crop yields using satellite imagery.

## Features

- Rainfall prediction using historical weather data and satellite imagery
- Crop health analysis and yield estimation
- Interactive dashboard for data visualization
- Real-time alerts and insights
- Historical data analysis

## Tech Stack

### Frontend
- React.js
- Recharts for data visualization
- Material-UI for components

### Backend
- Python Flask
- MongoDB
- TensorFlow/PyTorch for ML models
- Scikit-learn for traditional ML

### APIs & Data Sources
- Google Earth Engine
- India Meteorological Department (IMD)
- NASA
- FAO
- Sentinel-2/MODIS satellite data

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── models/         # ML models
│   │   ├── data/           # Data processing
│   │   ├── api/            # API endpoints
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json       # Node dependencies
└── README.md
```

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Endpoints

- `POST /api/rainfall/predict` - Predict rainfall for a given location
- `POST /api/crop-yield/predict` - Predict crop yield
- `GET /api/historical-data` - Get historical weather and yield data
- `POST /api/satellite/analyze` - Analyze satellite imagery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 
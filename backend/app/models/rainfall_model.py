import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

class RainfallPredictor:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler()
        self.sequence_length = 30  # Number of days to look back
        self.model_path = 'app/models/saved/rainfall_model.h5'
        self.scaler_path = 'app/models/saved/rainfall_scaler.pkl'
        
        # Load or create model
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.load_model()
        else:
            self.create_model()
    
    def create_model(self):
        self.model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(self.sequence_length, 1)),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')
    
    def load_model(self):
        self.model = tf.keras.models.load_model(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
    
    def save_model(self):
        self.model.save(self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
    
    def prepare_data(self, data):
        # Normalize the data
        scaled_data = self.scaler.fit_transform(data.reshape(-1, 1))
        
        # Create sequences
        X, y = [], []
        for i in range(len(scaled_data) - self.sequence_length):
            X.append(scaled_data[i:(i + self.sequence_length)])
            y.append(scaled_data[i + self.sequence_length])
        
        return np.array(X), np.array(y)
    
    def train(self, historical_data):
        """
        Train the model with historical rainfall data
        Args:
            historical_data: pandas DataFrame with 'date' and 'rainfall' columns
        """
        # Prepare data
        X, y = self.prepare_data(historical_data['rainfall'].values)
        
        # Train the model
        self.model.fit(X, y, epochs=50, batch_size=32, validation_split=0.2)
        
        # Save the trained model
        self.save_model()
    
    def predict(self, location, date_range):
        """
        Predict rainfall for a given location and date range
        Args:
            location: dict with 'latitude' and 'longitude'
            date_range: dict with 'start_date' and 'end_date'
        Returns:
            dict with predicted rainfall values
        """
        # TODO: Fetch historical data for the location
        # For now, using dummy data
        last_sequence = np.random.rand(self.sequence_length, 1)
        
        # Make prediction
        prediction = self.model.predict(last_sequence.reshape(1, self.sequence_length, 1))
        prediction = self.scaler.inverse_transform(prediction)
        
        return {
            'predicted_rainfall': float(prediction[0][0]),
            'confidence': 0.85  # Example confidence score
        }
    
    def get_historical_data(self, location, start_date, end_date):
        """
        Get historical rainfall data for a location
        Args:
            location: dict with 'latitude' and 'longitude'
            start_date: string in YYYY-MM-DD format
            end_date: string in YYYY-MM-DD format
        Returns:
            dict with historical rainfall data
        """
        # TODO: Implement actual data fetching from IMD/NOAA
        # For now, returning dummy data
        dates = pd.date_range(start=start_date, end=end_date)
        rainfall = np.random.uniform(0, 100, len(dates))
        
        return {
            'dates': dates.strftime('%Y-%m-%d').tolist(),
            'rainfall': rainfall.tolist()
        } 
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class CropYieldPredictor:
    def __init__(self):
        self.cnn_model = None
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.model_path = 'app/models/saved/crop_yield_model.h5'
        self.rf_path = 'app/models/saved/crop_yield_rf.pkl'
        self.scaler_path = 'app/models/saved/crop_yield_scaler.pkl'
        
        # Load or create models
        if all(os.path.exists(path) for path in [self.model_path, self.rf_path, self.scaler_path]):
            self.load_models()
        else:
            self.create_models()
    
    def create_models(self):
        # Create CNN model for satellite imagery
        self.cnn_model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation='relu'),
            Flatten(),
            Dense(64, activation='relu'),
            Dropout(0.5),
            Dense(1)
        ])
        self.cnn_model.compile(optimizer='adam', loss='mse')
    
    def load_models(self):
        self.cnn_model = tf.keras.models.load_model(self.model_path)
        self.rf_model = joblib.load(self.rf_path)
        self.scaler = joblib.load(self.scaler_path)
    
    def save_models(self):
        self.cnn_model.save(self.model_path)
        joblib.dump(self.rf_model, self.rf_path)
        joblib.dump(self.scaler, self.scaler_path)
    
    def train(self, satellite_data, climate_data, yield_data):
        """
        Train both CNN and Random Forest models
        Args:
            satellite_data: numpy array of satellite images
            climate_data: pandas DataFrame with climate features
            yield_data: numpy array of actual crop yields
        """
        # Train CNN on satellite data
        self.cnn_model.fit(
            satellite_data,
            yield_data,
            epochs=50,
            batch_size=32,
            validation_split=0.2
        )
        
        # Train Random Forest on climate data
        climate_features = self.scaler.fit_transform(climate_data)
        self.rf_model.fit(climate_features, yield_data)
        
        # Save trained models
        self.save_models()
    
    def predict(self, location, crop_type, date_range):
        """
        Predict crop yield for a given location, crop type, and date range
        Args:
            location: dict with 'latitude' and 'longitude'
            crop_type: string indicating crop type
            date_range: dict with 'start_date' and 'end_date'
        Returns:
            dict with predicted yield and confidence scores
        """
        # TODO: Implement actual data fetching and processing
        # For now, using dummy data
        satellite_features = np.random.rand(1, 64, 64, 3)
        climate_features = np.random.rand(1, 10)
        
        # Make predictions
        cnn_prediction = self.cnn_model.predict(satellite_features)
        rf_prediction = self.rf_model.predict(self.scaler.transform(climate_features))
        
        # Combine predictions (simple average for now)
        final_prediction = (cnn_prediction[0][0] + rf_prediction[0]) / 2
        
        return {
            'predicted_yield': float(final_prediction),
            'confidence': 0.90,  # Example confidence score
            'satellite_contribution': float(cnn_prediction[0][0]),
            'climate_contribution': float(rf_prediction[0])
        }
    
    def get_crop_health(self, satellite_image):
        """
        Analyze crop health from satellite imagery
        Args:
            satellite_image: numpy array of satellite image
        Returns:
            dict with health metrics
        """
        # TODO: Implement actual health analysis
        # For now, returning dummy metrics
        return {
            'ndvi': 0.75,  # Normalized Difference Vegetation Index
            'evi': 0.65,   # Enhanced Vegetation Index
            'health_score': 0.85,
            'stress_level': 'low'
        } 
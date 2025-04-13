from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/rainfall_prediction')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Import routes
from app.api.routes import rainfall_bp, crop_yield_bp, satellite_bp

# Register blueprints
app.register_blueprint(rainfall_bp, url_prefix='/api/rainfall')
app.register_blueprint(crop_yield_bp, url_prefix='/api/crop-yield')
app.register_blueprint(satellite_bp, url_prefix='/api/satellite')

@app.route('/')
def index():
    return jsonify({
        'status': 'success',
        'message': 'Rainfall Prediction and Crop Yield Analysis API'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 
from flask import Blueprint, request, jsonify
from app.models.rainfall_model import RainfallPredictor
from app.models.crop_yield_model import CropYieldPredictor
from app.utils.satellite_processor import SatelliteProcessor

# Initialize blueprints
rainfall_bp = Blueprint('rainfall', __name__)
crop_yield_bp = Blueprint('crop_yield', __name__)
satellite_bp = Blueprint('satellite', __name__)

# Initialize models
rainfall_predictor = RainfallPredictor()
crop_yield_predictor = CropYieldPredictor()
satellite_processor = SatelliteProcessor()

@rainfall_bp.route('/predict', methods=['POST'])
def predict_rainfall():
    try:
        data = request.get_json()
        location = data.get('location')
        date_range = data.get('date_range')
        
        if not location or not date_range:
            return jsonify({'error': 'Missing required parameters'}), 400
            
        prediction = rainfall_predictor.predict(location, date_range)
        return jsonify({
            'status': 'success',
            'prediction': prediction
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@crop_yield_bp.route('/predict', methods=['POST'])
def predict_crop_yield():
    try:
        data = request.get_json()
        location = data.get('location')
        crop_type = data.get('crop_type')
        date_range = data.get('date_range')
        
        if not all([location, crop_type, date_range]):
            return jsonify({'error': 'Missing required parameters'}), 400
            
        prediction = crop_yield_predictor.predict(location, crop_type, date_range)
        return jsonify({
            'status': 'success',
            'prediction': prediction
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@satellite_bp.route('/analyze', methods=['POST'])
def analyze_satellite_imagery():
    try:
        data = request.get_json()
        location = data.get('location')
        date = data.get('date')
        
        if not location or not date:
            return jsonify({'error': 'Missing required parameters'}), 400
            
        analysis = satellite_processor.analyze(location, date)
        return jsonify({
            'status': 'success',
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rainfall_bp.route('/historical', methods=['GET'])
def get_historical_rainfall():
    try:
        location = request.args.get('location')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not all([location, start_date, end_date]):
            return jsonify({'error': 'Missing required parameters'}), 400
            
        historical_data = rainfall_predictor.get_historical_data(location, start_date, end_date)
        return jsonify({
            'status': 'success',
            'data': historical_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
"""
Flask API server for ML anomaly detection
Render-safe version (no startup crashes)
"""

print("🚀 ML SERVICE BOOTING...")

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Lazy ML loader (prevents startup crash)
# --------------------------------------------------
detector = None
detector_error = None

def load_detector():
    global detector, detector_error
    if detector is None and detector_error is None:
        try:
            print("🧠 Loading anomaly detector...")
            import anomaly_detector  # IMPORT ONLY WHEN NEEDED
            detector = anomaly_detector
            print("✅ Anomaly detector loaded")
        except Exception as e:
            detector_error = str(e)
            print("❌ Failed to load model:", detector_error)
    return detector

# --------------------------------------------------
# Health check (Render depends on this)
# --------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    load_detector()
    return jsonify({
        "status": "healthy",
        "service": "ml-anomaly-detection",
        "model_loaded": detector is not None,
        "model_error": detector_error
    })

# --------------------------------------------------
# Train model
# --------------------------------------------------
@app.route("/train", methods=["POST"])
def train():
    load_detector()
    if detector is None:
        return jsonify({"error": "Model not loaded", "details": detector_error}), 500

    data = request.get_json() or {}
    training_data = data.get("training_data", [])

    if len(training_data) < 10:
        return jsonify({"error": "Need at least 10 samples"}), 400

    try:
        result = detector.train_model(training_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# Predict single
# --------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    load_detector()
    if detector is None:
        return jsonify({"error": "Model not loaded", "details": detector_error}), 500

    data = request.get_json() or {}
    features = data.get("features", {})

    try:
        result = detector.predict_anomaly(features)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# Predict batch
# --------------------------------------------------
@app.route("/predict-batch", methods=["POST"])
def predict_batch():
    load_detector()
    if detector is None:
        return jsonify({"error": "Model not loaded", "details": detector_error}), 500

    data = request.get_json() or {}
    features_list = data.get("features_list", [])

    try:
        results = detector.predict_anomaly_batch(features_list)
        return jsonify({
            "predictions": results,
            "count": len(results)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# Model info
# --------------------------------------------------
@app.route("/model-info", methods=["GET"])
def model_info():
    load_detector()
    return jsonify({
        "model": "Isolation Forest",
        "loaded": detector is not None,
        "error": detector_error
    })

# --------------------------------------------------
# START SERVER (RENDER COMPATIBLE)
# --------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))  # 🔥 MUST USE PORT
    print(f"✅ Flask starting on port {port}")
    app.run(host="0.0.0.0", port=port)
# """
# Flask API server for ML anomaly detection
# Provides endpoints for training and prediction
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import anomaly_detector
# import os
# from dotenv import load_dotenv

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# @app.route('/health', methods=['GET'])
# def health():
#     """Health check endpoint"""
#     return jsonify({
#         'status': 'healthy',
#         'service': 'ml-anomaly-detection',
#         'model_loaded': anomaly_detector.detector.model is not None
#     })

# @app.route('/train', methods=['POST'])
# def train():
#     """
#     Train the model with new data
#     POST body: { "training_data": [...] }
#     """
#     try:
#         data = request.get_json()
#         training_data = data.get('training_data', [])
        
#         if len(training_data) < 10:
#             return jsonify({
#                 'error': 'Need at least 10 samples to train'
#             }), 400
        
#         result = anomaly_detector.train_model(training_data)
#         return jsonify(result)
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/predict', methods=['POST'])
# def predict():
#     """
#     Predict anomaly for single feature set
#     POST body: { "features": {...} }
#     """
#     try:
#         data = request.get_json()
#         features = data.get('features', {})
        
#         result = anomaly_detector.predict_anomaly(features)
#         return jsonify(result)
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/predict-batch', methods=['POST'])
# def predict_batch():
#     """
#     Predict anomalies for multiple feature sets
#     POST body: { "features_list": [{...}, {...}] }
#     """
#     try:
#         data = request.get_json()
#         features_list = data.get('features_list', [])
        
#         results = anomaly_detector.predict_anomaly_batch(features_list)
#         return jsonify({
#             'predictions': results,
#             'count': len(results)
#         })
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/model-info', methods=['GET'])
# def model_info():
#     """Get model information"""
#     return jsonify({
#         'features': anomaly_detector.detector.feature_names,
#         'model_type': 'Isolation Forest',
#         'risk_thresholds': {
#             'low': '< 0.5 (Allow)',
#             'medium': '0.5-0.8 (Monitor)',
#             'high': '> 0.8 (Throttle + Alert)',
#             'critical': '> 0.9 (Temporary Block)'
#         }
#     })

# if __name__ == '__main__':
#     port = int(os.getenv('ML_SERVICE_PORT', 5001))
#     print(f"🤖 ML Service starting on port {port}...")
#     print(f"🧠 Model: Isolation Forest")
#     print(f"📊 Features: {', '.join(anomaly_detector.detector.feature_names)}")
#     app.run(host='0.0.0.0', port=port, debug=True)

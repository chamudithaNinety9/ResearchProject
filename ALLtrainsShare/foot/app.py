import cv2 as cv
import numpy as np 
import tensorflow as tf
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

class_dict_defect_footprint = {
                    'fox': 0, 
                    'leopard': 1,
                    'wildboar': 2
                    }

class_dict_defect_rev_footprint = {
                        0: 'fox',
                        1: 'leopard',
                        2: 'wildboar'
                        }

footprint_model_defects = tf.keras.models.load_model('models/footprintNew-detector.h5')

def footprint_inference_model(img_path, target_size=(224, 224)):
    img = cv.imread(img_path)
    img = cv.resize(img, target_size)
    img = tf.keras.applications.xception.preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    pred_probs = footprint_model_defects.predict(img).squeeze()
    for class_idx, prob in enumerate(pred_probs):
        class_name = class_dict_defect_rev_footprint[class_idx]
        print(f"Probability for class '{class_name}': {prob:.4f}")
    predicted_class_index = np.argmax(pred_probs)

    if pred_probs[predicted_class_index] > 0.5:
        predicted_class = class_dict_defect_rev_footprint[predicted_class_index]
        return predicted_class
    else:
        return "No defect found"


@app.route('/footprint', methods=['POST'])
def defects():
    if request.method == 'POST':
        data = request.files
        image = data['image']
        
        filename = f"uploads/{image.filename}"
        image.save(filename)

        result = footprint_inference_model(filename)
        return jsonify({
                        "status": "success",
                        "defectiveness": result,
                        }), 200
    
    return jsonify({
                    "status": "unsuccess",
                    "defectiveness": None,
                    }), 400



if __name__ == '__main__':
    app.run(debug=True)
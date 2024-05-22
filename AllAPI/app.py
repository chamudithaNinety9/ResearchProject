import pandas as pd
from flask import Flask, request, jsonify
import joblib
import cv2 as cv
import numpy as np 
import tensorflow as tf
from flask_cors import CORS
import os,json

# initiate the flask app
app = Flask(__name__)
CORS(app)

# load trained modles
bath_safety_model = joblib.load('bath_safety_model.pkl')
tent_safety_model = joblib.load('tent_safety_model.pkl')

bath_safety_feature_names = ['type','waterflow','waterclarity','wildlife','humanfootprints','terraintype']

tent_safety_feature_names = ['Soil_condition' ,'Features_of_the_land','Insect_activity','surrounding_trees','Animal_habitats' ,'surrounding_terrain','Weather_Condition','Wind_Speed','Precipitation']

class_dict_defect_rev_mushroom = {

                    0: 'amanita_muscaria', 
                    1: 'gyromitra_esculenta',
                    2: 'gyromitra_gigas',
                    3:'gyromitra_infula', 
                    4:'oyster_mushroom',
                    5:'puffball_mushroom', 
                    6:'qmanita_pantherina',
                    7:'schizophyllum_commune',
                    8:'trametes_hirsuta', 
                    9:'trametes_ochracea',
                    10:'trametes_versicolor'
                        }




mushroom_model_defects = tf.keras.models.load_model('models/mushrooms-detector.h5')

class_dict_defect_rev_footprint = {0: 'fox', 1: 'leopard', 2: 'wildboar'}

footprint_model_defects = tf.keras.models.load_model('models/footprintNew-detector.h5')

def inference_model_mushroom(
                    img_path,
                    target_size = (224, 224)
                    ):
    img = cv.imread(img_path)
    img = cv.resize(img, target_size)
    img = tf.keras.applications.xception.preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    pred = mushroom_model_defects.predict(img)
    pred = pred.squeeze() > 0.5
    pred = pred.squeeze()
    return class_dict_defect_rev_mushroom[int(pred)]

def preprocess_image(img_path, target_size=(224, 224)):
    try:
        img = cv.imread(img_path)
        img = cv.resize(img, target_size)
        img = tf.keras.applications.xception.preprocess_input(img)
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def convert_to_percentage(prob):
    return round(float(prob) * 100, 1)  # Convert to percentage with 1 decimal place

def convert_dict_to_percentage(dictionary):
    return {k: f"{convert_to_percentage(v)}%" for k, v in dictionary.items()}

def footprint_inference_model(img_path):
    try:
        img = preprocess_image(img_path)
        if img is None:
            return "Invalid image", None

        predictions = [footprint_model_defects.predict(img).squeeze() for _ in range(10)]
        avg_pred = np.mean(predictions, axis=0)
        index = np.argmax(avg_pred)

        class_probabilities = {class_dict_defect_rev_footprint[i]: avg_pred[i] for i in range(len(avg_pred))}
        print("Class Probabilities:", class_probabilities)

        result = class_dict_defect_rev_footprint[index]
        probability = convert_to_percentage(avg_pred[index])
        class_probabilities = {k: v for k, v in class_probabilities.items()}

        sum_rest_probabilities = sum(class_probabilities.values())
        if sum_rest_probabilities > 120:
            return "Error during inference", None 

        return "Success", {"defectiveness": result, "probability": f"{probability}%"
                           , "restProbabilities":  convert_dict_to_percentage({k: v for k, v in class_probabilities.items() if k != class_dict_defect_rev_footprint[np.argmax(avg_pred)]})}

    except Exception as e:
        print(f"Error during inference: {e}")
        return "Error during inference", None

@app.route('/bathSafety', methods=['POST'])
def predict_bath_safety_rating():
    try:
        
        incoming_predictions = request.get_json() # gets user data as json
        user_data = incoming_predictions
        user_input = [
            int(user_data['type']),
            int(user_data['waterflow']),
            int(user_data['waterclarity']),
            int(user_data['wildlife']),
            int(user_data['humanfootprints']),
            int(user_data['terraintype'])]
        
        # prepare data for predictions creating a dataframe
        X = pd.DataFrame([user_input], columns=bath_safety_feature_names)
        user_array = X.values

        # get predictions from loaded model above
        prediction = bath_safety_model.predict(user_array)[0] 
        ratings_mapping = {1: "Excellent", 2: "Good", 3: "Fair", 4: "Poor"}
        safety_rating = ratings_mapping[prediction]
        response = {  # returns the prediction
            "Safety_Rating": safety_rating  
        }  
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/tentSafety', methods=['POST'])
def predict_tent_safety_rating():

    try:
        
        incoming_predictions = request.get_json()
        user_data = incoming_predictions
        user_input = [
            int(user_data['Soil_condition']),
            int(user_data['Features_of_the_land']),
            int(user_data['Insect_activity']),
            int(user_data['surrounding_trees']),
            int(user_data['Animal_habitats']),
            int(user_data['surrounding_terrain']),
            int(user_data['Weather_Condition']),
            int(user_data['Wind_Speed']),
            int(user_data['Precipitation'])]
        
        user_df = pd.DataFrame([user_input], columns=tent_safety_feature_names)
        user_array = user_df.values

        prediction = tent_safety_model.predict(user_array)[0]
        ratings_mapping = {1: "Excellent", 2: "Good", 3: "Fair", 4: "Poor"}
        safety_rating = ratings_mapping[prediction]
        response = {
            "Safety_Rating": safety_rating
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/mushroom', methods=['POST'])
def mushroom_defects():
    if request.method == 'POST':
        data = request.files
        image = data['image']
        
        filename = f"mushrooms/{image.filename}"
        image.save(filename)

        result = inference_model_mushroom(filename)
        if result == "oyster_mushroom" or result == "puffball_mushroom" or result == "schizophyllum_commune" or result == "trametes_hirsuta"or result == "trametes_ochracea" or result == "trametes_versicolor":
            edibility = "Edible"
        else:
            edibility = "Poisonous"

        return jsonify({
                        "status": "success",
                        "defectiveness": result,
                        "edibility":edibility
                        }), 200
    
    return jsonify({
                    "status": "unsuccess",
                    "defectiveness": None,
                    "eligibility":None
                    }), 400

@app.route('/footprint', methods=['POST'])
def defects():
    if request.method == 'POST':
        try:
            data = request.files
            if 'image' not in data:
                return jsonify({"status": "unsuccess", "defectiveness": None, "error": "No 'image' in files"}), 400

            image = data['image']
            if not image or image.filename == '':
                return jsonify({"status": "unsuccess", "defectiveness": None, "error": "No selected file"}), 400

            filename = os.path.join("footprint", image.filename)
            image.save(filename)

            status, result = footprint_inference_model(filename)
            result_json = json.dumps(result)

            return jsonify({"status": status, "result": json.loads(result_json)}), 200

        except Exception as e:
            return jsonify({"status": "unsuccess", "defectiveness": None, "error": str(e)}), 500

    return jsonify({"status": "unsuccess", "defectiveness": None, "error": "Invalid request method"}), 400

if __name__ == '__main__':
    app.run()
from flask import Flask, render_template, request, jsonify
from transformers import pipeline
from PIL import Image
import io

def predict_deepfake_from_file(images):
    # Initialize the image classification pipeline
    pipe = pipeline("image-classification", model=r"models/My_Model")
    
    img=images
    predictions = pipe(images=img)

    # Access and return the prediction results
    if len(predictions) > 0:  
        # Check if predictions were made (e.g., valid image format)
        predicted_class = predictions[0]["label"]  # Assuming the label is in the 0th index
        predicted_score = predictions[0]["score"]  # Assuming the score is in the 0th index (confidence)
        return predicted_class, predicted_score, 200
    else:
        return 'Prediction error', None, 400  # Return None if no predictions were made
  
app = Flask(__name__)
 
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' in request.files:
        image_file = request.files['image']
        
        image_file.save('uploaded_image.jpg')
        predicted_class, predicted_score, status_code = predict_deepfake_from_file('uploaded_image.jpg')
        
        if status_code == 200:
            return jsonify({'predicted_class': predicted_class, 'predicted_score': predicted_score}), status_code
        else:
            return jsonify({'error': predicted_class}), status_code
    else:
        return 'No image uploaded', 400

if __name__ == '__main__':
    app.run(debug=False)

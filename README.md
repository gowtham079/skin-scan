# Skin Scan: AI-Powered Lesion Classifier

**Skin Scan** provides a reliable, fast, and user-friendly platform for detecting and analyzing skin lesions. The system integrates state-of-the-art machine learning techniques to deliver accurate results, helping users with limited knowledge about skin conditions and assisting medical professionals in their diagnostic workflows.

## Key Features

- ### Local Processing
  Ensures privacy by processing all images locally, without uploading them to external servers.

- ### Comprehensive Classification
  Classifies skin lesions into seven categories using a custom-trained MobileNet model.

- ### User-Friendly Interface
  Easy-to-use frontend built with HTML, CSS, and JavaScript, integrated with TensorFlow.js for browser-based inference.

- ### Visual Feedback
  Utilizes Chart.js for interactive visualizations of prediction probabilities.

- ### Rapid Analysis
  Provides results within three seconds, significantly faster than traditional diagnostic methods.

## System Architecture

### Data Ingestion & Preparation

- **Data Loading:** Loads images and CSV files containing lesion metadata.
- **Data Augmentation:** Applies rotations, flips, and scaling to enhance the dataset.

### Data Storage

- **Training Set:** Organized into folders by lesion categories for efficient training.
- **Validation Set:** Similarly organized for performance evaluation.

### Model Architecture

- **Base Model:** MobileNet used as a feature extractor.
- **Custom Classification Head:** A Dense layer for predicting seven lesion categories.

### Training & Evaluation

- **Data Generators:** Efficiently handle training and validation with real-time augmentation.
- **Training Process:** Includes hyperparameter tuning, early stopping, and evaluation metrics such as accuracy and confusion matrix.

### Model Deployment

- **Saved Model:** Artifacts include model weights and architecture for deployment.
- **Integration:** Backend modules for analysis and frontend interface for user interaction.

## Tools Used

- **Backend:** Python, TensorFlow
- **Frontend:** HTML, CSS, JavaScript, TensorFlow.js, Chart.js

## Dataset

- **HAM10000 Dataset:** Includes diverse dermatoscopic images of skin lesions.

## Techniques Applied

- **Image Processing:** Handles varying image sizes and shapes.
- **Image Augmentation:** Creates additional training data for better generalization.
- **Transfer Learning:** Fine-tunes MobileNet for specific classification tasks.

## Live Demo

Explore the live demo of the application [here](https://skin-scan-lesion-classifier.vercel.app/).


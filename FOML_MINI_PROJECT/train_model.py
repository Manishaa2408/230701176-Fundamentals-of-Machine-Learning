import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from speech.feature_extractor import extract_audio_features
import logging

logging.basicConfig(level=logging.INFO)

DATASET_ROOT = "voice_ai_dataset"
LABELS_FILE = os.path.join(DATASET_ROOT, "labels.csv")
AUDIO_DIR = os.path.join(DATASET_ROOT, "audio")
MODEL_SAVE_PATH = os.path.join("speech", "voice_model.pkl")

def get_features_and_labels():
    logging.info("Reading dataset labels...")
    if not os.path.exists(LABELS_FILE):
        raise FileNotFoundError(f"Labels file not found at {LABELS_FILE}")

    df = pd.read_csv(LABELS_FILE)

    X = []
    y = []

    logging.info(f"Total samples to process: {len(df)}")

    valid_count = 0
    # Process each audio file
    for index, row in df.iterrows():
        file_name = row['file']
        label = row['label'] # 0 for human, 1 for AI

        audio_path = os.path.join(AUDIO_DIR, file_name)

        if not os.path.exists(audio_path):
            logging.warning(f"File not found: {audio_path}")
            continue

        try:
            # Extract features (returns dict)
            features_dict = extract_audio_features(audio_path)
            
            # Combine into list of features matching classifier.py expectations
            # Order: [pitch_variance, rms_variance, zcr_mean]
            feature_vector = [
                features_dict["pitch_variance"],
                features_dict["rms_variance"],
                features_dict["zcr_mean"]
            ]

            X.append(feature_vector)
            y.append(label)
            valid_count += 1
            
            if valid_count % 100 == 0:
                logging.info(f"Processed {valid_count} samples...")

        except Exception as e:
            logging.error(f"Error processing {file_name}: {e}")

    return np.array(X), np.array(y)

def train_and_evaluate():
    X, y = get_features_and_labels()

    if len(X) == 0:
        logging.error("No valid features extracted. Exiting.")
        return

    logging.info(f"Successfully extracted features for {len(X)} samples.")
    logging.info("Splitting dataset into train and test sets (80/20)...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    logging.info("Training Random Forest Classifier...")
    # Initialize Random Forest
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    logging.info("Evaluating model on test set...")
    y_pred = clf.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    logging.info(f"Test Accuracy: {acc * 100:.2f}%")
    
    report = classification_report(y_test, y_pred, target_names=["Human (0)", "AI (1)"])
    logging.info("\nClassification Report:\n" + report)

    logging.info(f"Saving trained model to {MODEL_SAVE_PATH}...")
    joblib.dump(clf, MODEL_SAVE_PATH)
    logging.info("Model saved successfully!")

if __name__ == "__main__":
    train_and_evaluate()

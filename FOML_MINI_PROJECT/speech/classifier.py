import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "voice_model.pkl")
_model = None

def _get_model():
    global _model
    if _model is None and os.path.exists(MODEL_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
        except Exception:
            pass
    return _model


def classify_voice(features: dict):
    pitch_var = features["pitch_variance"]
    rms_var = features["rms_variance"]
    zcr = features["zcr_mean"]

    model = _get_model()

    if model is not None:
        # Use trained ML model
        X = np.array([[pitch_var, rms_var, zcr]])
        
        # predict_proba returns [[prob_0, prob_1]] where 0=Human, 1=AI
        probabilities = model.predict_proba(X)[0]
        human_probability = round(probabilities[0], 2)
        ai_probability = round(probabilities[1], 2)
        
        # 0 = HUMAN, 1 = AI
        prediction = model.predict(X)[0]
        classification = "HUMAN" if prediction == 0 else "AI_GENERATED"
        confidence_score = human_probability if prediction == 0 else ai_probability

    else:
        # Fallback to mock logic if model isn't trained/found
        score = 0.0

        if pitch_var > 50:
            score += 0.4
        if rms_var > 0.01:
            score += 0.4
        if zcr > 0.05:
            score += 0.2

        score = round(score, 2)

        classification = "HUMAN" if score >= 0.5 else "AI_GENERATED"

        human_probability = score
        ai_probability = round(1 - score, 2)
        confidence_score = score

    return {
        "classification": classification,
        "confidenceScore": confidence_score,
        "humanProbability": human_probability,
        "aiProbability": ai_probability,
        "explanation": (
            "Model detected natural voice characteristics"
            if classification == "HUMAN"
            else "Model identified synthetic or generated patterns"
        )
    }

import librosa
import numpy as np

def extract_audio_features(audio_path: str):
    y, sr = librosa.load(audio_path, sr=None, mono=True)

    # Pitch (Fundamental frequency)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[magnitudes > np.median(magnitudes)]
    pitch_variance = np.var(pitch_values) if len(pitch_values) > 0 else 0

    # Energy (RMS)
    rms = librosa.feature.rms(y=y)[0]
    rms_variance = np.var(rms)

    # Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    zcr_mean = np.mean(zcr)

    return {
        "pitch_variance": pitch_variance,
        "rms_variance": rms_variance,
        "zcr_mean": zcr_mean
    }

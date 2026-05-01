from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from speech.whisper_service import WhisperService
from speech.feature_extractor import extract_audio_features
from speech.classifier import classify_voice
from schemas import VoiceDetectionResponse
import io
import librosa
import tempfile
import os
import sys

# Ensure ffmpeg is found by Whisper
scripts_dir = os.path.dirname(sys.executable)
if scripts_dir not in os.environ.get("PATH", ""):
    os.environ["PATH"] = scripts_dir + os.pathsep + os.environ.get("PATH", "")

import logging
logging.basicConfig(level=logging.INFO)


# Initialize Whisper once (important for performance)
whisper_service = WhisperService(model_size="base")

app = FastAPI(
    title="AI Generated Voice Detection API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"message": "AI Generated Voice Detection API is running. Use /api/voice-detection for requests."}

@app.post("/api/voice-detection", response_model=VoiceDetectionResponse)
def voice_detection(
    file: UploadFile = File(...)
):

    # 1. Validate request body
    if not file:
        raise HTTPException(
            status_code=400,
            detail="Malformed request"
        )

    valid_extensions = (".mp3", ".wav", ".webm", ".m4a", ".ogg")
    if not file.filename.lower().endswith(valid_extensions):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format. Please use one of: {valid_extensions}"
        )

    # 2. Read audio
    try:
        audio_bytes = file.file.read()

        # 3. Save temp audio file
        ext = os.path.splitext(file.filename)[1].lower() or ".mp3"
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_audio:
            temp_audio.write(audio_bytes)
            orig_temp_path = temp_audio.name

        import subprocess
        # 4. Convert to wav to ensure librosa can read it properly, especially for webm
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as wav_temp:
            temp_path = wav_temp.name
            
        subprocess.run([
            "ffmpeg", "-y", "-i", orig_temp_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", temp_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if os.path.exists(orig_temp_path):
            os.remove(orig_temp_path)

        # Validate audio using librosa on the saved file
        y, sr = librosa.load(temp_path, sr=None, mono=True)

        if y is None or len(y) == 0:
            raise ValueError("Empty audio")

    except Exception as e:
        # Clean up if validation fails
        logging.error(f"Audio validation failed: {e}")
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        if 'orig_temp_path' in locals() and os.path.exists(orig_temp_path):
            os.remove(orig_temp_path)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted audio data: {str(e)}"
        )

    try:
        # 5. Whisper transcription
        transcription = whisper_service.transcribe_bytes(audio_bytes, file.filename)

        # 6. Feature extraction + classification
        features = extract_audio_features(temp_path)
        logging.info(f"Pitch variance: {features['pitch_variance']}")
        logging.info(f"RMS variance: {features['rms_variance']}")
        logging.info(f"ZCR mean: {features['zcr_mean']}")
        
        classification = classify_voice(features)


    finally:
        # Always clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # 7. Final response
    return {
    "status": "success",
    "detectedLanguage": transcription["language"],
    "classification": classification["classification"],
    "confidenceScore": classification["confidenceScore"],
    "humanProbability": classification["humanProbability"],
    "aiProbability": classification["aiProbability"],
    "explanation": classification["explanation"],
    "transcript": transcription["text"]
}





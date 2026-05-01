# 🎙️ VoiceGuard: AI Generated Voice Detection

VoiceGuard is a full-stack machine learning application designed to distinguish between **Human-spoken** audio and **AI-generated (Synthetic)** speech. Utilizing advanced audio feature extraction and deep learning-based transcription, the project provides a comprehensive dashboard for real-time analysis and verification of audio content.

## 🌟 Key Features

- **Dual-Input Mode**: 
  - **Live Recording**: Record audio directly from your microphone.
  - **File Upload**: Support for `.mp3`, `.wav`, `.webm`, `.m4a`, and `.ogg` formats.
- **Multilingual Support**: Automatically detects the language of the spoken content using OpenAI's **Whisper** model.
- **Detailed Analytics**: 
  - Probability scores for Human vs. AI detection.
  - Interactive charts (Radar/Area) visualizing confidence metrics.
  - Live waveform visualization during playback.
- **Transcription**: Provides a full text transcript of the analyzed audio.
- **History Tracking**: Keep track of previous detection results in a session-based history log.
- **Modern UI**: A responsive, dark-themed dashboard built with React and Framer Motion.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Speech Processing**: 
  - **OpenAI Whisper**: For robust transcription and language detection.
  - **Librosa**: For audio processing and feature extraction (Pitch, RMS, ZCR).
- **Machine Learning**: Scikit-learn (Random Forest Classifier).
- **Server**: Uvicorn.

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Visualization**: WaveSurfer.js & Recharts
- **Icons**: Lucide React

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- **FFmpeg**: Required for audio processing.
  - *Windows*: `choco install ffmpeg`
  - *Mac*: `brew install ffmpeg`

### 1. Backend Setup
Navigate to the project root:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
Navigate to the `frontend-react` directory:
```bash
cd frontend-react

# Install dependencies
npm install

# Run the development server
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
FOML_MINI_PROJECT/
├── app.py                  # FastAPI Backend Entry Point
├── schemas.py              # Data models for API requests/responses
├── train_model.py          # Script for training the classifier
├── speech/
│   ├── classifier.py       # ML Model logic (Human vs AI)
│   ├── feature_extractor.py # Audio feature analysis
│   └── whisper_service.py  # Transcription & Language detection
├── frontend-react/         # Vite + React Dashboard
│   ├── src/
│   │   ├── components/     # UI Components (Hero, AudioInput, Dashboard)
│   │   └── services/       # API integration
└── voice_ai_dataset/       # (Optional) Training data
```

---

## 🧠 How It Works

1.  **Audio Ingestion**: The system receives audio via WebSocket (recording) or HTTP POST (upload).
2.  **Processing**: FFmpeg standardizes the audio format.
3.  **Feature Extraction**: Librosa extracts key audio markers:
    - **Pitch Variance**: AI voices often exhibit unnaturally consistent or jittery pitch.
    - **RMS (Root Mean Square)**: Analyzes volume/energy distribution.
    - **ZCR (Zero Crossing Rate)**: Helps identify high-frequency noise typical in some synthetic models.
4.  **Classification**: A pre-trained Random Forest model analyzes these features to calculate the probability of the voice being synthetic.
5.  **Contextual Analysis**: Whisper provides a transcript to help the user verify the semantic consistency of the audio.

---

## 📝 License

This project was developed as a Fundamentals of Machine Learning (FOML) Mini Project.

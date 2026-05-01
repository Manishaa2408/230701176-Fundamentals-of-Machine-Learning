import whisper
import tempfile
import os

class WhisperService:
    def __init__(self, model_size="base"):
        self.model = whisper.load_model(model_size)

    def transcribe_bytes(self, audio_bytes: bytes, filename: str = "audio.mp3"):
        # Whisper needs a file path, so we create a temp file with correct ext
        ext = os.path.splitext(filename)[1].lower() or ".mp3"
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_audio:
            temp_audio.write(audio_bytes)
            temp_audio_path = temp_audio.name

        try:
            result = self.model.transcribe(temp_audio_path, task="translate")
            lang_code = result["language"]
            full_lang = whisper.tokenizer.LANGUAGES.get(lang_code, lang_code).capitalize()
            return {
                "language": full_lang,
                "text": result["text"]
            }
        finally:
            os.remove(temp_audio_path)

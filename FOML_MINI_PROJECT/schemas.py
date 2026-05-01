from pydantic import BaseModel, Field



class VoiceDetectionResponse(BaseModel):
    status: str
    detectedLanguage: str
    classification: str
    confidenceScore: float
    humanProbability: float
    aiProbability: float
    explanation: str
    transcript: str

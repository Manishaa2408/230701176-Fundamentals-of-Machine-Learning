import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const analyzeAudio = async (fileBlob, filename = 'audio.mp3') => {
  const formData = new FormData();
  formData.append('file', fileBlob, filename);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/voice-detection`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Server error occurred');
    }
    throw new Error('Failed to connect to the server');
  }
};

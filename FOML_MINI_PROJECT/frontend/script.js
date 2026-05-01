

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('audioFile');
  const fileLabel = document.querySelector('.file-upload-label');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.querySelector('.btn-text');
  const loader = document.querySelector('.loader');

  const resultsPanel = document.getElementById('resultsPanel');
  const errorPanel = document.getElementById('errorPanel');
  const errorMessage = document.getElementById('errorMessage');

  // Elements to populate
  const resClass = document.getElementById('resClassification');
  const resConf = document.getElementById('resConfidence');

  const resDetLang = document.getElementById('resDetLang');
  const humanBar = document.getElementById('humanBar');
  const humanScore = document.getElementById('humanScore');
  const aiBar = document.getElementById('aiBar');
  const aiScore = document.getElementById('aiScore');
  const resExp = document.getElementById('resExplanation');
  const resTrans = document.getElementById('resTranscript');

  // File input change handler
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      fileNameDisplay.textContent = file.name;
      fileLabel.classList.add('has-file');
    } else {
      fileNameDisplay.textContent = 'Choose an MP3 audio file';
      fileLabel.classList.remove('has-file');
    }
  });

  // Drag and drop support
  fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = 'var(--primary-accent)';
  });

  fileLabel.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (!fileInput.files.length) {
      fileLabel.style.borderColor = 'var(--glass-border)';
    }
  });

  fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      // Trigger change event manually
      const event = new Event('change');
      fileInput.dispatchEvent(event);
    }
  });

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous results
    resultsPanel.classList.add('hidden');
    errorPanel.classList.add('hidden');

    // UI Loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');

    const formData = new FormData(form);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/voice-detection', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      displayResults(data);

    } catch (error) {
      errorMessage.textContent = error.message || 'Failed to connect to the server. Is the API running?';
      errorPanel.classList.remove('hidden');
    } finally {
      // Restore UI
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  });

  function displayResults(data) {
    // Populate simple text
    resClass.textContent = data.classification;
    resConf.textContent = `${(data.confidenceScore * 100).toFixed(1)}%`;

    resDetLang.textContent = data.detectedLanguage;
    resExp.textContent = data.explanation;
    resTrans.textContent = data.transcript || "No transcript available.";

    // Style classification based on result
    if (data.classification.toLowerCase() === 'human') {
      resClass.style.color = 'var(--human-color)';
    } else {
      resClass.style.color = 'var(--ai-color)';
    }

    // Reset bars
    humanBar.style.width = '0%';
    aiBar.style.width = '0%';

    // Show panel (trigger reflow before setting width for transition)
    resultsPanel.classList.remove('hidden');

    // Slight delay to allow CSS transition to run after layout
    setTimeout(() => {
      const hScore = Math.round(data.humanProbability * 100);
      const aScore = Math.round(data.aiProbability * 100);

      humanBar.style.width = `${hScore}%`;
      humanScore.textContent = `${hScore}%`;

      aiBar.style.width = `${aScore}%`;
      aiScore.textContent = `${aScore}%`;
    }, 50);
  }
});

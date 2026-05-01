# AI-Generated Voice Detection

This API detects whether a given audio sample is AI-generated or Human-spoken.

## Setup

1.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
2.  Activate the virtual environment:
    *   Windows: `venv\Scripts\Activate`
    *   Mac/Linux: `source venv/bin/activate`
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the API

```bash
uvicorn app:app --reload
```



# VoiceScribe NG

VoiceScribe NG is a production-ready voice-to-text speech recognition system for Nigerian car dealerships. It uses Flask, SQLite, SQLAlchemy, JWT authentication, React, Vite, TailwindCSS, and a threaded AI pipeline for transcription, diarization, entity extraction, summarization, sentiment analysis, and PDF export.

## Prerequisites

- Python 3.11+
- Node.js 18+
- FFmpeg
- Git
- HuggingFace account and access token
- Pyannote model access for `pyannote/speaker-diarization-3.1`

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
```

On Windows:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Install the spaCy model separately. If the direct install fails with a 0-byte or invalid wheel, download the wheel in your browser from the same URL and install it from `Downloads`.

```bash
pip install -r requirements-spacy-model.txt
python -c "import spacy; spacy.load('en_core_web_sm'); print('spaCy model OK')"
```

Windows manual fallback:

```powershell
pip install "$env:USERPROFILE\Downloads\en_core_web_sm-3.7.1-py3-none-any.whl"
python -c "import spacy; spacy.load('en_core_web_sm'); print('spaCy model OK')"
```

Create environment variables:

```bash
cp .env.example .env
```

Fill in:

```env
FLASK_SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///C:/tmp/VoiceScribeNG/voicescribe.db
UPLOAD_FOLDER=uploads/
MAX_CONTENT_LENGTH=52428800
HF_TOKEN=your-huggingface-token
PYANNOTE_AUTH_TOKEN=your-pyannote-token
WHISPER_MODEL=large-v3
```

Seed the database:

```bash
python seed.py
```

Start Flask:

```bash
python app.py
```

The API runs at `http://localhost:5000`.

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Default logins:

- Manager: `admin@voicescribe.ng` / `Admin@1234`
- Sales Exec: `sales@voicescribe.ng` / `Sales@1234`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/audio/upload`
- `GET /api/audio`
- `GET /api/audio/<id>`
- `DELETE /api/audio/<id>`
- `GET /api/transcripts`
- `GET /api/transcripts/<id>`
- `GET /api/transcripts/search?q=keyword`
- `GET /api/export/<transcript_id>/pdf`

## Pipeline

Each upload starts a daemon background thread that:

1. Marks the file as `processing`.
2. Runs Whisper `large-v3` for transcript text and timestamps.
3. Runs Pyannote diarization and maps the first two speakers to Sales Executive and Customer.
4. Extracts Nigerian auto-sales entities such as car models, Naira prices, objections, and next steps.
5. Summarizes the transcript with BART large CNN, truncating to 1024 tokens.
6. Scores per-segment and overall sentiment with CardiffNLP RoBERTa.
7. Saves transcript, diarized segments, summary, entities, and sentiment to SQLite.
8. Marks the file as `completed`, or `failed` if any exception occurs.

## Security

- All non-auth API routes require JWT.
- Passwords are hashed with bcrypt using 12 rounds.
- Users can only access their own audio files and transcripts.
- Upload validation allows MP3, WAV, M4A, and FLAC files up to 50MB.
- CORS is restricted to `http://localhost:5173`.

SETUP COMPLETE

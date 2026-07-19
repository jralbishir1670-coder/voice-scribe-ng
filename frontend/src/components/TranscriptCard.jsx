import { Clock, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import SentimentBadge from './SentimentBadge'

function formatDuration(seconds) {
  if (!seconds) return 'Pending'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}m ${secs}s`
}

export default function TranscriptCard({ transcript }) {
  return (
    <Link className="transcript-card" to={`/transcripts/${transcript.id}`}>
      <div className="card-icon">
        <FileText size={18} />
      </div>
      <div className="transcript-meta">
        <strong>{transcript.filename}</strong>
        <span>{new Date(transcript.created_at || transcript.upload_date).toLocaleString()}</span>
      </div>
      <div className="duration">
        <Clock size={15} />
        {formatDuration(transcript.duration_seconds)}
      </div>
      <span className="wer-badge">WER {transcript.word_error_rate ?? 'N/A'}</span>
      <SentimentBadge sentiment={transcript.sentiment} />
    </Link>
  )
}

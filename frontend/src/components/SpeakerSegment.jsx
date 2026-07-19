function timecode(seconds) {
  const mins = Math.floor((seconds || 0) / 60)
  const secs = Math.floor((seconds || 0) % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const icons = { positive: '+', neutral: '~', negative: '!' }

export default function SpeakerSegment({ segment }) {
  const isCustomer = segment.speaker_label === 'Customer'
  return (
    <article className={`speaker-segment ${isCustomer ? 'customer' : 'sales'}`}>
      <header>
        <strong>{segment.speaker_label}</strong>
        <span>{timecode(segment.start_time)} - {timecode(segment.end_time)}</span>
        <span className={`segment-sentiment ${segment.sentiment_label || 'neutral'}`}>{icons[segment.sentiment_label] || '~'}</span>
      </header>
      <p>{segment.text}</p>
    </article>
  )
}

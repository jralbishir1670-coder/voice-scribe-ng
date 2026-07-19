const labels = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
}

export default function SentimentBadge({ sentiment }) {
  const label = typeof sentiment === 'string' ? sentiment : sentiment?.label || sentiment?.overall || 'neutral'
  return <span className={`sentiment sentiment-${label}`}>{labels[label] || label}</span>
}

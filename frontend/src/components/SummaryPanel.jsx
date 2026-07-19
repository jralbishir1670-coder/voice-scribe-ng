export default function SummaryPanel({ summary }) {
  return <p className="summary-text">{summary?.summary_text || 'Summary will appear when analysis completes.'}</p>
}

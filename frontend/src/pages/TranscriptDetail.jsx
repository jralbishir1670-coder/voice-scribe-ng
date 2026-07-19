import { Download } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'
import EntityBadge from '../components/EntityBadge'
import SentimentBadge from '../components/SentimentBadge'
import SpeakerSegment from '../components/SpeakerSegment'
import SummaryPanel from '../components/SummaryPanel'

const tabs = ['Summary', 'Entities', 'Sentiment', 'Raw Transcript']

export default function TranscriptDetail() {
  const { id } = useParams()
  const [transcript, setTranscript] = useState(null)
  const [activeTab, setActiveTab] = useState('Summary')

  useEffect(() => {
    api.get(`/transcripts/${id}`).then(({ data }) => setTranscript(data.transcript))
  }, [id])

  const groupedEntities = useMemo(() => {
    return (transcript?.entities || []).reduce((groups, entity) => {
      groups[entity.entity_type] = groups[entity.entity_type] || []
      groups[entity.entity_type].push(entity)
      return groups
    }, {})
  }, [transcript])

  if (!transcript) return <section className="page"><p className="empty">Loading transcript...</p></section>

  const exportPdf = async () => {
    const response = await api.get(`/export/${transcript.id}/pdf`, { responseType: 'blob' })
    const href = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = href
    link.download = `voicescribe-transcript-${transcript.id}.pdf`
    link.click()
    URL.revokeObjectURL(href)
  }

  return (
    <section className="page transcript-detail">
      <div className="detail-heading">
        <div>
          <h1>{transcript.filename}</h1>
          <p>{new Date(transcript.created_at).toLocaleString()}</p>
        </div>
        <div className="detail-actions">
          <span className="wer-badge">WER {transcript.word_error_rate ?? 'N/A'}</span>
          <button type="button" className="primary-button compact" onClick={exportPdf}>
            <Download size={17} />
            Export PDF
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <section className="transcript-panel">
          {transcript.segments.map((segment) => <SpeakerSegment segment={segment} key={segment.id} />)}
        </section>
        <aside className="insight-panel">
          <div className="tabs">
            {tabs.map((tab) => (
              <button type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>
            ))}
          </div>
          {activeTab === 'Summary' && <SummaryPanel summary={transcript.summary_detail} />}
          {activeTab === 'Entities' && (
            <div className="entity-groups">
              {Object.entries(groupedEntities).map(([type, entities]) => (
                <div key={type}>
                  <h3>{type.replace('_', ' ')}</h3>
                  <div className="entity-row">{entities.map((entity) => <EntityBadge entity={entity} key={entity.id} />)}</div>
                </div>
              ))}
              {!transcript.entities.length && <p className="empty">No entities extracted.</p>}
            </div>
          )}
          {activeTab === 'Sentiment' && (
            <div className="sentiment-panel">
              <div className="overall-sentiment">
                <SentimentBadge sentiment={transcript.sentiment} />
                <strong>{Math.round((transcript.sentiment?.score || 0) * 100)}%</strong>
              </div>
              {transcript.segments.map((segment) => (
                <div className="sentiment-line" key={segment.id}>
                  <span>{segment.speaker_label}</span>
                  <SentimentBadge sentiment={segment.sentiment_label} />
                  <strong>{Math.round((segment.sentiment_score || 0) * 100)}%</strong>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Raw Transcript' && <pre className="raw-transcript">{transcript.full_text}</pre>}
        </aside>
      </div>
    </section>
  )
}

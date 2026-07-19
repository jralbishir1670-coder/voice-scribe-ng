import { Clock, FileAudio, Gauge, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import SentimentBadge from '../components/SentimentBadge'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [audioFiles, setAudioFiles] = useState([])
  const [transcripts, setTranscripts] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([api.get('/audio'), api.get('/transcripts')]).then(([audioRes, transcriptRes]) => {
      setAudioFiles(audioRes.data.audio_files)
      setTranscripts(transcriptRes.data.items)
    })
  }, [])

  const stats = useMemo(() => {
    const completed = audioFiles.filter((file) => file.status === 'completed').length
    const wers = transcripts.map((item) => item.word_error_rate).filter((value) => typeof value === 'number')
    const averageWer = wers.length ? (wers.reduce((sum, value) => sum + value, 0) / wers.length).toFixed(2) : 'N/A'
    const totalMinutes = transcripts.reduce((sum, item) => sum + (item.duration_seconds || 0), 0) / 60
    return [
      { label: 'Total Recordings', value: audioFiles.length, icon: FileAudio },
      { label: 'Completed', value: completed, icon: Gauge },
      { label: 'Average WER', value: averageWer, icon: TrendingUp },
      { label: 'Estimated Time Saved', value: `${Math.round(totalMinutes * 3)}m`, icon: Clock },
    ]
  }, [audioFiles, transcripts])

  const sentimentCounts = transcripts.reduce((counts, transcript) => {
    const label = transcript.sentiment?.label || 'neutral'
    counts[label] = (counts[label] || 0) + 1
    return counts
  }, { positive: 0, neutral: 0, negative: 0 })

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Operational view of uploaded recordings and completed analyses.</p>
      </div>
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <Icon size={22} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="content-grid">
        <section className="panel wide">
          <h2>Recent Transcripts</h2>
          <div className="table">
            {transcripts.slice(0, 5).map((item) => (
              <div className="table-row" key={item.id}>
                <strong>{item.filename}</strong>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span>{item.status}</span>
                <SentimentBadge sentiment={item.sentiment} />
              </div>
            ))}
            {!transcripts.length && <p className="empty">No transcripts yet.</p>}
          </div>
        </section>
        <section className="panel">
          <h2>Sentiment Distribution</h2>
          {Object.entries(sentimentCounts).map(([label, count]) => (
            <div className="distribution-row" key={label}>
              <SentimentBadge sentiment={label} />
              <strong>{count}</strong>
            </div>
          ))}
        </section>
      </div>
      {user?.role === 'manager' && (
        <section className="panel manager-shortcut">
          <Users size={22} />
          <div>
            <h2>Dealership Users</h2>
            <p>Manage managers, sales executives, password resets, and account status.</p>
          </div>
          <a className="primary-button compact" href="/users">Open Users</a>
        </section>
      )}
    </section>
  )
}

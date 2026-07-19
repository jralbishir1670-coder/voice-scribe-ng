import { CheckCircle2, Loader2, RadioTower, UploadCloud, Waves } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import AudioUploader from '../components/AudioUploader'

const steps = [
  { label: 'Uploaded', icon: UploadCloud },
  { label: 'Processing', icon: RadioTower },
  { label: 'Transcribing', icon: Waves },
  { label: 'Analysing', icon: Loader2 },
  { label: 'Complete', icon: CheckCircle2 },
]

export default function Upload() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audio, setAudio] = useState(null)
  const [error, setError] = useState('')

  const onUpload = async (file) => {
    setError('')
    setUploading(true)
    const data = new FormData()
    data.append('file', file)
    try {
      const response = await api.post('/audio/upload', data, {
        onUploadProgress: (event) => setProgress(Math.round((event.loaded * 100) / event.total)),
      })
      setAudio(response.data.audio)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (!audio || ['completed', 'failed'].includes(audio.status)) return undefined

    const interval = setInterval(async () => {
      const { data } = await api.get(`/audio/${audio.id}`)
      setAudio(data.audio)
      if (data.audio.status === 'completed' && data.audio.transcript_id) {
        clearInterval(interval)
        navigate(`/transcripts/${data.audio.transcript_id}`)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [audio, navigate])

  const activeIndex = audio?.status === 'completed' ? 4 : audio?.status === 'processing' ? 2 : audio ? 1 : 0

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Upload Recording</h1>
        <p>Drop a dealership call and the AI pipeline will transcribe, diarize, summarize, extract entities, and score sentiment.</p>
      </div>
      <AudioUploader onUpload={onUpload} uploading={uploading} progress={progress} />
      {error && <div className="form-error">{error}</div>}
      <div className="status-track">
        {steps.map(({ label, icon: Icon }, index) => (
          <div className={`track-step ${index <= activeIndex ? 'active' : ''}`} key={label}>
            <Icon size={18} className={label === 'Analysing' && audio?.status === 'processing' ? 'spin' : ''} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      {audio?.status === 'failed' && <div className="form-error">Processing failed. Confirm your AI tokens and FFmpeg installation, then retry.</div>}
    </section>
  )
}

import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

export default function AudioUploader({ onUpload, uploading, progress }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div
      className={`drop-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,.flac,audio/*" hidden onChange={(event) => handleFiles(event.target.files)} />
      <UploadCloud size={36} />
      <strong>{uploading ? 'Uploading recording...' : 'Drop dealership call audio here'}</strong>
      <span>MP3, WAV, M4A, or FLAC up to 50MB</span>
      {uploading && (
        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

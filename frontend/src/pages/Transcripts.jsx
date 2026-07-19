import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/client'
import TranscriptCard from '../components/TranscriptCard'

const filters = ['all', 'completed', 'processing', 'failed']

export default function Transcripts() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (query.trim()) {
        const { data } = await api.get('/transcripts/search', { params: { q: query } })
        setItems(data.items)
        setPages(1)
        return
      }
      const { data } = await api.get('/transcripts', { params: { page, status: filter } })
      setItems(data.items)
      setPages(data.pages || 1)
    }, 250)
    return () => clearTimeout(handle)
  }, [query, filter, page])

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Transcripts</h1>
        <p>Search across recordings, transcript text, and extracted dealership entities.</p>
      </div>
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search keyword, car model, price..." />
        </label>
        <div className="segmented">
          {filters.map((item) => (
            <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="transcript-list">
        {items.map((transcript) => <TranscriptCard transcript={transcript} key={transcript.id} />)}
        {!items.length && <p className="empty">No transcripts found.</p>}
      </div>
      <div className="pagination">
        <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>
    </section>
  )
}

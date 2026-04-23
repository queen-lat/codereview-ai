import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import './index.css'

const PLACEHOLDER = `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`)
  const data = await res.json()
  return data
}`

export default function App() {
  const [code, setCode] = useState(PLACEHOLDER)
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleReview() {
    if (!code.trim()) return
    setLoading(true)
    setReview(null)

    // We'll connect this to the real AI in Week 2
    // For now, simulate a response
    setTimeout(() => {
      setReview([
        { type: 'error', line: 'Line 2–3', text: 'No error handling — if fetch fails, the app will crash silently.' },
        { type: 'warning', line: 'Line 2', text: 'Consider checking res.ok before calling res.json().' },
        { type: 'good', line: 'Line 1', text: 'Good use of async/await — clean and readable.' },
      ])
      setLoading(false)
    }, 1500)
  }

  function handleClear() {
    setCode('')
    setReview(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar onReview={handleReview} onClear={handleClear} loading={loading} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        <EditorPanel code={code} onChange={setCode} />
        <ReviewPanel review={review} loading={loading} />
      </div>
    </div>
  )
}

function TopBar({ onReview, onClear, loading }) {
  return (
    <div style={{
      background: '#1a1a1a',
      borderBottom: '1px solid #2a2a2a',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7F77DD' }} />
        <span style={{ fontWeight: 500, fontSize: 15 }}>CodeReview AI</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClear} style={btnStyle}>Clear</button>
        <button onClick={onReview} disabled={loading} style={{ ...btnStyle, background: '#534AB7', color: '#EEEDFE', borderColor: '#534AB7', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Reviewing...' : 'Review my code'}
        </button>
      </div>
    </div>
  )
}

function EditorPanel({ code, onChange }) {
  return (
    <div style={{ borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={panelLabelStyle}>Your code <span style={badgeStyle}>JavaScript</span></div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CodeMirror
          value={code}
          height="100%"
          theme="dark"
          extensions={[javascript()]}
          onChange={onChange}
          style={{ fontSize: 13, height: '100%' }}
        />
      </div>
    </div>
  )
}

function ReviewPanel({ review, loading }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={panelLabelStyle}>AI review</div>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        {loading && (
          <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Analysing your code...</div>
        )}
        {!loading && !review && (
          <div style={{ color: '#555', fontSize: 14, marginTop: 8 }}>Paste your code and hit "Review my code"</div>
        )}
        {review && review.map((item, i) => (
          <ReviewCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ item }) {
  const colors = {
    error: { border: '#E24B4A', tag: '#FCEBEB', tagText: '#791F1F', label: 'Bug risk' },
    warning: { border: '#EF9F27', tag: '#FAEEDA', tagText: '#633806', label: 'Warning' },
    good: { border: '#639922', tag: '#EAF3DE', tagText: '#27500A', label: 'Good' },
  }
  const c = colors[item.type]

  return (
    <div style={{
      borderLeft: `2px solid ${c.border}`,
      background: '#1a1a1a',
      borderRadius: '0 8px 8px 0',
      padding: '10px 12px',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 10, background: c.tag, color: c.tagText }}>{c.label}</span>
        <span style={{ fontSize: 11, color: '#666' }}>{item.line}</span>
      </div>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5 }}>{item.text}</div>
    </div>
  )
}

const btnStyle = {
  fontSize: 12,
  padding: '5px 14px',
  border: '1px solid #333',
  borderRadius: 6,
  background: 'transparent',
  color: '#ccc',
  cursor: 'pointer',
}

const panelLabelStyle = {
  fontSize: 11,
  fontWeight: 500,
  color: '#666',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  padding: '10px 16px',
  borderBottom: '1px solid #2a2a2a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const badgeStyle = {
  fontSize: 10,
  padding: '2px 8px',
  borderRadius: 10,
  background: '#EEEDFE',
  color: '#3C3489',
  fontWeight: 500,
  textTransform: 'none',
  letterSpacing: 0,
}
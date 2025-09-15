import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

/**
 * Docs:
 * https://es.react.dev/learn/escape-hatches#synchronizing-with-effects
 * https://es.react.dev/reference/react/useEffect
 */

import ReactDOM from 'react-dom/client'
import * as React from 'react'

import App from './components/App'

import './index.css'

const el = document.getElementById('root')
if (el) {
    const root = ReactDOM.createRoot(el)
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
} else {
    console.error('div#root not found on page')
}

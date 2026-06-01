import { useEffect,useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import Footer from "./components/Footer"
function App() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)
  const [input,setInput] = useState('')

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
    .then((response) => {
    if  (!response.ok) {
      throw new Error('API request failed')
    }
    return response.text()
    })
    .then((data) => {
      setMessage(data)
    })
    .catch((error) => {
      setError('Spring Boot API に接続できません。backend が起動しているか確認してください。')
      console.error(error)
    })
  }, [])

  return (
    <main style={{ padding: '32px', fontFamily: 'sans-serif' }}>
    <Header/>
    <MainContent/>
    <section style={{ marginTop: '24px' }}>
      <h2>API Response</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
    <button
      type = "button"
      className = "counter"
      onClick = {() => setCount((count) => count + 1)}
    >
      カウント：{count}
    </button>
    <br/>
    <div>
    <label>入力：
      <input type = "text" value = {input} onChange = {handleChange} placeholder="メッセージを入力"
      />
    </label>
    <p>入力内容：{input}</p>
    </div>
    <Footer/>
    </main>
    )
}

export default App
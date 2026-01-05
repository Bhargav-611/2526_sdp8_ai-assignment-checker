import { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [viewImage, setViewImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!question.trim() || !answer.trim() || !image) {
      setMessage('Please fill in all fields')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('question', question)
    formData.append('answer', answer)
    formData.append('image', image)

    try {
      const response = await fetch('http://localhost:8080/questions/', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Question added successfully! ID: ${data.id}`)
        setAnswer('')
        setImage(null)
        setQuestionId(data.id)
      } else {
        setMessage('Failed to add question')
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleViewImage = async () => {
    if (!questionId.trim()) {
      setMessage('Please enter a question ID')
      return
    }

    try {
      setViewImage(`http://localhost:8080/questions/${questionId}/image`)
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <div className="app-container">
      <h1>Auto-Grade System</h1>
      
      <div className="form-container">
        <h2>Add New Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question Text:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your question here..."
              rows="8"
              cols="50"
            />
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && <p className="file-name">Selected: {image.name}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Submit Question'}
          </button>
        </form>

        {message && <p className={`message ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </p>}
      </div>

      <div className="view-container">
        <h2>View Question Image</h2>
        <div className="view-group">
          <label>Question ID:</label>
          <input
            type="number"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
            placeholder="Enter question ID"
          />
          <button onClick={handleViewImage}>View Image</button>
        </div>

        {viewImage && (
          <div className="image-display">
            <h3>Question Image:</h3>
            <img src={viewImage} alt="Question" />
          </div>
        )}
      </div>
    </div>
  )
}

export default App

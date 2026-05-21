import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import App from './App'

// 1. Mock the child components so we don't have to worry about their internal logic yet
vi.mock('./Intro', () => ({
  default: ({ setPageQuiz }) => (
    <div>
      <h2>Intro Page Mock</h2>
      <button onClick={setPageQuiz}>Start Quiz</button>
    </div>
  )
}))

vi.mock('./Quiz', () => ({
  default: ({ setPageIntro }) => (
    <div>
      <h2>Quiz Page Mock</h2>
      <button onClick={setPageIntro}>Go Back to Intro</button>
    </div>
  )
}))

describe('App Component Page Routing', () => {
  test('renders the Intro page by default', () => {
    render(<App />)
    
    // Assert that the intro page mock text is visible, but the quiz mock is not
    expect(screen.getByText('Intro Page Mock')).toBeInTheDocument()
    expect(screen.queryByText('Quiz Page Mock')).not.toBeInTheDocument()
  })

  test('switches to Quiz page when Start Quiz button is clicked', async () => {
    render(<App />)
    const user = userEvent.setup()
    
    // Find and click the start button
    const startButton = screen.getByRole('button', { name: /start quiz/i })
    await user.click(startButton)
    
    // Assert that the page state has shifted to the Quiz component
    expect(screen.getByText('Quiz Page Mock')).toBeInTheDocument()
    expect(screen.queryByText('Intro Page Mock')).not.toBeInTheDocument()
  })

  test('switches back to Intro page when Go Back button is clicked from Quiz', async () => {
    render(<App />)
    const user = userEvent.setup()
    
    // Navigate to Quiz page first
    const startButton = screen.getByRole('button', { name: /start quiz/i })
    await user.click(startButton)
    
    // Find and click the back button inside the Quiz component
    const backButton = screen.getByRole('button', { name: /go back to intro/i })
    await user.click(backButton)
    
    // Assert we are safely back home
    expect(screen.getByText('Intro Page Mock')).toBeInTheDocument()
  })
})
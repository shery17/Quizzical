import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Intro from './Intro'

describe('Intro Component', () => {
  test('renders the title, description, and start button correctly', () => {
    // Pass a dummy function for the prop since we're just checking the text content here
    render(<Intro setPageQuiz={() => {}} />)

    // Assert that the header text exists
    expect(screen.getByRole('heading', { level: 1, name: /quizzical/i })).toBeInTheDocument()

    // Assert that the description text exists
    expect(screen.getByText(/5 random questions\. how many can you get right\?/i)).toBeInTheDocument()

    // Assert that the button exists
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })

  test('calls setPageQuiz function when the start button is clicked', async () => {
    // vi.fn() creates a "spy" function so we can track if and when it gets called
    const mockSetPageQuiz = vi.fn()
    
    render(<Intro setPageQuiz={mockSetPageQuiz} />)
    const user = userEvent.setup()

    // Find the button and click it
    const button = screen.getByRole('button', { name: /start quiz/i })
    await user.click(button)

    // Assert that our spy function was triggered exactly 1 time
    expect(mockSetPageQuiz).toHaveBeenCalledTimes(1)
  })
})
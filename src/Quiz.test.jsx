import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Quiz from './Quiz'

// A mock payload mirroring the Open Trivia Database response structure
const mockApiResponse = {
  results: [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"]
    },
    {
      question: "Is the earth flat?",
      correct_answer: "False",
      incorrect_answers: ["True"]
    }
  ]
}

describe('Quiz Component Integration', () => {
  beforeEach(() => {
    // Intercept window.fetch to return our mock API response automatically
    vi.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    )
    // Stable shuffling values for child Question components
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetches trivia questions from API and displays them on mount', async () => {
    render(<Quiz />)

    // Assert that fetch was triggered targeting the correct endpoint URL
    expect(window.fetch).toHaveBeenCalledWith('https://opentdb.com/api.php?amount=5')

    // Wait for async rendering to process the fetched elements
    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
      expect(screen.getByText('Is the earth flat?')).toBeInTheDocument()
    })
  })

  test('happy path: complete quiz journey from selection to scoring and resetting', async () => {
    render(<Quiz />)
    const user = userEvent.setup()

    // 1. Wait for questions to mount
    await waitFor(() => {
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    })

    // 2. The submit button shouldn't exist because we haven't selected options for every question yet
    expect(screen.queryByRole('button', { name: /check answers/i })).not.toBeInTheDocument()

    // 3. Make choices for all active questions
    const parisRadio = screen.getByLabelText('Paris') // Correct option
    const trueRadio = screen.getByLabelText('True')   // Incorrect option

    await user.click(parisRadio)
    await user.click(trueRadio)

    // 4. Submit button should render now that all questions have an active choice state assignment
    const submitBtn = await screen.findByRole('button', { name: /check answers/i })
    expect(submitBtn).toBeInTheDocument()

    // 5. Submit the form to check scores
    await user.click(submitBtn)

    // 6. Verify score matches calculations (1 out of 2 questions answered correctly)
    expect(screen.getByText('You scored 1/2 correct answers')).toBeInTheDocument()

    // 7. Find the "Play again" button and click it to reset
    const playAgainBtn = screen.getByRole('button', { name: /play again/i })
    await user.click(playAgainBtn)

    // 8. Assert that fetch was re-triggered and state values flushed back to fresh presets
    expect(window.fetch).toHaveBeenCalledTimes(2)
    expect(screen.queryByText('You scored 1/2 correct answers')).not.toBeInTheDocument()
  })
})
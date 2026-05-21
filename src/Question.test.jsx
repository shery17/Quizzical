import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Question from './Question'

describe('Question Component', () => {
  const mockProps = {
    id: 'q1',
    questionTitle: 'What is the capital of France?',
    correctAnswer: 'Paris',
    wrongAnswers: ['London', 'Berlin', 'Madrid'],
    selectedOption: '',
    showScore: false,
    handleSelectedOption: vi.fn(),
  }

  // Before each test, mock Math.random so the shuffle outputs options in a stable order:
  // ['Paris', 'London', 'Berlin', Madrid'] -> Shuffled predictably to -> ['Madrid', 'Paris', 'London', 'Berlin']
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the question title and all answer options label elements', () => {
    render(<Question {...mockProps} />)

    // Verify the question legend is showing up
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()

    // Verify all four options are visible on screen
    expect(screen.getByLabelText('Paris')).toBeInTheDocument()
    expect(screen.getByLabelText('London')).toBeInTheDocument()
    expect(screen.getByLabelText('Berlin')).toBeInTheDocument()
    expect(screen.getByLabelText('Madrid')).toBeInTheDocument()
  })

  test('calls handleSelectedOption with correct values when an answer label is clicked', async () => {
    const user = userEvent.setup()
    render(<Question {...mockProps} />)

    // Click on the 'Paris' choice
    const optionParis = screen.getByLabelText('Paris')
    await user.click(optionParis)

    // Verify it notifies the parent Quiz component with the answer string and question ID
    expect(mockProps.handleSelectedOption).toHaveBeenCalledWith('Paris', 'q1')
  })

  test('applies the "selected" class name to the active option label', () => {
    // Re-render with 'Paris' passed as the already selectedOption state
    render(<Question {...mockProps} selectedOption="Paris" />)

    const parisLabel = screen.getByText('Paris')
    const londonLabel = screen.getByText('London')

    // Paris should have the active background class wrapper, London shouldn't
    expect(parisLabel).toHaveClass('selected')
    expect(londonLabel).not.toHaveClass('selected')
  })

  test('reveals scores gracefully: highlights correct answers in green and transparents the others', () => {
    render(<Question {...mockProps} selectedOption="Paris" showScore={true} />)

    const correctLabel = screen.getByText('Paris')
    const incorrectLabel = screen.getByText('London')

    // Since showScore is true and Paris is correct, it turns green
    expect(correctLabel).toHaveClass('answerInGreen')
    expect(incorrectLabel).toHaveClass('answerTransparent')
  })

  test('reveals scores gracefully: highlights a wrong user choice in red', () => {
    // Simulate a user picking 'London' instead of 'Paris'
    render(<Question {...mockProps} selectedOption="London" showScore={true} />)

    const wrongSelectedLabel = screen.getByText('London')
    const correctLabel = screen.getByText('Paris')

    // The chosen wrong answer flips red, while the actual correct answer still highlights in green
    expect(wrongSelectedLabel).toHaveClass('answerInRed')
    expect(correctLabel).toHaveClass('answerInGreen')
  })
})
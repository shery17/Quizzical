import { clsx } from "clsx"
import { useMemo } from "react"

export default function Question(props) {
    // states
    const listOfAnswers = useMemo(() => {
        return shuffleArray([props.correctAnswer, ...props.wrongAnswers])
    }, [props.correctAnswer, props.wrongAnswers])

    // helper functions
    function shuffleArray(array) {
        const arr = [...array]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }

    const optionsElements = listOfAnswers.map((answer, index) => {
        const isAnswerSelected = props.selectedOption === answer
        const isCorrectAnswer = answer === props.correctAnswer
        const isWrongAnswerSelected = isAnswerSelected && props.selectedOption != props.correctAnswer
        const className = clsx({
            selected: isAnswerSelected,
            answerInGreen: isCorrectAnswer && props.showScore,
            answerInRed: isWrongAnswerSelected && props.showScore,
            answerTransparent: !isCorrectAnswer && props.showScore
        })

        return (
            <label key={`question${props.id}-choice${index}`} className={className}>
                <input 
                    className="radio"
                    type="radio"
                    name={`question${props.id}`}
                    value={answer}
                    checked={isAnswerSelected}
                    onChange={() => props.handleSelectedOption(answer, props.id)}
                    required
                />
                {answer}
            </label>
        )
    })

    // return render
    return (
        <fieldset>
            <legend>{props.questionTitle}</legend>
            {optionsElements}
            <br />
        </fieldset>
    )
}
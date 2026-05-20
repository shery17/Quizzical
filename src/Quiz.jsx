import { useEffect, useState } from "react"
import Question from "./Question"
import { decode } from "he"

export default function Quiz() {
    // state values
    const [questions, setQuestions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [showScore, setShowScore] = useState(false)

    // derived values
    let correctlyAnswered = 0
    questions.forEach((question, index) => {
        if(question.correct_answer === selectedOptions[index]) {
            correctlyAnswered++
        }
    });

    // functions
    async function fetchQuestions() {
        try {
            const res = await fetch("https://opentdb.com/api.php?amount=5")
            const data = await res.json()

            const decodedResults = data.results.map(q => ({
            ...q,
            question: decode(q.question),
            correct_answer: decode(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decode)
            }));

            setQuestions(decodedResults)
        } catch (err) {
            console.log("Error fetching data:", err)
        }
    }

    useEffect(() => {
        fetchQuestions()
    },[])

    function handleSelectedOption(selectedAnswer, id) {
        setSelectedOptions(prevSelectedOptions => {
            const replacementState = [...prevSelectedOptions]
            replacementState[id] = selectedAnswer
            return replacementState
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        setShowScore(true)
    }
    
    function handlePlayAgain() {
        setShowScore(false)
        fetchQuestions()
        setSelectedOptions([])
    }

    const questionElements = questions.map((question, index) => {
        return <Question 
                key={index}
                id={index}
                questionTitle={question.question} 
                correctAnswer={question.correct_answer} 
                wrongAnswers={question.incorrect_answers}
                showScore={showScore}
                selectedOption={selectedOptions[index]}
                handleSelectedOption={handleSelectedOption}
            />
    })

    return (
        <form onSubmit={handleSubmit}>
            {questionElements}
            {questions.length > 0 &&
            !showScore &&
            selectedOptions.filter(opt => opt !== undefined).length === questions.length &&
            <button className="check-button" type="submit">Check answers</button>}


            {showScore && 
            <div class="showScore-container">
                <p>You scored {correctlyAnswered}/{questions.length} correct answers</p>
                <button onClick={handlePlayAgain} type="button">Play again</button>
            </div>
            }
        </form>
    )
}
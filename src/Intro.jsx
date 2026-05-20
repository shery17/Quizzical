

export default function Intro(props) {

    return (
        <div className="intro">
            <h1>Quizzical</h1>
            <p>5 random questions. How many can you get right?</p>
            <button onClick={props.setPageQuiz}>Start quiz</button>
        </div>
    )
}
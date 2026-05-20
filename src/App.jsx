import { useState } from "react"
import Quiz from "./Quiz"
import Intro from "./Intro"

export default function App() {
    // Not learnt routing yet, will switch pages using a state
    const [page, setPage] = useState("intro")

    return (
        <main>
            {page === "intro" && <Intro setPageQuiz={() => setPage("quiz")} />}
            {page === "quiz" && <Quiz setPageIntro={() => setPage("intro")} />}
        </main>
    )
}
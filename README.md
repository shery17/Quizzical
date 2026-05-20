# Quizzical

A dynamic trivia quiz app that pulls real-time questions from an external trivia database to test your knowledge across various categories.

**Live Link:** [https://quizzical1234.netlify.app/](https://quizzical1234.netlify.app/)

---

## 🛠 Tools & Technologies Used

* **Frontend Framework:** React (JavaScript, HTML5, CSS3)
* **Build Tool & Dev Server:** Vite
* **Runtime Environment:** Node.js
* **Data Source:** [Open Trivia Database API](https://opentdb.com/api_config.php)

---

## 🚀 How to Run the Application

You can run this application locally on your machine using either standard **Node.js/NPM** or via **Docker**.

### Method 1: Standard Local Installation (Requires Node.js)

1. Ensure **Node.js** and **NPM** are installed on your computer.
2. Clone or download this repository to your machine.
3. Open the project root folder in your code editor (e.g., VS Code).
4. Open your terminal and navigate to the application directory:
   ```bash
   cd quiz-app
5. Install the required dependencies:
    ```bash
   npm install
6. Start the local Vite development server:
    ```bash
   npm run dev
7. Open your browser and navigate to the local URL displayed in your terminal (usually http://localhost:5173).

---

### Method 2: Running via Docker (Instant Environment Setup)

If you have Docker installed, you can skip manual dependency installations and boot the app inside isolated containers using either the development workspace or the optimized production image.

#### A. Run the Local Development Environment

1. Build the development image:
    ```bash
   docker build -t quizzical-dev .
2. Run the development container:
    ```bash
   docker run -p 5173:5173 quizzical-dev
3. Open your browser to: http://localhost:5173

#### B. Run the Production Build (Multi-Stage Nginx Pipeline)

1. Build the production image:
    ```bash
   docker build -f Dockerfile.prod -t quizzical-prod .
2. Run the production container:
    ```bash
   docker run -p 8080:80 quizzical-prod
3. Open your browser to: http://localhost:8080
# Quiz App

A clean, responsive Quiz App built with React + Vite. It shows one question at a time with four options, tracks score, and provides a results page with per-question breakdown. It supports loading questions from the Open Trivia DB API or a local `questions.json` file.

## Features
- One question at a time, 4 options
- Next / Previous / Finish
- Progress indicator and 30s timer (auto-locks answer)
- Score tracking and Results summary (your vs correct answer)
- Restart capability
- Local high score via localStorage
- API or Local JSON toggle
- React Router (`/quiz`, `/results`)
- Loading and error states, responsive design, accessible controls

# 1) Create the project folder and install deps
npm create vite@latest quiz-app -- --template react
cd quiz-app
# replace generated files with the ones from this repo (package.json, src/, index.html, etc.)
npm install

# 2) Run
npm run dev


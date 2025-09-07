Technical Interview Challenge: “AI-Powered Knowledge Quiz
Builder”
Objective:
You're tasked with building a basic MVP of a quiz-generating web app that
can automatically generate multiple-choice quizzes based on a
user-provided topic. The goal is to demonstrate your ability to integrate AI
into a user-facing software product.

Requirements (MVP)
● A web-based interface (CLI or GUI is fine).
● The user can input a topic (e.g., "Photosynthesis", "Neural Networks", "Ancient Rome").
● Your app uses an AI model (e.g., LLM) to generate:
○ 5 multiple-choice questions
○ Each with 4 options (A–D), with only one correct answer
● Display the questions and allow the user to select answers.
● After quiz submission, show:
○ The user’s score (e.g., 3/5 correct)
○ The correct answers

Constraints
● You can use any public AI model
● You may use any frontend/backend framework or just a CLI

● You have up to two business days to build a working prototype
● Prepare to present your approach, architecture, and tradeoffs in a 1-hour technical
interview
● This is not a design exercise – clean, modular code with sound reasoning is more
important than polish (please use basic package for components)

Technical constraints:

Frontend
Write it in Angular.js (version 19)
Serve the Angular App in /web-app of this project monorepo using Make commands and docker
Persist state using ngrx

Bonus (Not Required)
● Use retrieval to improve the factual accuracy (e.g., use Wikipedia or context injection)
● Persist quiz results or enable review
● Add feedback to the user explaining correct/incorrect answers

Database
Use Docker and make commands to serve a mysql Database

Backend
Write it in PHP Laravel
Serve the app using make commands and docker
Hook the env file to the docker database
Write seeds and migrations for the frontend quiz app
Serve with `php artisan migrate:fresh --seed` command

Result:
A frontend in Angular JS with state management
A backend api in php laravel (no blade components, just api)
A database in database
All three containerized in docker and spun up with a single `make start` command. (Do not add excess make commands out of scope from this project)

Database
MySql Database in a docker container

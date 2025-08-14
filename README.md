Dynamic Trivia Quiz App
This is a sleek, modern quiz application that pulls questions from a live API. It was built to practice and showcase core front-end web development skills using vanilla HTML, CSS, and JavaScript. The UI is inspired by modern design trends like glassmorphism and features smooth animations.

Features
Dynamic Content: Questions are fetched from the Open Trivia Database API.

Category Selection: Users can choose from four different trivia categories.

Interactive Timer: A 20-second timer adds urgency to each question.

Instant Feedback: Options are immediately highlighted as correct or incorrect.

Modern UI: A responsive, "frosted glass" design that looks great on any device.

Restart Options: Users can choose to restart the same category or pick a new one.

Tech Stack
HTML5: For the core structure and content.

CSS3: For all styling, including animations, variables, and the glassmorphism effect.

Vanilla JavaScript (ES6+): For all application logic, including API calls, DOM manipulation, and state management.

How to Run Locally
To get this project running on your machine, follow these steps.

1. Folder Structure
First, make sure your project files are organized like this:

quiz-app/
├── index.html
├── css/
│   └── style.css
└── js/
    └── main.js

2. Start a Local Server
Because this app fetches data from an external API, you can't just open the index.html file in your browser. You need to serve the files from a local server to avoid CORS (Cross-Origin Resource Sharing) errors. Here are two easy ways to do that:

Option A: VS Code Live Server

If you don't have it, install the Live Server extension from the Visual Studio Code Marketplace.

Open your quiz-app folder in VS Code.

Right-click on index.html and select "Open with Live Server".

Your browser will open automatically to the correct address.

Option B: Python's HTTP Server

Open your terminal or command prompt.

Navigate into your project folder using the cd command:

cd path/to/your/quiz-app

Run the appropriate command for your Python version:

Python 3: python -m http.server

Python 2: python -m SimpleHTTPServer

Open your browser and go to http://localhost:8000.

What I Learned from This Project
Building this quiz app was a fantastic learning experience. It started as a simple idea but grew into a project that touched on many important aspects of modern web development.

DOM Manipulation is Key: I got a lot of practice creating, adding, and changing HTML elements entirely with JavaScript. Building the question and answer buttons dynamically for each question really solidified my understanding of how to make a webpage interactive without just relying on static HTML.

Working with APIs is Fun: This was a great chance to use the fetch() API to get real data from the internet. Learning how to handle asynchronous code with async/await was crucial. It made the logic for showing a "loading" state and handling potential errors much cleaner and easier to read than it would have been with older methods.

Managing UI State: One of the biggest challenges was keeping track of what the user should be seeing at any given time. Is it the start screen? The loading spinner? A question? The final score? I learned to manage this by creating a simple showScreen() function that hides all other views and only shows the relevant one. It's like a basic version of what big frameworks like React do.

Modern CSS is Powerful: I moved beyond basic styling and dove into more advanced features. Using CSS Custom Properties (variables) for my color scheme made it incredibly easy to manage the theme. I also got to implement the "glassmorphism" effect, which involves backdrop-filter to create that cool frosted look. Adding animations with @keyframes for feedback on answers (the pulse and shake effects) made the UI feel much more alive.
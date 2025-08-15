document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        quizContainer: document.getElementById('quiz-container'),
        header: document.getElementById('header'),
        headerSubtitle: document.getElementById('header-subtitle'),
        startContainer: document.getElementById('start-container'),
        loadingContainer: document.getElementById('loading-container'),
        questionContainer: document.getElementById('question-container'),
        scoreContainer: document.getElementById('score-container'),
        errorContainer: document.getElementById('error-container'),
        categorySelection: document.getElementById('category-selection'),
        questionCounter: document.getElementById('question-counter'),
        timer: document.getElementById('timer'),
        timerBar: document.getElementById('timer-bar'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        feedback: document.getElementById('feedback'),
        finalScore: document.getElementById('final-score'),
        restartSameCategoryBtn: document.getElementById('restart-same-category-btn'),
        playAnotherCategoryBtn: document.getElementById('play-another-category-btn'),
    };

    // --- State Variables ---
    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    const TIME_LIMIT = 20;
    let timeLeft = TIME_LIMIT;
    let currentCategoryId = null;
    let currentCategoryName = null;

    const decodeHTMLEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    
    const showScreen = (screenToShow) => {
        const screens = [
            elements.startContainer,
            elements.loadingContainer,
            elements.questionContainer,
            elements.scoreContainer,
            elements.errorContainer
        ];
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
        screenToShow.classList.remove('hidden');
    };

    async function fetchQuestions(categoryId, categoryName) {
        showScreen(elements.loadingContainer);
        currentCategoryId = categoryId;
        currentCategoryName = categoryName;
        elements.headerSubtitle.textContent = `Category: ${categoryName}`;

        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            if (data.response_code !== 0) throw new Error('API returned an error.');

            quizData = data.results.map(item => {
                const options = [...item.incorrect_answers, item.correct_answer].map(decodeHTMLEntities);
                shuffleArray(options);
                return {
                    question: decodeHTMLEntities(item.question),
                    options,
                    answer: decodeHTMLEntities(item.correct_answer)
                };
            });
            
            startQuiz();
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            showScreen(elements.errorContainer);
        }
    }
    
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        showScreen(elements.questionContainer);
        displayQuestion();
    }

    function displayQuestion() {
        resetState();
        const currentQuestion = quizData[currentQuestionIndex];
        elements.questionText.textContent = currentQuestion.question;
        elements.questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizData.length}`;

        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-btn';
            button.addEventListener('click', () => handleAnswerSelection(button, option));
            elements.optionsContainer.appendChild(button);
        });
        
        startTimer();
    }

    function startTimer() {
        timeLeft = TIME_LIMIT;
        elements.timer.textContent = `${timeLeft}s`;
        elements.timerBar.style.transition = 'none';
        elements.timerBar.style.width = '100%';
        elements.timerBar.offsetHeight; 
        elements.timerBar.style.transition = `width ${TIME_LIMIT}s linear`;
        elements.timerBar.style.width = '0%';

        timerInterval = setInterval(() => {
            timeLeft--;
            elements.timer.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        elements.feedback.textContent = `Time's up! The correct answer was: ${quizData[currentQuestionIndex].answer}`;
        elements.feedback.className = 'feedback-timeout';
        disableOptions(true);
        
        // Scroll to feedback element to show the result
        elements.feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(loadNextQuestion, 2500);
    }

    function resetState() {
        clearInterval(timerInterval);
        elements.feedback.textContent = '';
        elements.optionsContainer.innerHTML = '';
    }

    function handleAnswerSelection(selectedButton, selectedOption) {
        clearInterval(timerInterval);
        elements.timerBar.style.width = elements.timerBar.style.width; // Freeze the timer bar
        const correctAnswer = quizData[currentQuestionIndex].answer;

        disableOptions();

        if (selectedOption === correctAnswer) {
            score++;
            elements.feedback.textContent = "Correct!";
            elements.feedback.className = 'feedback-correct';
            selectedButton.classList.add('correct');
        } else {
            elements.feedback.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
            elements.feedback.className = 'feedback-incorrect';
            selectedButton.classList.add('incorrect');
        }

        // Scroll to feedback element to show the result
        elements.feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(loadNextQuestion, 2500);
    }

    function disableOptions(isTimeout = false) {
        Array.from(elements.optionsContainer.children).forEach(button => {
            button.disabled = true;
            if (button.textContent === quizData[currentQuestionIndex].answer) {
                if(!button.classList.contains('incorrect')) {
                   button.classList.add('correct');
                }
            }
        });
    }

    function loadNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        showScreen(elements.scoreContainer);
        elements.finalScore.textContent = `${score}/${quizData.length}`;
    }
    
    function resetApp() {
        showScreen(elements.startContainer);
        elements.headerSubtitle.textContent = 'Choose Your Challenge';
    }

    elements.categorySelection.addEventListener('click', (e) => {
        if (e.target.matches('.category-btn')) {
            const categoryId = e.target.dataset.category;
            const categoryName = e.target.textContent.split(' ').slice(1).join(' ');
            fetchQuestions(categoryId, categoryName);
        }
    });

    elements.playAnotherCategoryBtn.addEventListener('click', resetApp);
    
    elements.restartSameCategoryBtn.addEventListener('click', () => {
        if (currentCategoryId && currentCategoryName) {
            fetchQuestions(currentCategoryId, currentCategoryName);
        }
    });
});

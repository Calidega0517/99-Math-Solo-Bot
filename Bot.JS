// Function to click the "Play" button that appears after the "Next" button
async function clickPlayButtonAfterNext() {
    const checkInterval = 1000; // Interval to check every second

    const playClicker = setInterval(() => {
        // Look for the second "Play" button that appears after clicking "Next"
        const playButton = document.querySelector('.island-page-play-btn-container .button-large.play-btn');
        
        if (playButton) {
            console.log('Clicking the second Play button...');
            playButton.click();
            clearInterval(playClicker);  // Stop checking once found and clicked
        } else {
            console.log('No second Play button found, retrying...');
        }
    }, checkInterval);
}

// Function to click the "Play" button (starting the game after level is chosen)
async function clickPlayButtonAfterLevel() {
    const checkInterval = 1000; // Interval to check every second

    const playClicker = setInterval(() => {
        // Look for the "Play" button that appears after the level is chosen
        const playButton = document.querySelector('.gs-actions-btn');
        
        if (playButton) {
            console.log('Clicking the Play button...');
            playButton.click();
            clearInterval(playClicker);  // Stop checking once found and clicked
        } else {
            console.log('No Play button found, retrying...');
        }
    }, checkInterval);
}

// Function to click the highest unlocked level
function clickHighestUnlockedLevelAndPlay() {
    const container = document.querySelector("#gs-wrapper > div.gs-body > div.gs-container");

    if (container) {
        const levels = container.querySelectorAll('.gsn-item');

        let highestUnlockedLevel = null;
        let highestLevelElement = null;

        levels.forEach((level) => {
            if (level.classList.contains('gsn-item__active')) {
                const levelIndex = parseInt(level.querySelector('.gsn-index').textContent.trim());
                
                if (highestUnlockedLevel === null || levelIndex > highestUnlockedLevel) {
                    highestUnlockedLevel = levelIndex;
                    highestLevelElement = level;
                }
            }
        });

        if (highestUnlockedLevel !== null && highestLevelElement) {
            console.log(`Clicking on the highest unlocked level: Level ${highestUnlockedLevel}`);
            highestLevelElement.click();

            // After selecting the highest unlocked level, click the "Play" button to start the game
            clickPlayButtonAfterLevel();
        } else {
            console.log('No unlocked levels found.');
        }
    } else {
        console.log('Level container not found.');
    }
}

// Function to solve math problems
function solveMathProblem(problem) {
    problem = problem.replace(/\s+/g, '');
    console.log("Solving problem:", problem);

    if (problem.includes('=')) {
        const [leftSide, rightSide] = problem.split('=');
        const result = parseFloat(rightSide);
        console.log(`Equation detected: Left Side = ${leftSide}, Right Side = ${result}`);

        const variableMatch = leftSide.match(/([a-zA-Z])\s*([+\-*/]?)\s*([0-9]+(\.[0-9]+)?)/);

        if (variableMatch) {
            const variable = variableMatch[1];
            const operator = variableMatch[2];
            const number = parseFloat(variableMatch[3]);

            if (operator === '-') {
                return result + number;
            } else if (operator === '+') {
                return result - number;
            } else {
                console.error('Unsupported operator:', operator);
                return NaN;
            }
        } else {
            console.error('Failed to parse equation:', problem);
            return NaN;
        }
    } else {
        try {
            if (/^[0-9+\-*/.()]+$/.test(problem)) {
                const result = new Function(`return ${problem}`)();
                console.log(`Arithmetic result for '${problem}': ${result}`);
                return isNaN(result) ? NaN : result;
            } else {
                console.error('Invalid characters in math problem:', problem);
                return NaN;
            }
        } catch (error) {
            console.error('Error evaluating arithmetic expression:', error);
            return NaN;
        }
    }
}

// Function to automatically solve math problems
async function autoSolve99Math() {
    const problemElement = document.querySelector('.math99-game-question-view');
    if (!problemElement) {
        console.error('Math problem element not found!');
        return false;
    }

    const problemText = problemElement.textContent.trim();
    console.log("Detected Math problem:", problemText);

    const solution = solveMathProblem(problemText);
    console.log('Calculated Solution:', solution);

    if (isNaN(solution) || solution === undefined) {
        console.error('Invalid solution:', solution);
        return false;
    }

    const answerField = document.querySelector('input[type="text"]') || document.querySelector('.c-input.box-input input');
    if (!answerField) {
        console.error('Answer input field not found!');
        return false;
    }

    answerField.value = solution.toString();
    answerField.dispatchEvent(new Event('input', { bubbles: true }));

    setTimeout(() => {
        const submitButton = document.querySelector('.button__submit');
        if (submitButton) {
            console.log('Clicking submit button...');
            submitButton.click();
        } else {
            console.error('Submit button not found!');
        }
    }, 1000);

    return true;
}

// Function to click the "Continue" button until found
async function clickContinueButtonUntilFound() {
    const interval = setInterval(() => {
        const continueButton = document.querySelector('.button-large.rewards-view-next-btn') ||
                               document.querySelector('button:contains("CONTINUE")');
        if (continueButton) {
            console.log('Clicking Continue button...');
            continueButton.click();
            clearInterval(interval);
        }
    }, 1000);
}

// Function to click the "NEXT" button when found
async function clickNextButtonUntilFound() {
    const checkInterval = 1000;

    const nextClicker = setInterval(() => {
        const nextButton = document.querySelector('.c-home-game-end--content-wrap__btn-container .button-large.btn-continue') ||
                           Array.from(document.querySelectorAll('.text-wrapper span')).find(span => span.textContent.trim() === 'NEXT');

        if (nextButton) {
            console.log('Clicking Next button...');
            nextButton.click();
            clearInterval(nextClicker);
        } else {
            console.log('Next button not found, retrying...');
        }
    }, checkInterval);
}

// Main function to keep solving math problems and progressing through the game
async function startGame() {
    // Start the loop by clicking the highest unlocked level and starting the game
    clickHighestUnlockedLevelAndPlay();

    // Infinite loop to solve math problems and progress through the game
    while (true) {
        // Solve the current math problem
        await autoSolve99Math();

        // Wait for a short duration before proceeding
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Click the "Continue" button if found
        await clickContinueButtonUntilFound();

        // Wait before clicking the "Next" button
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Click the "Next" button
        await clickNextButtonUntilFound();

        // After clicking "Next", wait for the "Play" button to appear and click it
        await clickPlayButtonAfterNext();

        // Wait before repeating the entire loop cycle
        await new Promise(resolve => setTimeout(resolve, 3000));

        // At the end of each cycle, go back and click the highest unlocked level again
        clickHighestUnlockedLevelAndPlay();
    }
}

// Start solving math problems and clicking buttons, with a 3-second delay to wait for page content
setTimeout(startGame, 3000);

// Function to solve math problems (addition, subtraction, multiplication, division, decimals)
function solveMathProblem(problem) {
    // Clean up the problem: remove spaces, commas, and other unwanted characters
    problem = problem.replace(/\s+/g, '').replace(/,/g, '');

    // Handle the case where 'x' is used for multiplication instead of '*' (e.g., '12 x 7')
    problem = problem.replace(/x/g, '*');  // Replace 'x' with '*' for multiplication

    // Validate that the problem contains only valid characters (digits, operators, and decimal points)
    if (!/^[\d+\-*/().]+$/.test(problem)) {
        console.error('Invalid math problem format:', problem);
        return NaN;
    }

    try {
        // Use the Function constructor to evaluate the expression safely
        const result = new Function(`return ${problem}`)();
        
        // Check if the result is a valid number
        if (isNaN(result)) {
            console.error('Invalid calculation result:', result);
            return NaN;
        }

        return result;
    } catch (error) {
        console.error('Error solving the math problem:', error);
        return NaN;
    }
}

// Function to automate solving the math problem on the page
async function autoSolve99Math() {
    const problemElement = document.querySelector('.math99-game-question-view');
    if (!problemElement) {
        console.error('Math problem element not found!');
        return false;
    }

    const problemText = problemElement.textContent.trim();
    console.log("Math problem:", problemText);
    
    const solution = solveMathProblem(problemText);
    console.log('Solution:', solution);

    const answerField = document.querySelector('input[type="text"]');
    if (!answerField) {
        console.error('Answer input field not found!');
        return false;
    }

    answerField.value = solution.toString().trim();
    const inputEvent = new Event('input', { bubbles: true });
    answerField.dispatchEvent(inputEvent);

    setTimeout(() => {
        const submitButton = document.querySelector('.button__submit');
        if (submitButton) {
            submitButton.click();
        } else {
            console.error('Submit button not found!');
        }
    }, 2000);

    return true;
}

// Function to click the "Start Play" button (button at the start of the level)
function clickStartPlayButton() {
    const playButton = document.querySelector('.gs-actions-btn');
    if (playButton) {
        console.log('Clicking the Start Play button');
        playButton.click();
    } else {
        console.log('Start Play button not found.');
    }
}

// Function to click the "End Play" button (button at the end of the level)
async function clickEndPlayButton() {
    const playButton = document.querySelector('.button-large.play-btn');
    if (playButton) {
        console.log('Clicking the End Play button');
        playButton.click();
    } else {
        console.log('End Play button not found, retrying...');
        // Retry after 2 seconds if the button wasn't found initially
        setTimeout(clickEndPlayButton, 2000);
    }
}

// Function to continuously check and click the "Continue" button until it is found
async function clickContinueButtonUntilFound() {
    const checkInterval = 1000;

    const continueClicker = setInterval(() => {
        const continueButton = document.querySelector('.button-large.rewards-view-next-btn') || 
                               document.querySelector('button:contains("CONTINUE")') ||
                               Array.from(document.querySelectorAll('.text-wrapper span')).find(span => span.textContent.trim() === 'CONTINUE') ||
                               document.querySelector('button[data-v-4f19ca64]');

        if (continueButton) {
            console.log('Clicking Continue...');
            continueButton.click();
            clearInterval(continueClicker);
        } else {
            console.log('Continue button not found, retrying...');
        }
    }, checkInterval);
}

// Function to continuously check and click the "Next" button until it is found
async function clickNextButtonUntilFound() {
    const checkInterval = 1000;

    const nextClicker = setInterval(() => {
        const nextButton = document.querySelector('.button-large.btn-continue') || 
                           Array.from(document.querySelectorAll('.text-wrapper span')).find(span => span.textContent.trim() === 'NEXT');

        if (nextButton) {
            console.log('Clicking Next...');
            nextButton.click();
            clearInterval(nextClicker);
        } else {
            console.log('Next button not found, retrying...');
        }
    }, checkInterval);
}

// Function to keep solving problems until the game ends
async function keepSolving() {
    let problemSolved = true;

    while (problemSolved) {
        const problemElement = document.querySelector('.math99-game-question-view');
        if (!problemElement) {
            console.log('Game ended or problem element not found!');
            break;
        }

        problemSolved = await autoSolve99Math();
        if (!problemSolved) {
            console.log('Problem could not be solved.');
            break;
        }

        await clickContinueButtonUntilFound();

        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before clicking the next button

        await clickNextButtonUntilFound();

        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before the next loop iteration
    }
}

// Function to click the highest unlocked level and start the game
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

            // Click the Start Play button after selecting the level
            clickStartPlayButton();
        } else {
            console.log('No unlocked levels found.');
        }
    } else {
        console.log('Level container not found.');
    }
}

// Function to start the game and keep it running in an infinite loop
async function startGame() {
    while (true) {
        // First, click the highest unlocked level and then click the Start Play button
        clickHighestUnlockedLevelAndPlay();

        // Start solving math problems immediately
        await keepSolving();

        // After finishing the problems, click the End Play button to continue or complete the game
        await clickEndPlayButton();

        // Wait before repeating the cycle, to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust time between loops if necessary
    }
}

// Start the process with a delay to allow page content to load
setTimeout(startGame, 3000); // Delay of 3 seconds to wait for page content to load

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let aiEnabled = false;

// Win patterns
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const aiToggle = document.getElementById('aiToggle');
const modeText = document.getElementById('modeText');

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
aiToggle.addEventListener('click', toggleAI);

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);

    // Ignore if cell already filled or game over
    if (board[index] !== '' || !gameActive) return;

    // Player move
    board[index] = 'X';
    updateBoard();

    if (checkWinner('X')) {
        statusDisplay.textContent = '🎉 Player X Wins!';
        gameActive = false;
        return;
    }

    if (isBoardFull()) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    // AI move (if enabled)
    if (aiEnabled) {
        currentPlayer = 'O';
        statusDisplay.textContent = "AI is thinking...";
        setTimeout(() => {
            makeAIMove();
            updateBoard();

            if (checkWinner('O')) {
                statusDisplay.textContent = '🤖 AI Wins!';
                gameActive = false;
                return;
            }

            if (isBoardFull()) {
                statusDisplay.textContent = "It's a Draw!";
                gameActive = false;
                return;
            }

            currentPlayer = 'X';
            statusDisplay.textContent = "Player X's Turn";
        }, 500);
    } else {
        // Switch to O (human vs human)
        currentPlayer = 'O';
        statusDisplay.textContent = "Player O's Turn";
    }
}

function makeAIMove() {
    // Simple AI: prioritize center, corners, then sides
    // Try to win
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner('O')) {
                return;
            }
            board[i] = '';
        }
    }

    // Block player
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinner('X')) {
                board[i] = 'O';
                return;
            }
            board[i] = '';
        }
    }

    // Prefer center
    if (board[4] === '') {
        board[4] = 'O';
        return;
    }

    // Prefer corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
        board[availableCorners[Math.floor(Math.random() * availableCorners.length)]] = 'O';
        return;
    }

    // Take any available space
    const available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (available.length > 0) {
        board[available[Math.floor(Math.random() * available.length)]] = 'O';
    }
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.classList.remove('x', 'o');
        if (board[index] === 'X') {
            cell.classList.add('x');
        } else if (board[index] === 'O') {
            cell.classList.add('o');
        }
    });
}

function checkWinner(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    updateBoard();
    
    if (aiEnabled) {
        statusDisplay.textContent = "Player X's Turn";
    } else {
        statusDisplay.textContent = "Player X's Turn";
    }
}

function toggleAI() {
    aiEnabled = !aiEnabled;
    aiToggle.classList.toggle('active', aiEnabled);
    modeText.textContent = aiEnabled ? 'AI Mode' : 'Two Player Mode';
    resetGame();
}

// Initialize board display
updateBoard();
statusDisplay.textContent = "Player X's Turn";

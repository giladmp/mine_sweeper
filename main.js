'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gTimer
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    clearInterval(gTimer)
    gGame.secsPassed = 0
    renderTimer()
    gGame.isOn = true
    gGame.markedCount = gLevel.mines
    renderFlagsCounter()
    buildBoard(gLevel.size, gLevel.mines)
    renderBoard(gBoard)
}

function buildBoard(size, mines) {
    var board = []
    for (var i = 0; i < size; i++) {
        var row = []
        board.push(row)
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i].push(cell)
        }
    }
    generateMines(board, mines)
    setMinesNegsCount(board)
    gBoard = board
}

function generateMines(board, mines) {
    var minesCounter = 0
    while (minesCounter < mines) {
        var i = Math.floor(Math.random() * board.length)
        var j = Math.floor(Math.random() * board.length)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesCounter++
        }
    }
    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                var minesNegsCount = null
                if (j !== (board[i].length - 1) && board[i][j + 1].isMine) minesNegsCount++
                if (i !== (board.length - 1) && (j !== board[i].length - 1) && board[i + 1][j + 1].isMine) minesNegsCount++
                if (i !== (board[i].length - 1) && board[i + 1][j].isMine) minesNegsCount++
                if (i !== (board.length - 1) && j !== 0 && board[i + 1][j - 1].isMine) minesNegsCount++
                if (j !== 0 && board[i][j - 1].isMine) minesNegsCount++
                if (j !== 0 && i !== 0 && board[i - 1][j - 1].isMine) minesNegsCount++
                if (i !== 0 && board[i - 1][j].isMine) minesNegsCount++
                if (i !== 0 && j !== (board[i].length - 1) && board[i - 1][j + 1].isMine) minesNegsCount++
                board[i][j].minesAroundCount = minesNegsCount
            }
        }
    }
    return board
}

function renderBoard(board) {
    var elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = ''
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var elCell = document.createElement('div')
            elCell.classList.add('cell')
            elCell.setAttribute('id', `${i}-${j}`)
            elCell.addEventListener('click', () => { cellClicked(event.target.id) })
            elCell.addEventListener('contextmenu', () => { cellRightClicked(event) })
            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    elCell.innerText = MINE
                }
                if (board[i][j].minesAroundCount > 0) {
                    elCell.innerText = board[i][j].minesAroundCount
                }
            }
            if (board[i][j].isShown && !board[i][j].minesAroundCount && !board[i][j].isMine) {
                elCell.classList.add('empty')
            }
            if (board[i][j].isMarked) {
                elCell.innerText = FLAG
            }
            elBoard.appendChild(elCell)
        }
    }
}

function cellClicked(cellId) {
    var cellCoords = cellId.split('-')
    var cell = gBoard[cellCoords[0]][cellCoords[1]]
    if (!gGame.isOn) {
        return
    } else if (gGame.isOn) {
        //start timer
        startTimer()
        //show cell
        if (!cell.isShown && !cell.isMarked) {
            cell.isShown = true
        }
    }
    if (cell.isMine && !cell.isMarked) {
        clearInterval(gTimer)
        console.log('Game Over')
        gGame.isOn = false
    }
    checkGameOver()
    renderBoard(gBoard)
}

function cellRightClicked(event) {
    event.preventDefault()
    if (!gGame.isOn) {
        return
    } else if (gGame.isOn) {
        startTimer()
        var cellCoords = event.target.id.split('-')
        var cell = gBoard[cellCoords[0]][cellCoords[1]]
        if (!cell.isMarked && !cell.isShown) {
            cell.isMarked = true
            gGame.markedCount--
            renderFlagsCounter()
            renderBoard(gBoard)
        } else if (cell.isMarked && !cell.isShown) {
            cell.isMarked = false
            gGame.markedCount++
            renderFlagsCounter()
            renderBoard(gBoard)
        }
        checkGameOver()
    }
}

function renderFlagsCounter() {
    var elCounter = document.querySelector('.flags-counter')
    var flagsStr = gGame.markedCount.toString()
    var paddedStr = flagsStr.padStart(2, '0')
    elCounter.innerText = paddedStr
}

function renderTimer() {
    var elTimer = document.querySelector('.timer')
    var timerStr = gGame.secsPassed.toString()
    var paddedStr = timerStr.padStart(3, '0')
    elTimer.innerText = paddedStr
}

function checkGameOver() {
    var minesNotMarked = gLevel.mines
    var nonMinesNotRevealed = gLevel.size ** 2 - gLevel.mines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine && cell.isMarked) {
                minesNotMarked--
            }
            if (!cell.isMine && cell.isShown) {
                nonMinesNotRevealed--
            }
        }
    }
    if (minesNotMarked === 0 && nonMinesNotRevealed === 0) {
        clearInterval(gTimer)
        console.log('You Win!')
        gGame.isOn = false
    }
}

function startTimer() {
    if (!gGame.secsPassed) {
        gGame.secsPassed++
        renderTimer()
        gTimer = setInterval(() => {
            gGame.secsPassed++
            renderTimer()
        }, 1000)
    }
}

function expandShown(board, elCell, i, j) { }
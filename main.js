'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gTimer
var gLevel = {
    size: 4,
    mines: 6
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
    buildBoard(gLevel.size)
    renderBoard(gBoard)
}

function buildBoard(size) {
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
    gBoard = board
}

function generateMines(coords) {
    var minesCounter = 0
    while (minesCounter < gLevel.mines) {
        var i = Math.floor(Math.random() * gBoard.length)
        var j = Math.floor(Math.random() * gBoard.length)
        if (i === coords[0] && j === coords[1]) continue
        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true
            minesCounter++
        }
        
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine) {
                var minesNegsCount = null
                if (j !== (gBoard[i].length - 1) && gBoard[i][j + 1].isMine) minesNegsCount++
                if (i !== (gBoard.length - 1) && (j !== gBoard[i].length - 1) && gBoard[i + 1][j + 1].isMine) minesNegsCount++
                if (i !== (gBoard[i].length - 1) && gBoard[i + 1][j].isMine) minesNegsCount++
                if (i !== (gBoard.length - 1) && j !== 0 && gBoard[i + 1][j - 1].isMine) minesNegsCount++
                if (j !== 0 && gBoard[i][j - 1].isMine) minesNegsCount++
                if (j !== 0 && i !== 0 && gBoard[i - 1][j - 1].isMine) minesNegsCount++
                if (i !== 0 && gBoard[i - 1][j].isMine) minesNegsCount++
                if (i !== 0 && j !== (gBoard[i].length - 1) && gBoard[i - 1][j + 1].isMine) minesNegsCount++
                gBoard[i][j].minesAroundCount = minesNegsCount
            }
        }
    }
}

function renderBoard(board) {
    var elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = ''
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var elCell = document.createElement('div')
            elCell.classList.add('cell')
            elCell.setAttribute('id', `${i}-${j}`)
            elCell.addEventListener('click', () => { cellClicked(getCoords(event.target.id)) })
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

function cellClicked(coords) {
    var cell = gBoard[coords[0]][coords[1]]
    if (!gGame.isOn) {
        return
    } else if (gGame.isOn) {
        if (!gGame.secsPassed) {
            generateMines(coords)
            setMinesNegsCount()
            startTimer()
        }
        if (!cell.isShown && !cell.isMarked) {
            cell.isShown = true
            if (!cell.minesAroundCount && !cell.isMine) {
                expandShown(coords)
            }
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
        if (!gGame.secsPassed) {
            startTimer()
        }
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
    gGame.secsPassed++
    renderTimer()
    gTimer = setInterval(() => {
        gGame.secsPassed++
        renderTimer()
    }, 1000)

}

function getCoords(id) {
    var coords = id.split('-')
    coords[0] = +coords[0]
    coords[1] = +coords[1]
    return coords
}

function expandShown(coords) {
    setTimeout(() => {
        if (coords[0] !== 0 && coords[1] !== 0) {
            cellClicked([coords[0] - 1, coords[1] - 1])
        }
        if (coords[0] !== 0) {
            cellClicked([coords[0] - 1, coords[1]])
        }
        if (coords[0] !== 0 && coords[1] !== gBoard.length - 1) {
            cellClicked([coords[0] - 1, coords[1] + 1])
        }
        if (coords[1] !== gBoard.length - 1) {
            cellClicked([coords[0], coords[1] + 1])
        }
        if (coords[0] !== gBoard.length - 1 && coords[1] !== gBoard.length - 1) {
            cellClicked([coords[0] + 1, coords[1] + 1])
        }
        if (coords[0] !== gBoard.length - 1) {
            cellClicked([coords[0] + 1, coords[1]])
        }
        if (coords[0] !== gBoard.length - 1 && coords[1] !== 0) {
            cellClicked([coords[0] + 1, coords[1] - 1])
        }
        if (coords[1] !== 0) {
            cellClicked([coords[0], coords[1] - 1])
        }
    }, 50)
}


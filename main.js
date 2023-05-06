'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel = {
    size: 4,
    mines: 2
}
var gGame


function initGame() {
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
    generateMines(board)
    setMinesNegsCount(board)
    console.table(board)
    gBoard = board
}

function generateMines(board) {
    var minesCounter = 0
    while (minesCounter < gLevel.mines) {
        var i = Math.floor(Math.random() * gLevel.size) 
        var j = Math.floor(Math.random() * gLevel.size)
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
        for (var j = 0; j < board.length; j++) {
            var elCell = document.createElement('div')
            elCell.classList.add('cell')
            elCell.setAttribute('id', `${i}-${j}`)
            elCell.addEventListener('click', () => {cellClicked(event.target.id)})
            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    elCell.innerText = MINE
                }
                if (board[i][j].isMarked) {
                    elCell.innerText = FLAG
                }
                if (board[i][j].minesAroundCount > 0) {
                    elCell.innerText = board[i][j].minesAroundCount
                }
            }
            elBoard.appendChild(elCell)
        }
    }
}

function cellClicked(id) {
    var coords = id.split('-')
    if (!gBoard[coords[0]][coords[1].isShown]) {
        gBoard[coords[0]][coords[1]].isShown = true
    }
    renderBoard(gBoard)
}

function cellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elCell, i, j) { }
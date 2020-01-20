const x_class = "x";
const circle_class = "circle"
const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6],

]
const cellElem = document.querySelectorAll('[data-cell]')
// const cellElem = $('data-cell')


const board = $('#board')
const restartButton = $('#restartButton')

const winningMesessageElement = document.getElementById('winningMesessage')
const winningMesessageTextElement = document.querySelector('[data-winner-messege-text]')
let circleTurn



restartButton.on('click', startGame)

function startGame() {
  circleTurn = false;
  cellElem.forEach(cell => {
    cell.classList.remove(x_class)
    cell.classList.remove(circle_class)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, {once: true})
  })
  setBoardHoverClass()
  winningMesessageElement.classList.remove('show')
}

startGame();

function handleClick(e){
  const cell = e.target
  const currentClass = circleTurn ? circle_class : x_class
  placeMark(cell, currentClass)
  if (checkWin(currentClass)){
    endGame(false)
  }else if(isDraw()){
    endGame(true)
  }else{
    swapTurns()
    setBoardHoverClass()
  }
}

function endGame(draw) {
  if(draw){
    winningMesessageTextElement.innerText = 'Draw!'
  }else{
    winningMesessageTextElement.innerText = (circleTurn ? "O's" : "X's")+  " win!"
  }
  winningMesessageElement.classList.add('show')
}

function isDraw() {
  return [...cellElem].every(cell => {
    return cell.classList.contains(x_class) || cell.classList.contains(circle_class)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}
function swapTurns() {
  circleTurn = !circleTurn;
}
function setBoardHoverClass() {
  board.removeClass(x_class);
  board.removeClass(circle_class);
  if(circleTurn){
    board.addClass(circle_class)
  }else{
    board.addClass(x_class)
  }
}
function checkWin(currentClass) {
  return winningCombinations.some(combinations =>{
    return combinations.every(index => {
      return cellElem[index].classList.contains(currentClass)
    })
  })
}

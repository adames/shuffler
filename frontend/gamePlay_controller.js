$(function(){
  gameSetup()
})

let selected = "tile0"

function gameSetup(){
  Render.hideGame()
  let imgs = Adapter.getImages()
  imgs.then(res => Render.displayImages(res))
}
function selectImage(){
  $('#imageIndex').on('click', function(event){
    var imageID = parseInt(event.target.id.replace("image", ""))
    let username = $('#username').val()
    username === "" ? username = "Guest" : username
    startGame(imageID, username)
  })
}

function startGame(imageID, username){
  let userJSON = Adapter.postUser(username, imageID)
  userJSON.then(res => {
  store.users.push(res)
  return res
  })
  .then((res)=> Adapter.postGame(imageID, res)
  .then(res => {store.games.push(res)})
  .then(()=> showGame(imageID)))
}

function showGame(id){
  $('table').show()
  Render.removeStart()
  tileEvent()

  let imageJSON = Adapter.getImage(id)
  imageJSON.then(function(res){
    store.images.push(res)
    return res
  })
  .then(()=> Render.showImage())
}


function tileEvent(){
  $('.tile').on('click', function(event){
    makeMove()
  })
}

function validMove(first, second){
  let firstParent = first.parentElement
  let secondParent = second.parentElement
  let val = parseInt(firstParent.id.replace("space", ""))
  let val2 = parseInt(secondParent.id.replace("space", ""))
  let eventId =  parseInt(event.target.parentElement.id.replace("space", ""))
  let availableTiles = []
  if(val % 3 !== 0){
    availableTiles.push(val + 1)
  }
  if(val % 3 !== 1){
    availableTiles.push(val - 1)
  }
  availableTiles.push(val - 3)
  availableTiles.push(val + 3)

  if(availableTiles.includes(val2)){
    return true
  }else {
    return false
  }
}

function makeMove(){
  if(selected === 'tile0'){
    selected = `${event.target.parentElement.id}`
    event.target.className = "tile z-depth-5"
    event.target.style.width = "160px"
    event.target.style.height = "160px"
    // event.target.style.borderColor = 'blue'
  }else if(selected !== 'tile0'){
    swapDOM()
    selected = 'tile0'
  }
}

function checkSolution(){
  let gameObj = store.games[store.games.length - 1]
  let imgID = gameObj.image_id
  let solution = store.images.filter((image) => image.id === imgID)[0]
  // ^^ needs to be refactored into controller function ^^
  let userTiles = $('.tile')
  let counter = 0
  for(var i = 0; i < userTiles.length - 1; i++) {
    if(eval(`solution.tile${i+1}`) === userTiles[i].src){
      console.log('correct position')
      counter++
    }else {
      counter = 0
      console.log('not correct position')
    }
  }
  if(counter === 8 && $('#space9')[0].children[0].style.backgroundColor === "black"){
    finishGame()
  }
}

function finishGame(){
  store.users[store.users.length - 1].wins++
  Adapter.postDbUpdate()
  $('table').fadeToggle(500)
  $('#game_finish').delay(500).fadeToggle(500)
  restartGame()
  store = {games: [], images: [], users: []}
}

function restartGame(){
  $("#restart").on('click', function(){
    window.location.reload(true)
  })
}

function swapDOM(){
  let firstSelected = $(`#${selected}`)[0].children[0]
  let secondSelected = event.target
  let firstParent = $(`#${selected}`)[0]
  let secondParent = event.target.parentElement
  if(validMove(firstSelected, secondSelected)){
    firstParent.append(secondSelected)
    secondParent.append(firstSelected)
    store.games[store.games.length - 1].moves++
  }else {
    console.log('Invalid Move: nah brahhh')
  }
  firstSelected.className = 'tile'
  secondSelected.className = 'tile'
  firstSelected.style.width = '150px'
  firstSelected.style.height = '150px'
  secondSelected.style.width = '150px'
  secondSelected.style.height = '150px'
  checkSolution()
}

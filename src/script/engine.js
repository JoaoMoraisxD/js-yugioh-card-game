const state = {
    score:{
        playerScore: 0,
        computerScore:0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprits:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    action: {
        button: document.getElementById('next-duel')
    }
};

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards'
}

const pathImages= "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img:  `${pathImages}dragon.png`,
        winOf: [1],
        LoseOf: [2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img:  `${pathImages}magician.png`,
        winOf: [2],
        LoseOf: [0]
    },
    {
        id:0,
        name: "Exodia",
        type: "Scissors",
        img:  `${pathImages}exodia.png`,
        winOf: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fielside) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', IdCard);
    cardImage.classList.add('card');

    if(fielside === playerSides.player1) {
        cardImage.addEventListener('mouseover', ( )=> {
            drawSelectCard(IdCard)
        })
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });
    }

    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId ();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.cardSprits.avatar.src = '';
    state.cardSprits.name.innerText = '';
    state.cardSprits.type.innerText = '';

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await DrawButton(duelResults);

}

async function DrawButton(text){
    state.action.button.innerText = text;
    state.action.button.style.display = 'block';
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore}  |  Lose ${state.score.computerScore}`;
}

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResults = 'DRAW';
    let playerCard = cardData[playerCardId];
    
    if(playerCard.winOf.includes(computerCardId)){
        duelResults = 'Win';
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults
}

async function removeAllCardsImages() {
    let cards = document.querySelector('#computer-cards');
    let imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector('#player-cards');
    imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprits.avatar.src =cardData[index].img;
    state.cardSprits.name.innerText = cardData[index].name;
    state.cardSprits.type.innerText = `Attribute: ${cardData[index].type}`
}

async function drawCards (cardNumber, fielside){
    for(let i = 0; i < cardNumber; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fielside)
        document.getElementById(fielside).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprits.avatar.src = '';
    state.action.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init()

}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
   
   try{
    audio.play();
   } catch {}
}

function init(){
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    const bgm = document.getElementById('bgm')
    bgm.play();
}

init();
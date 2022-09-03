// Start Game
let LosePlayAgainBtn = document.querySelector(".lose-screen button");
let winPlayAgainBtn = document.querySelector(".win-screen button");
let score = document.querySelector(".lose-screen .score span");
let tries = document.querySelector(".wrong-tries span");
let highestScore = document.querySelector(".highest-score .score");
let timeNeededLocalStorage = localStorage.getItem("time-needed");
let userNameLocalStorage = localStorage.getItem("playerName");
let wrongTriesNum = 10;
let scoreNum = 0;
let timeNeeded;
let timer = 60000;
document.querySelector(".splash-screen button").onclick = function () {
	let userName = prompt("Enter your name");
	if (userName == "" || userName == null) {
		userName = "Unknown";
	}
	document.querySelector(".name span").innerHTML = userName;
	this.parentElement.remove();

	preStart();

	setTimeout(function () {
		let checkingInterval = setInterval(() => {
			timer -= 1000;
			if (scoreNum == 10) {
				document.querySelector(".win-screen").style.display = "block";
				endGame(winPlayAgainBtn);
				handleTimer();
				localStorage.setItem("time-needed", timeNeeded);
				localStorage.setItem("playerName", userName);
				CheckHighestScore();
				document.getElementById("winning").play();
				clearInterval(checkingInterval);
			} else if (timer == 0 || wrongTriesNum == 0) {
				document.querySelector(".lose-screen").style.display = "block";
				endGame(LosePlayAgainBtn);
				CheckHighestScore();
				document.getElementById("lose").play();
				clearInterval(checkingInterval);
			}
		}, 1000);
	}, 5000);
};
function endGame(btn) {
	score.innerHTML = scoreNum;
	btn.addEventListener("click", function () {
		window.location.reload();
	});
}
function handleTimer() {
	let secondSpan = document.querySelector(".player-info .timer .second");
	let seconds = timer / 1000;
	let timerInterval = setInterval(() => {
		if (scoreNum == 10) {
			timeNeeded = +seconds;
			clearInterval(timerInterval);
			return;
		} else {
			seconds--;
			seconds = seconds > 9 ? seconds : `0${seconds}`;
			secondSpan.innerHTML = seconds;
		}
	}, 1000);
}
function preStart() {
	cards.forEach((ele) => {
		ele.classList.add("pre-start");
		cardsContainer.classList.add("no-clicking");
		setTimeout(() => {
			handleTimer();
			ele.classList.remove("pre-start");
			cardsContainer.classList.remove("no-clicking");
		}, 5000);
	});
}
//Variables
let cardsContainer = document.querySelector(".game-container .cards-box");
let cards = Array.from(cardsContainer.children);
let orderRng = [...Array(cards.length).keys()];
let duration = 700;

shuffle(orderRng);

cards.forEach((card, index) => {
	card.style.order = orderRng[index];
	card.classList.remove("pre-start");
	card.addEventListener("click", function () {
		flipBlock(card);
	});
});

function flipBlock(clickedBlock) {
	clickedBlock.classList.add("flipped");

	let allFlippedCards = cards.filter((flippedBlock) =>
		flippedBlock.classList.contains("flipped")
	);
	if (allFlippedCards.length == 2) {
		//stop clicking function
		stopClicking();

		// check matching function
		checkMatchedCards(allFlippedCards[0], allFlippedCards[1]);
	}
}
function stopClicking() {
	cardsContainer.classList.add("no-clicking");
	setTimeout(function () {
		cardsContainer.classList.remove("no-clicking");
	}, duration);
}
function checkMatchedCards(firstBlock, secBlock) {
	if (firstBlock.dataset.image == secBlock.dataset.image) {
		firstBlock.classList.remove("flipped");
		secBlock.classList.remove("flipped");

		firstBlock.classList.add("matched");
		secBlock.classList.add("matched");
		scoreNum++;
		document.getElementById("success").play();
	} else {
		setTimeout(() => {
			wrongTriesNum--;
			tries.innerHTML = wrongTriesNum;

			firstBlock.classList.remove("flipped");
			secBlock.classList.remove("flipped");

			document.getElementById("fail").play();
		}, duration);
	}
}
function shuffle(arr) {
	let current = arr.length;
	let random;
	let temp;
	while (current > 0) {
		random = Math.floor(Math.random() * current);
		current--;
		temp = arr[current];
		arr[current] = arr[random];
		arr[random] = temp;
	}
	return arr;
}
function CheckHighestScore() {
	if (timeNeededLocalStorage !== null && userNameLocalStorage !== null) {
		if (+highestScore.innerHTML < +timeNeededLocalStorage) {
			highestScore.innerHTML = +timeNeededLocalStorage;
			highestScore.parentElement.querySelector(".name").innerHTML =
				userNameLocalStorage;
		}
	} else {
		highestScore.innerHTML = "0";
		highestScore.parentElement.querySelector(".name").innerHTML =
			"Play to bright your name!";
	}
}
window.onload = CheckHighestScore();
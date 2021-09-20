let player1;
let player2;

const Player = (name, isPlayer, mark) => {
    let score = 0;
    const getName = () => name;
    const getIsPlayer = () => isPlayer;
    const getMark = () => mark;
    const getScore = () => score;

    const placeMark = (gameBoard, box, index) => {
        gameBoard[index] = mark;
        box.textContent = mark;
        if(mark === "X") box.style.color = "rgb(42, 141, 233)";
        else box.style.color = "rgb(199, 37, 8)";
    }

    const updateScore = () => {
        if(gameBoard.getNeedChangeScore()) score++;
    }
    
    return {getName, getIsPlayer, getMark, placeMark, getScore, updateScore}
}

let gameBoard = (() => {
    let gameBoard = [];
    let gridBox = [...document.getElementsByClassName("grid-box")];
    let turnDisplay = document.getElementById("turn-display");
    let restartBtns = document.getElementById("restart-btns-container");
    let isGameOver = false;
    let isTieGame = false;
    let isP1Turn = true;
    let needChangeScore = false;
    let markedBox;
    let isTesting = false;
    let gameStatus;

    const getNeedChangeScore = () => needChangeScore;

    gridBox.forEach((box,index) => {
        box.setAttribute("data-arrPos", index);
    })

    function checkForWin(board) {
        let i1;
        let i2;
        let i3;
        let index = markedBox;

        function checkFor3() {
            if(board[i1] === player1.getMark() && board[i2] === player1.getMark() && board[i3] === player1.getMark() 
                || board[i1] === player2.getMark() && board[i2] === player2.getMark() && board[i3] ===  player2.getMark()) {
                if(!isTesting) {
                    isGameOver = true;  
                    textShadow = `0 0 60px ${gridBox[i1].style.color}`;
                    gridBox[i1].style.textShadow = textShadow;
                    gridBox[i2].style.textShadow = textShadow;
                    gridBox[i3].style.textShadow = textShadow; 
                }
                else {
                    gameStatus = "win";
                }
            }
        }

        function checkForHorizontalWin() {
            if(index % 3 === 0) {
                i1 = index;
                i2 = index+1;
                i3 = index+2;
            }
            else if(index % 3 === 1) {
                i1 = index - 1;
                i2 = index;
                i3 = index+1;
            }
            else {
                i1 = index - 2;
                i2 = index - 1;
                i3 = index;
            }
            checkFor3();
        }
        function checkForVerticalWin() {
            if(index < 3) {
                i1 = index;
                i2 = index+3;
                i3 = index+6;
            }
            else if (index < 6) {
                i1 = index - 3;
                i2 = index;
                i3 = index + 3;
            }
            else {
                i1 = index - 6;
                i2 = index - 3;
                i3 = index;
            }
            checkFor3();
        }
        function checkForDiagonalWin() {
            if(index === 0 || index === 4 || index === 8) {
                i1 = 0;
                i2 = 4;
                i3 = 8;
                checkFor3();
            }
            if(index === 2 || index === 4 || index === 6) {
                i1 = 2;
                i2 = 4;
                i3 = 6;
                checkFor3();
            }
        }
        checkForHorizontalWin();
        if(!isGameOver)checkForVerticalWin();
        if(!isGameOver)checkForDiagonalWin();
    }

    function checkForTie(board) {
        let remainingBoxes = board.filter(box => {
            return box === "";
        })
        if (remainingBoxes.length === 0) {
            if(!isTesting) {
                isGameOver = true;
                isTieGame = true;
            }
            else gameStatus = "tie";
        }
    }

    function showEndResults(player) {
        restartBtns.style.display = "block";
        if(!isTieGame) {
            turnDisplay.textContent = `${player.getName()} is the winner!`;
            needChangeScore = true;
            player.updateScore();
            needChangeScore = false;
            if(player === player1) document.getElementById("player1-score").textContent = player1.getScore();
            else document.getElementById("player2-score").textContent = player2.getScore();
        }
        else turnDisplay.textContent = "Tied game!";
    }

    function getMoveImmediateConsequence(board, player) {
        checkForTie(board);
        checkForWin(board);
        if(gameStatus === "win") {
            gameStatus = null;
            return 10;
        }
        else if (gameStatus === "tie") {
            gameStatus = null;
            return 0;
        }
        else {  
            let bestScore = Infinity;
            board.forEach((box, index) => {
                if(board[index] === "") {
                    board[index] = player.getMark();
                    markedBox = index;
                    checkForWin(board);
                    if(gameStatus === "win") {
                        gameStatus = null;
                        score = -10;
                    }
                    else score = 0;
                    board[index] = "";
                    bestScore = Math.min(bestScore, score);
                }
            });
            return bestScore;
        }
    }

    function getGoodMove(board, player) {
        let score;
        let goodMove;
        let otherPlayer = findOtherPlayer(player);
        let bestScore = -Infinity;
        board.forEach((box, index) => {
            if(board[index] === "") {
                board[index] = player.getMark();
                markedBox = index;
                score = getMoveImmediateConsequence(board, otherPlayer);
                board[index] = "";
                if(score > bestScore) {
                    bestScore = score;
                    goodMove = index;
                }
            }
        });
        return goodMove;
    }

    function findOtherPlayer(player) {
        if(player === player1) return player2;
        else return player1;
    }

    function minimax(board, depth, isMaximize, player) {
        checkForTie(board);
        checkForWin(board);
        if(gameStatus === "win") {
            gameStatus = null;
            if(isMaximize) return -10 + depth;
            else return 10 - depth;
        }
        else if (gameStatus === "tie") {
            gameStatus = null;
            if(isMaximize) return 0 + depth;
            return 0 - depth;
        }
        else if(isMaximize) {
            let otherPlayer = findOtherPlayer(player);
            let bestScore = -Infinity;
            board.forEach((box, index) => {
                if(board[index] === "") {
                    board[index] = player.getMark();
                    markedBox = index;
                    score = minimax(board, depth + 1, false, otherPlayer);
                    board[index] = "";
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        }
        else {
            let otherPlayer = findOtherPlayer(player);
            let bestScore = Infinity;
            board.forEach((box, index) => {
                if(board[index] === "") {
                    board[index] = player.getMark();
                    markedBox = index;
                    score = minimax(board, depth + 1, true, otherPlayer);
                    board[index] = "";
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    }

    function getBestMove(board, player) {
        let bestMove;
        let score;
        let otherPlayer = findOtherPlayer(player);
        let bestScore = -Infinity;
        board.forEach((box, index) => {
            if(board[index] === "") {
                board[index] = player.getMark();
                markedBox = index;
                score = minimax(board, 1, false, otherPlayer);
                board[index] = "";
                if(score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                }
            }
        });
        return bestMove;
    }

    function botMove(player) {
        let boxIndex;
        if(player.getName() === "Easy Bot") {
            let boxesLeft = gridBox.filter(box => {
                return box.textContent === "";
            })
            let leftArrIndex = Math.floor(Math.random() * boxesLeft.length);
            boxIndex = parseInt(boxesLeft[leftArrIndex].getAttribute("data-arrPos"));
        }
        else if(player.getName() === "Medium Bot") {
            isTesting = true;
            let boardCopy = [...gameBoard];
            boxIndex = getGoodMove(boardCopy, player);
            isTesting = false;
        }
        else {
            isTesting = true;
            let boardCopy = [...gameBoard];
            boxIndex = getBestMove(boardCopy, player);
            isTesting = false;
        }
        markedBox = boxIndex;
        player.placeMark(gameBoard, gridBox[boxIndex], boxIndex);
        if(player === player1) isP1Turn = false;
        else isP1Turn = true;
        showConsequences(player);
    }

    function showConsequences(player) {
        let oppPlayer;
        if (player === player1) oppPlayer = player2;
        else oppPlayer = player1;
        checkForWin(gameBoard);
        if(!isGameOver)checkForTie(gameBoard);
        if(!isGameOver)turnDisplay.textContent = `${oppPlayer.getName()}'s turn...`;
        else showEndResults(player);
    }

    function botAutoPlay() {
        if(!player1.getIsPlayer() && !player2.getIsPlayer()) {
            while(!isGameOver) {
                botMove(player1);
                if(!isGameOver) {
                    botMove(player2);
                }
            }
        }
        else if(!player1.getIsPlayer()) {
            botMove(player1);
            isP1Turn = false;
        }
    }

    document.getElementById("start-btn").addEventListener("click", () => {
        if(player1 !== undefined){
            botAutoPlay();
        }
    })

    gridBox.forEach((box, index) => {
        gameBoard[index] = "";
        box.addEventListener("click", e => {
            if(box.textContent === "" && !isGameOver) {
                markedBox = index;
                if(isP1Turn) {
                    player1.placeMark(gameBoard, box, index);
                    isP1Turn = false;
                    showConsequences(player1);
                    if(!isGameOver && !player2.getIsPlayer()) botMove(player2);
                }
                else {
                    player2.placeMark(gameBoard, box, index);
                    isP1Turn = true;
                    showConsequences(player2);
                    if(!isGameOver && !player1.getIsPlayer()) botMove(player1);
                }
            }
        });
    });

    function restartBoard() {
        turnDisplay.textContent = `${player1.getName()}'s turn...`;
        restartBtns.style.display = "none";
        isP1Turn = true;
        isGameOver = false;
        isTieGame = false;
        gridBox.forEach((box, index) => {
            gameBoard[index] = "";
            box.textContent = "";
            box.style.textShadow = "none";
        }) 
    }

    document.getElementById("rematch-btn").addEventListener("click", () => {
        restartBoard();
        botAutoPlay();
    });

    document.getElementById("new-game-btn").addEventListener("click", () => {
        restartBoard();
        document.getElementById("player1-score").textContent = "0";
        document.getElementById("player2-score").textContent = "0";
        document.getElementById("start-session").style.display = "block";
        document.getElementById("game-session").style.display = "none";
    });

    return {getNeedChangeScore}
})();

let gameSettings = (() => {
    let selectBtn = document.getElementsByClassName("selection-btn");
    let editBtn = document.getElementsByClassName("edit-btn");
    let p1IsPlayer;
    let p2IsPlayer;
    let p1Name;
    let p2Name;
    let isDarkMode = true;

    const getIsDarkMode = () => isDarkMode;
    const setIsDarkMode = (val) => isDarkMode = val;

    const togglePlayerBot = (btn, n) => {
        btn.classList.add(`p${n}-clicked`);
        if(btn.id === `p${n}-btn`) {
            if(n === 1) {
                p1IsPlayer = true;
                p1Name = "Player 1";
            }
            else {
                p2IsPlayer = true;
                p2Name = "Player 2";
            }
            document.getElementById(`b${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Player ${n}`;
        }
        else {
            if(n === 1) {
                p1IsPlayer = false;
                p1Name = "Easy Bot";
            }
            else {
                p2IsPlayer = false;
                p2Name = "Easy Bot";
            }
            let editBtn = document.getElementById(`p${n}-edit-btn`);
            if(editBtn.firstChild.classList[1] === "fa-check-square") toggleInput(editBtn);
            document.getElementById(`p${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Easy Bot`;
        }
        document.getElementById(`p${n}-edit-btn`).style.display = "block";
    }

    const toggleInput = (btn) => {
        let btnIcon = btn.firstChild;
        let inputBox = btn.parentElement.children[1];
        let nameDisplay = btn.parentElement.children[0];

        function makeInputVisible() {
            btnIcon.classList.remove("fa-edit");
            btnIcon.classList.add("fa-check-square");
            inputBox.style.display = "block";
            nameDisplay.style.display = "none";
        }

        function makeInputInvisible() {
            btnIcon.classList.remove("fa-check-square");
            btnIcon.classList.add("fa-edit");
            inputBox.style.display = "none";
            nameDisplay.style.display = "block";
        }

        function changeBotDifficulty() {
            if(nameDisplay.textContent === "Easy Bot") nameDisplay.textContent = "Medium Bot";
            else if (nameDisplay.textContent === "Medium Bot") nameDisplay.textContent = "Unbeatable Bot";
            else nameDisplay.textContent = "Easy Bot";
        }

        if((btn.id === "p1-edit-btn" && p1IsPlayer) || (btn.id === "p2-edit-btn" && p2IsPlayer)) {
            if(btnIcon.classList[1] === "fa-edit") makeInputVisible()
            else {
                makeInputInvisible()
                if(!/^ *$/.test(inputBox.value)) {
                    nameDisplay.textContent = inputBox.value;
                }
            }
        }
        else if (btnIcon.classList[1] === "fa-check-square"){
            makeInputInvisible()
            nameDisplay.textContent = "Easy Bot";
        }
        else if ((btn.id === "p1-edit-btn" && !p1IsPlayer) || (btn.id === "p2-edit-btn") && !p2IsPlayer) {
            changeBotDifficulty();
        }

        p1Name = document.getElementById("p1-name").textContent;
        p2Name = document.getElementById("p2-name").textContent;
    }

    const startOrDisplayError = () => {
        let error = document.getElementById("error-message");
        if(p1IsPlayer !== undefined && p2IsPlayer !== undefined && editBtn[0].firstChild.classList[1] === "fa-edit" && editBtn[1].firstChild.classList[1] === "fa-edit") {
            document.getElementById("start-session").style.display = "none";
            document.getElementById("game-session").style.display = "block";
            player1 = Player(p1Name, p1IsPlayer, "X");
            player2 = Player(p2Name, p2IsPlayer, "O");
            document.getElementById("player1-name").textContent = `${player1.getName()}:`;
            document.getElementById("player2-name").textContent = `${player2.getName()}:`;
            document.getElementById("turn-display").textContent = `${player1.getName()}'s turn...`
        }
        else if (p1IsPlayer === undefined || p2IsPlayer === undefined) {
            error.textContent = "ERROR: Select a player or bot for both markers";
        }
        else {
            error.textContent = "ERROR: Finish inputting a name";
        }
    }

    [...selectBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            if(btn.parentElement.id === "p1-btn-container") togglePlayerBot(btn, 1);
            else togglePlayerBot(btn, 2);
        });
    });

    [...editBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            toggleInput(btn);
        });
    });

    document.getElementById("start-btn").addEventListener("mouseup", () => {
        startOrDisplayError();
    });
    
    const setMode = () =>{
        let body = document.querySelector("body");
        if(isDarkMode) {
            isDarkMode = false;
            body.style.backgroundColor = "white";
            body.style.fontFamily = "Marker Felt, fantasy";
            body.style.setProperty("--main-color", "black");
        }
        else {
            isDarkMode = true;
            body.style.backgroundColor = "rgb(39, 38, 41)";
            body.style.fontFamily = "Chalkduster, fantasy";
            body.style.setProperty("--main-color", "white");
        }
    }

    document.getElementById("dark-light-btn").addEventListener("click", () => {
        setMode();
    });

    return {getIsDarkMode, setIsDarkMode, setMode}
})();
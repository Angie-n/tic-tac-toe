let gameBoard = (() => {
    let gameBoard = [];
    let gridBox = [...document.getElementsByClassName("grid-box")];
    let isP1Turn = true;

    gridBox.forEach((box, index) => {
        gameBoard[index] = "";
        box.addEventListener("click", e => {
            if(box.textContent === "") {
                if(isP1Turn) {
                    gameBoard[index] = "X";
                    box.textContent = "X";
                    box.style.color = "rgb(42, 141, 233)";
                    isP1Turn = false;
                }
                else {
                    gameBoard[index] = "O";
                    box.textContent = "O";
                    box.style.color = "rgb(199, 37, 8)";
                    isP1Turn = true;
                }
            }
        });
    });


})();

let displayController = (() => {
    let selectBtn = document.getElementsByClassName("selection-btn");
    let p1IsPlayer;
    let p2IsPlayer;

    let editBtn = document.getElementsByClassName("edit-btn");

    function togglePlayerBot(btn, n) {
        btn.classList.add(`p${n}-clicked`);
        if(btn.id === `p${n}-btn`) {
            if(n === 1) p1IsPlayer = true;
            else p2IsPlayer = true;
            document.getElementById(`b${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Player ${n}`;
        }
        else {
            if(n === 1) p1IsPlayer = false;
            else p2IsPlayer = false;
            document.getElementById(`p${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Bot`;
        }
        document.getElementById(`p${n}-edit-btn`).style.display = "block";
    }

    [...selectBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            if(btn.parentElement.id === "p1-btn-container") togglePlayerBot(btn, 1);
            else togglePlayerBot(btn, 2);
        });
    });

    [...editBtn].forEach(btn => {
        let btnIcon = btn.firstChild;
        let inputBox = btn.parentElement.children[1];
        let nameDisplay = btn.parentElement.children[0];
        btn.addEventListener("click", () => {
            if((btn.id === "p1-edit-btn" && p1IsPlayer) || (btn.id === "p2-edit-btn" && p2IsPlayer)) {
                if(btnIcon.classList[1] === "fa-edit") {
                    btnIcon.classList.remove("fa-edit");
                    btnIcon.classList.add("fa-check-square");
                    inputBox.style.display = "block";
                    nameDisplay.style.display = "none";
                }
                else {
                    btnIcon.classList.remove("fa-check-square");
                    btnIcon.classList.add("fa-edit");
                    inputBox.style.display = "none";
                    nameDisplay.style.display = "block";
                    if(!/^ *$/.test(inputBox.value)) nameDisplay.textContent = inputBox.value;
                }
            }
        });
    });

    document.getElementById("start-btn").addEventListener("click", () => {
        let error = document.getElementById("error-message");
        if(p1IsPlayer !== undefined && p2IsPlayer !== undefined && editBtn[0].firstChild.classList[1] === "fa-edit" && editBtn[1].firstChild.classList[1] === "fa-edit") {
            document.getElementById("start-session").style.display = "none";
            document.getElementById("game-session").style.display = "block";
        }
        else if (p1IsPlayer === undefined || p2IsPlayer === undefined) {
            error.textContent = "ERROR: Select a player or bot";
        }
        else {
            error.textContent = "ERROR: Finish inputting a name";
        }
    });

})();

let player = () => {
    
};
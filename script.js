let gameBoard = (() => {
    let gameBoard = [];
    let gridBox = [...document.getElementsByClassName("grid-box")];
    let isP1Turn = true;
    let turnDisplay = document.getElementById("turn-display");

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

    function togglePlayerBot(btn, n, isPlayer) {
        btn.classList.add(`p${n}-clicked`);
        if(btn.id === `p${n}-btn`) {
            isPlayer = true;
            document.getElementById(`b${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Player ${n}`;
        }
        else {
            isPlayer = false;
            document.getElementById(`p${n}-btn`).classList.remove(`p${n}-clicked`);
            document.getElementById(`p${n}-name`).textContent = `Bot`;
        }
        document.getElementById(`p${n}-edit-btn`).style.display = "block";
    }

    [...selectBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            if(btn.parentElement.id === "p1-btn-container") togglePlayerBot(btn, 1, p1IsPlayer);
            else togglePlayerBot(btn, 2, p2IsPlayer);
        });
    });

    [...editBtn].forEach(btn => {
        btn.addEventListener("click", () => {

        });
    });

})();

let player = () => {
    
};
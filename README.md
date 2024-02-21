Vanilla JS app that sets up a tic-tac-toe game between players and bots of varying difficulties. 


## Installation and Setup Instructions


Clone this repository


Installation:


`npm install`  


To Visit App:


`localhost:3000`  


## Reflection


The classic tic-tac-toe beginner project. This was a turning point in which I transitioned into using an OOP-oriented design in my websites, relying less on manipulating the DOM as my only source of keeping track of user interactions. 


I first only implemented a player vs player game, but decided to challenge myself by adding the option of challenging a bot. There are three levels of difficulty available, which are as follows: 


Unbeatable - This is where I spent the bulk of the time on the project as I found it difficult to implement the minimax algorithm. I learned better coding practices after a string of failed attempts, taking a break to test my understanding of the algorithm before starting from scratch and attempting it again. 


Medium - After successfully implementing the minimax algorithm, the idea for a medium level came naturally. Instead of a bot that views all possibilities and making the best decision possible (assuming the player also tries to choose the best moves), this bot would only consider the consequences of their move for the immediate next turn.


Easy - At the easiest level, the bot does not look at the current positions in the board at all, picking a spot at random. 

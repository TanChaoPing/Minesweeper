# Minesweeper

A Minesweeper website made primarily using JavaScript, HTML, and CSS. The website includes 3 distinct Minesweeper difficulties ("Easy", "Normal", "Hard"), and each difficulty has different amount of bombs and different board size for the player to solve. Please do note that the game does not ensure a guaranteed win as there may be guessing included in each generated board.

# How to play:

Minesweeper is a game where random number of bombs based on the difficulty chosen are placed in the board. The player must determine where the bombs are using the numbers in each cell as a clue. The number in each cell specifies how many bombs exist in its orthogonally and diagonally neighboring cells.

On desktop, the player can **left click** to solve the cell or **right click** to flag the cell if they suspect the cell is a bomb. There is also an `Enter Flag Mode` button below the board that switches between **Flag Mode** and **Solve Mode** to accommodate mobile users since players cannot right click on a mobile device.

Once all the non-bomb cells have been identified or cleared without clicking on a bomb, the player wins the Minesweeper game!

# How to install and run:

First, clone the repository using the `git clone https://github.com/TanChaoPing/Minesweeper` command to your local desktop if you want to give it a try. Once the repository has been cloned locally, make sure you have Vite installed by running the command `npm install`. This will install all the dependencies inside the Vite project.

After the installation has been completed, the user can run the command `npm run dev` to run the website and play Minesweeper on their desktop locally.

Made by: Tan Chao Ping

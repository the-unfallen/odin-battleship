import { Player } from "./index.js";

const initialSetUp = () => {
    const mainBoard1 = document.getElementById('main_board1');
    const mainBoard2 = document.getElementById('main_board2');
    [mainBoard1, mainBoard2].forEach((element, index) => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement("div");
                cell.id = `${index}cell${i}${j}`;
                cell.classList.add(`cell${index}`);
                cell.dataset.row = i;
                cell.dataset.column = j;
                cell.style.border = "1px solid blue";
                element.appendChild(cell);
            }
        }
    });

    return true;

}





const displayShips = (playerOne, playerTwo) => {
    const displayVerticalShip = (startCoordinates, lengthOfShip, index) => {
        const startRow = startCoordinates[0];
        const startColumn = startCoordinates[1];
        for(let i = 0; i < lengthOfShip; i++){
            const cell_id = `${index}cell${startRow + i}${startColumn}`;
            const this_cell = document.getElementById(cell_id);
            this_cell.style.borderLeft = '3px solid red';
            this_cell.style.borderRight = '3px solid red';

            if(i === 0){
                this_cell.style.borderTop = '3px solid red';
            }
            if(i === lengthOfShip - 1){
                this_cell.style.borderBottom = '3px solid red';
            }
        }
    }

    const displayHorizontalShip = (startCoordinates, lengthOfShip, index) => {
        const startRow = startCoordinates[0];
        const startColumn = startCoordinates[1];
        for(let i = 0; i < lengthOfShip; i++){
            const cell_id = `${index}cell${startRow}${startColumn + i}`;
            const this_cell = document.getElementById(cell_id);
            this_cell.style.borderTop = '3px solid red';
            this_cell.style.borderBottom = '3px solid red';

            if(i === 0){
                this_cell.style.borderLeft = '3px solid red';
            }
            if(i === lengthOfShip - 1){
                this_cell.style.borderRight = '3px solid red';
            }
        }
    }

    const boardLayout1 = playerOne.board;
    const boardLayout2 = playerTwo.board;

    // display board1 ships
    const board1ships = boardLayout1.myShips;
    const board1index = 0;
    // console.log(board1ships);
    
    for (let i = 0; i < board1ships.length; i++){
        const startLocation = board1ships[i].coordinates[0];
        const shipLength = board1ships[i].size;
        if(board1ships[i].orientation === 'horizontal'){
            displayHorizontalShip(startLocation, shipLength, board1index);
        }
        if(board1ships[i].orientation === 'vertical'){
            displayVerticalShip(startLocation, shipLength, board1index);
        }
    }


}



const displayControl = () => {
    const humanPlayer = new Player('human');
    humanPlayer.setBoard();
    humanPlayer.board.placeShip();
    const computerPlayer = new Player('computer', 'computer');
    computerPlayer.setBoard();
    computerPlayer.board.placeShip();
    displayShips(humanPlayer, computerPlayer);
    ScreenController(humanPlayer, computerPlayer);
   
}


const startGame = document.getElementById('start_game');

initialSetUp();
startGame.onclick = () => {
    startGame.classList.toggle('disabled');
    displayControl();
}




function GameController(playerOne = "Player One", playerTwo = "Player Two") {
    const players = [
        {
            core: playerOne,
            name: playerOne.name,
            layout: playerOne.board.layout,
            board: playerOne.board,
            sunk: playerOne.board.getSunkCount(),
            hits: playerOne.board.hits_taken,
            cells: '.cell0',
            type: playerOne.type,
            boardId: 'main_board1',
        },
        {
            core: playerTwo,
            name: playerTwo.name,
            layout: playerTwo.board.layout,
            board: playerTwo.board,
            sunk: playerTwo.board.getSunkCount(),
            hits: playerTwo.board.hits_taken,
            cells: '.cell1',
            type: playerTwo.type,
            boardId: 'main_board2',
        },
    ]

    const coinToss = Math.floor(Math.random() * 2);
    let activePlayer = players[coinToss];
    let activeOpponent = null;
    if (coinToss === 0){
        activeOpponent = players[1];
    }else{
        activeOpponent = players[0];
    }
    

    const switchPlayerTurn = () => {
        if(activePlayer === players[0]){
            activePlayer = players[1];
            activeOpponent = players[0];
        }else{
            activePlayer = players[0];
            activeOpponent = players[1];
        }
    }

    const getActivePlayer = () => activePlayer;
    const getActiveOpponent = () => activeOpponent;

    const playRound = (row, column) => {
        console.log(
            `Current Player - ${getActivePlayer().name} is attacking the opponent - ${getActiveOpponent().name}'s board on
            Row - ${row}, Column - ${column}`
        );
        getActiveOpponent().board.receiveAttack([row, column]);
        // console.log(getActiveOpponent().board);
        //check for Winner
        let winnerCheck = false;
        if(getActiveOpponent().core.board.sunkCount >= 5){
            winnerCheck = true;
        }

        if(winnerCheck){
            console.log(`${getActivePlayer().name} WINS!!!`);
            return winnerCheck;
        }else{
            // console.log('game on!');
            switchPlayerTurn();
            return winnerCheck;
        }



    }

    return {
        players,
        playRound,
        getActivePlayer,
        getActiveOpponent,
    };
}


function ScreenController(gamer1, gamer2){
    let game = GameController(gamer1, gamer2);
    const playerTurnDiv = document.querySelector('#whose_turn');
    const winnerDisplay = document.getElementById('winner');
    // const mainBoard1 = document.getElementById('main_board1');
    const mainBoard2 = document.getElementById('main_board2');
    let winnerCheck = false;
    let attackRecordByComputer = [];
    

    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        const activeOpponent = game.getActiveOpponent();
        document.getElementById(activePlayer.boardId).classList.add('cell_disabled');
        document.getElementById(activeOpponent.boardId).classList.remove('cell_disabled');
        if(activePlayer.type !== 'computer'){
            playerTurnDiv.textContent = 'Your Turn';
        }else{
            playerTurnDiv.textContent = "Computer's Turn";
        }
        
        
        game.players.forEach( (gamer) => {
            const allCells = document.querySelectorAll(gamer.cells);
            allCells.forEach((item)=>{
                const rowIndex = parseInt(item.dataset.row);
                const columnIndex = parseInt(item.dataset.column);
                const cell = gamer.layout[rowIndex][columnIndex];
                // check for attacked and hasShip
                if(cell.attacked){
                    item.classList.add('cell_attacked');
                    item.textContent = cell.hasShip ? 'X' : 'O';
                    
                }
            })

            if(gamer.boardId === 'main_board2'){
                document.getElementById('board2hit').textContent = `Hit: ${gamer2.board.hits_taken}`;
                document.getElementById('board2sunk').textContent = `Sunk: ${gamer2.board.sunkCount}`;
                document.getElementById('board2miss').textContent = `Miss: ${gamer2.board.miss}`;
                let shootingAccuarcy2 = 0;
                if(gamer2.board.hits_taken > 0){
                    shootingAccuarcy2 = (gamer2.board.hits_taken / (gamer2.board.miss + gamer2.board.hits_taken)) * 100;
                    shootingAccuarcy2 = Math.ceil(shootingAccuarcy2);
                }
                document.getElementById('board2Accuracy').textContent = `Accuracy: ${shootingAccuarcy2}%`;
            }
            if(gamer.boardId === 'main_board1'){
                document.getElementById('board1hit').textContent = `Hit: ${gamer1.board.hits_taken}`;
                document.getElementById('board1sunk').textContent = `Sunk: ${gamer1.board.sunkCount}`;
                document.getElementById('board1miss').textContent = `Miss: ${gamer1.board.miss}`;
                let shootingAccuarcy1 = 0;
                if(gamer1.board.hits_taken > 0){
                    shootingAccuarcy1 = (gamer1.board.hits_taken / (gamer1.board.miss + gamer1.board.hits_taken)) * 100;
                    shootingAccuarcy1 = Math.ceil(shootingAccuarcy1);
                }
                
                document.getElementById('board1Accuracy').textContent = `Accuracy: ${shootingAccuarcy1}%`;
            }
            
        })

        const displayVerticalShip = (zeroCoord, shipSize) => {
            const startRow = zeroCoord[0];
            const startColumn = zeroCoord[1];
            for(let i = 0; i < shipSize; i++){
                const cell_id = `1cell${startRow + i}${startColumn}`;
                const this_cell = document.getElementById(cell_id);
                this_cell.style.borderLeft = '3px solid red';
                this_cell.style.borderRight = '3px solid red';
    
                if(i === 0){
                    this_cell.style.borderTop = '3px solid red';
                }
                if(i === shipSize - 1){
                    this_cell.style.borderBottom = '3px solid red';
                }
            }
        }
    
        const displayHorizontalShip = (zeroCoord, shipSize) => {
            const startRow = zeroCoord[0];
            const startColumn = zeroCoord[1];
            for(let i = 0; i < shipSize; i++){
                const cell_id = `1cell${startRow}${startColumn + i}`;
                const this_cell = document.getElementById(cell_id);
                this_cell.style.borderTop = '3px solid red';
                this_cell.style.borderBottom = '3px solid red';
    
                if(i === 0){
                    this_cell.style.borderLeft = '3px solid red';
                }
                if(i === shipSize - 1){
                    this_cell.style.borderRight = '3px solid red';
                }
            }
        }

        // when i sink a ship in board2 - I want the ship to reveal itself.
        // console.log(sunkArray);
        const sunkArray = getSunkShipsdetails() || [];
        // console.log(sunkArray);
        // console.log(sunkArray.length);
        if(sunkArray.length > 0){
            for(const sunkShip of sunkArray){
                if(sunkShip.orientation === 'horizontal'){
                    displayHorizontalShip(sunkShip.zeroCord, sunkShip.size);
                }
                if(sunkShip.orientation === 'vertical'){
                    displayVerticalShip(sunkShip.zeroCord, sunkShip.size);
                }
            }

            
        }

        // board 2 is where all the computer player ships are.
        // so if computer player sunk count is greater than 0;
        // we reveal all it's ship that are sunk.



    }

    function getSunkShipsdetails(){
        let sunkCoordinates = [];
        let computerPlayer;
        if(game.players[0].type === 'computer'){
            computerPlayer = game.players[0]
        }
        if(game.players[1].type === 'computer'){
            computerPlayer = game.players[1]
        }
        if(computerPlayer.board.sunkCount > 0){
            const computerBoard = computerPlayer.board;
            const computerShips = computerBoard.myShips;
            for(const ship of computerShips){
                if(ship.sunk){
                    sunkCoordinates.push({zeroCord: ship.coordinates[0], orientation: ship.orientation, size: ship.size});
                }
            }

        }
        return sunkCoordinates;
    }

    function getHumanSunkStatus(){
        let humanPlayer;
        if(game.players[0].type !== 'computer'){
            humanPlayer = game.players[0]
        }
        if(game.players[1].type !== 'computer'){
            humanPlayer = game.players[1]
        }

        let humanSunkDetails = [];
        // console.log(humanPlayer.board.sunkCount);
        if(humanPlayer.board.sunkCount > 0){
            const humanBoard = humanPlayer.board;
            const humanShips = humanBoard.myShips;
            for(const ship of humanShips){
                if(ship.sunk){
                    humanSunkDetails.push({coord: ship.coordinates, orientation: ship.orientation, size: ship.size});
                }
            }
        }

        return humanSunkDetails;
    }

    function computersTurn(){
        const virginTargets = getUnattackedHumanCells();
        
        if(game.getActivePlayer().type === 'computer'){
            // console.log(getHumanSunkStatus());
            // get a random address
            // makesure the address is not previously attacked.
            let attackCoord = null;
            let check = false;
            let address = null;
            let hitResult = false;
            while(!check){
                const randomNumber = computerIntelligence() || virginTargets[getRandomNumber(virginTargets.length)];
                const randomRow = Math.floor(randomNumber / 10);
                const randomColumn = randomNumber % 10;
                if(game.getActiveOpponent().layout[randomRow][randomColumn].attacked === false){
                    attackCoord = [randomRow, randomColumn];
                    check = true;
                    address = randomNumber;
                    if(game.getActiveOpponent().layout[randomRow][randomColumn].hasShip){
                        hitResult = true;
                    }
                }
            }
            attackRecordByComputer.push({address: address, hit: hitResult});
            // console.log(attackRecordByComputer);
            winnerCheck = game.playRound(attackCoord[0], attackCoord[1]);
            updateScreen();

            winnerStatus(winnerCheck);
            // if (){
            //     // activate winner state
            //     // announce winner
            //     console.log('We have a winner');
            //     // disable all boards
            // }
        }
    }

    function getRandomNumber(unincludedUpperLimit){
        return Math.floor(Math.random() * unincludedUpperLimit);
    }

    function getUnattackedHumanCells(){
        let humanPlayer;
        if(game.players[0].type !== 'computer'){
            humanPlayer = game.players[0]
        }
        if(game.players[1].type !== 'computer'){
            humanPlayer = game.players[1]
        }
        let unattackedArray = [];

        for(let i = 0; i < humanPlayer.board.layout.length; i++){
            for(let j = 0; j < humanPlayer.board.layout[i].length; j++){
                if(!humanPlayer.board.layout[i][j].attacked){
                    let unattackedAddress = (i * 10) + j;
                    unattackedArray.push(unattackedAddress);
                }
            }
        }

        return unattackedArray;

    }

    function computerIntelligence(){
        const virginTargets = getUnattackedHumanCells();
        // Let's find a hit.
        let findAHit = false;
        let lastHit = null;
        let spareUnsunkAddress = false;
        if(attackRecordByComputer.length > 0){
            for(let i = attackRecordByComputer.length - 1; i >= 0 ; i--){
                if(attackRecordByComputer[i].hit){
                    findAHit = true;
                    lastHit = attackRecordByComputer[i];
                    break;
                }
            }
        }

        if(!findAHit && lastHit === null){
            return virginTargets[getRandomNumber(virginTargets.length)];
        }

        const humanSunkRecord = getHumanSunkStatus() || [];
        let sunkCheckforLastHit = false;

        const isAddressSunk = (hitAddress) => {
            for(let i = 0; i < humanSunkRecord.length; i++){
                // now we have to iterate through every coordinate of the sunk ship.
                const sunkcoords = humanSunkRecord[i].coord;
                for(let j = 0; j < sunkcoords.length; j++){
                    let sunkCellAddress = (sunkcoords[j][0] * 10 ) + sunkcoords[j][1];
                    if (sunkCellAddress === hitAddress){
                        return true;
                    }

                }
            }
            return false;
        }

        if(lastHit !== null){
            sunkCheckforLastHit = isAddressSunk(lastHit.address);
        }

        // const getShipRow = (address) => {
        //     return Math.floor(address / 10);
        // }

        // const getShipColumn = (address) => {
        //     return (address % 10);
        // }

        // const sameShipCheck = (array) => {

        // }








        let refHit = null;
        if(lastHit && sunkCheckforLastHit){
            // check for atleast 2 unsunk address that belonged to the same ship
            // use those 2 info to get the next address.


            // check for spare unsunk address when 4 ships are sunk.
            if(humanSunkRecord.length > 1){
                for(let i = attackRecordByComputer.length - 1; i >= 0 ; i--){
                    refHit = attackRecordByComputer[i];
                    if(refHit.hit && isAddressSunk(refHit.address) === false){
                        lastHit = refHit;
                        spareUnsunkAddress = true;
                        sunkCheckforLastHit = false;
                        break;
                    }
                }
            }


            if(spareUnsunkAddress = false){
                return virginTargets[getRandomNumber(virginTargets.length)]
            }
        }

        if(refHit !== null){
            lastHit = refHit;
        }




        if(lastHit && !sunkCheckforLastHit){
            const lastHitRow = Math.floor(lastHit.address / 10);
            const lastHitColumn = lastHit.address % 10;

            const rightHitAddress = (lastHitRow * 10) + (lastHitColumn + 1);
            const leftHitAddress = (lastHitRow * 10) + (lastHitColumn - 1);
            const topHitAddress = ((lastHitRow - 1) * 10) + lastHitColumn;
            const bottomHitAddress = ((lastHitRow + 1) * 10) + lastHitColumn;


            //check for access to leftCell;
            if(rightHitAddress >= 0 && rightHitAddress < 100 && (lastHitColumn + 1) <= 9){
                if(game.getActiveOpponent().layout[lastHitRow][lastHitColumn + 1].attacked === false){
                    // go left
                    return rightHitAddress;
                }
                
            }

            //check for access to bottom cell
            if(bottomHitAddress >= 0 && bottomHitAddress < 100 && (lastHitRow + 1) <= 9){
                if(game.getActiveOpponent().layout[lastHitRow + 1][lastHitColumn].attacked === false){
                    // go bottom
                    return bottomHitAddress;
                }

            }


            // check for access to right cell;
            if(leftHitAddress >= 0 && leftHitAddress < 100 && (lastHitColumn - 1) >= 0){
                if(game.getActiveOpponent().layout[lastHitRow][lastHitColumn - 1].attacked === false){
                    // go right
                    return leftHitAddress;
                }

            }


            // check for access to top cell;
            if(topHitAddress >= 0 && topHitAddress < 100 && (lastHitRow - 1) >= 0){
                if(game.getActiveOpponent().layout[lastHitRow - 1][lastHitColumn].attacked === false){
                    // go top
                    return topHitAddress;
                }
            }

            // sunk check for penultimate hit
            
            // Penultimate check
            let penultimateHit = null;
            const getPenultimateHit = () => {
                if(attackRecordByComputer.length > 0){
                    for(let i = attackRecordByComputer.length - 1; i >= 0 ; i--){
                        let penhit = attackRecordByComputer[i];
                        if(penhit.hit && penhit.address !== lastHit.address){
                            return penhit;
                        }
                    }
                }
                return null;
            }
            penultimateHit = getPenultimateHit();
            let relationshipCheck = ''; 
            let sunkCheckForPenultimateHit = true;
            let penultimateHitRow = null;
            let penultimateHitColumn = null;
            if(penultimateHit !== null){
                sunkCheckForPenultimateHit = isAddressSunk(penultimateHit.address);
                penultimateHitRow = Math.floor(penultimateHit.address / 10);
                penultimateHitColumn = Math.floor(penultimateHit.address % 10);
                // check vertical relationship
                if(penultimateHitColumn === lastHitColumn && 
                    Math.abs(penultimateHitRow - lastHitRow) === 1
                ){
                    relationshipCheck = 'vertical';
                }

                if(penultimateHitRow === lastHitRow &&
                    Math.abs(penultimateHitColumn - lastHitColumn) === 1
                ){
                    relationshipCheck = 'horizontal';
                }
            }

            console.log("Choosing based on relationship:", relationshipCheck);



            if(!sunkCheckForPenultimateHit && relationshipCheck === 'vertical'){
                //same columns, checking for Available rows
                
                let availableRows = [];
                for(let i = 0; i < 10; i++){
                    if(game.getActiveOpponent().layout[i][lastHitColumn].attacked === false){
                        availableRows.push(i);
                    }
                }
                let upperRow = Math.max(lastHitRow, penultimateHitRow);
                let lowerRow = Math.min(lastHitRow, penultimateHitRow);
                let newRow;
                if(availableRows.includes(upperRow + 1)){
                    newRow = upperRow + 1;
                }else if(availableRows.includes(lowerRow - 1)){
                    newRow = lowerRow - 1;
                }else{
                    newRow = availableRows[0];
                }
                let newAddress = (newRow * 10) + lastHitColumn;
                return newAddress;
            }

            if(!sunkCheckForPenultimateHit && relationshipCheck === 'horizontal'){
                // Same rows, checking for Available Columns 
                let availableColumns = [];
                for(let i = 0; i < 10; i++){
                    if(game.getActiveOpponent().layout[lastHitRow][i].attacked === false){
                        availableColumns.push(i);
                    }
                }
                let newColumn;
                let upperColumn = Math.max(lastHitColumn, penultimateHitColumn);
                let lowerColumn = Math.min(lastHitColumn, penultimateHitColumn);
                if(availableColumns.includes(upperColumn + 1)){
                    newColumn = upperColumn + 1;
                }else if(availableColumns.includes(lowerColumn - 1)){
                    newColumn = lowerColumn - 1;
                }else{
                    newColumn = availableColumns[0];
                }
                let newAddress = (lastHitRow * 10) + newColumn;
                return newAddress;

            }

            

            
            










        
        }




        return virginTargets[getRandomNumber(virginTargets.length)];

    }

    function clickHandlerBoard(e) {
        const selectedColumn = parseInt(e.target.dataset.column);
        const selectedRow = parseInt(e.target.dataset.row);
        // if(selectedColumn < 0 || selectedColumn > 9 || selectedRow > 0 || selectedRow > 9)return;
        if(game.getActiveOpponent().layout[selectedRow][selectedColumn].attacked === true)return null;
        winnerCheck = game.playRound(selectedRow, selectedColumn);
        updateScreen();
        winnerStatus(winnerCheck);
        setTimeout(computersTurn, 1000);
    }

    mainBoard2.addEventListener('click', clickHandlerBoard);

    function winnerStatus(check){
        if(check){
            //active player wins
            playerTurnDiv.style.display = 'none';
            const the_winner = game.getActivePlayer().name;
            const winner_type = game.getActivePlayer().type;
            if (winner_type !== 'computer'){
                winnerDisplay.textContent = 'You Win!!!';
            } else {
                winnerDisplay.textContent = 'Computer Wins!!!';
            }
            
            document.getElementById(game.getActivePlayer().boardId).classList.add('cell_disabled');
            document.getElementById(game.getActiveOpponent().boardId).classList.add('cell_disabled');
            document.getElementById('start_game').classList.remove('disabled');
            document.getElementById('start_game').textContent = 'Play Again';
            document.getElementById('start_game').onclick = () => {
                location.reload();
            }
            // console.log('We have a winner');
            // disable all boards
            // announce winner
            // console.log('We have a winner');






        }
    }

    function updateTimer() {
        let seconds = 0;
        const timerDisplay = document.getElementById('timer');
  
        const timerId = setInterval(() => {
          seconds++;
  
          const minutes = Math.floor(seconds / 60);
          const secs = seconds % 60;
          const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          timerDisplay.textContent = formattedTime;
  
          if (winnerCheck) {
            clearInterval(timerId);
          }
        }, 1000);
    }

    updateTimer();

    //Initial render
    updateScreen();
    setTimeout(computersTurn, 1000);


}
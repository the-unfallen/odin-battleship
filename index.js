
export class Ship{
    constructor(size=null){
        this.size = size;
        this.hits = 0;
        this.coordinates = [];
        this.orientation = null;
    }

    hit(){
        this.hits = this.hits + 1;
        return this.hits;
    }

    get sunk() {
        return this.hits >= this.size;
    }


}

class Node{
    constructor(){
        this.hasShip = false;
        this.attacked = false;
        this.coordinates = [];
    }
}

export class Gameboard{
    constructor(){
        this.layout = this.generateBoardLayout();
        this.shipPlacement = false;
        this.myShips = this.getShips();
        this.sunkCount = 0;
        this.hits_taken = 0;
    }

    get miss() {
        // get ships that have been attacked but has no ship
        //iterare over board layout
        let missedAttempts = 0;
        for(let i = 0; i < this.layout.length; i++){
            for(let j = 0; j < this.layout[i].length; j++){
                if(this.layout[i][j].attacked &&
                    !this.layout[i][j].hasShip
                ){
                    missedAttempts++;
                }
            }
        }
        return missedAttempts;


    }

    totalHits(){
        let total_hits = 0
        for (const ship of this.myShips){
            total_hits += ship.hits;
        }
        this.hits_taken = total_hits;
    }

    generateBoardLayout(){
        let arrayLayout = [];
        for(let i = 0; i < 10; i++){
            let arraySubset = [];
            for(let j = 0; j < 10; j++){
                const myNode = new Node();
                myNode.coordinates = [i, j];
                arraySubset.push(myNode);
            }
            arrayLayout.push(arraySubset);
        }
        return arrayLayout;
    }

    getShips(){
        const destroyer = new Ship(2);
        const submarine = new Ship(3);
        const cruiser = new Ship(3);
        const battleShip = new Ship(4);
        const carrier = new Ship(5);
        return[destroyer, submarine, cruiser, battleShip, carrier];
    }

    placeShip(){
        if(this.shipPlacement === true)return false;

        let placeIndex = 0;
        let placeCount = 0;
        // ship orientation
        while(placeCount < 5){
            const orientationArray = ['horizontal', 'vertical'];
            const orientationIndex = Math.floor(Math.random() * 2);
            const orientation = orientationArray[orientationIndex];
            // ship coordinates
            let shipCoordinates = [];
            // get a random address for the starting coordinates between 0 and 99
            const randomAddress = Math.floor(Math.random() * 100);
            const startRowCoord = Math.floor(randomAddress / 10);
            const startColumnCoord = Math.floor(randomAddress % 10);
            if(orientation ===  'horizontal'){
                for(let i = 0; i < this.myShips[placeIndex].size; i++){
                    shipCoordinates.push([startRowCoord, startColumnCoord + i]);
                }
            }else{
                for(let i = 0; i < this.myShips[placeIndex].size; i++){
                    shipCoordinates.push([startRowCoord + i, startColumnCoord]);
                }
            }

            // check if ship coordinates are within limits.
            const withinLimits = (shipCoordsArray) => {
                const arrayCopy = [...shipCoordsArray];
                for(let i = 0; i < arrayCopy.length; i++){
                    const item = arrayCopy[i];
                    if(item[0] < 0 || item[0] > 9 || item[1] < 0 || item[1] > 9){
                        return false;
                    }
                }
                return true;
            }

            // check if ship coordinates are unoccupied.
            const unOccupied = (shipCoordsArray) => {
                const arrayCopy = [...shipCoordsArray];
                for(let i = 0; i < arrayCopy.length; i++){
                    const item = arrayCopy[i];
                    if(this.layout[item[0]][item[1]].hasShip === true){
                        return false;
                    }
                }
                return true;
            }

            if(withinLimits(shipCoordinates) && unOccupied(shipCoordinates)){
                // log ship coordinates within ship
                this.myShips[placeIndex].coordinates = shipCoordinates;
                this.myShips[placeIndex].orientation = orientation;
                // log ship coordinates on the layout
                for(let i = 0; i < shipCoordinates.length; i++ ){
                    const item = shipCoordinates[i];
                    this.layout[item[0]][item[1]].hasShip = true;
                }
                // increment counter
                placeCount = placeCount + 1;
                placeIndex = placeIndex + 1;
            }
        }
        this.shipPlacement = true;
        return this.layout;
    }

    receiveAttack(array=[]){
        const attackRow = array[0];
        const attackColumn = array[1];
        // console.log({array});
        if(array.length !== 2)return false;
        // coordinates should be within bounds
        if(array[0] < 0 || array[0] > 9 || array[1] < 0 || array[1] > 9){
            return false;
        }

        if(this.layout[attackRow][attackColumn].attacked === true){
            return false
        } else {
            this.layout[attackRow][attackColumn].attacked = true;
        }
        
        
        if(this.layout[attackRow][attackColumn].hasShip === true){
            let targetShipIndex = null;
            for (let i = 0; i < this.myShips.length; i++) {
                const subject_coords = this.myShips[i].coordinates;
              
                for (let coord of subject_coords) {
                  if (coord[0] === array[0] && coord[1] === array[1]) {
                    // console.log('Yes!!!!!!!!!!!!!!!!!!!!!!!!');
                    targetShipIndex = i;
                    // console.log({targetShipIndex});
                    // console.log(this.myShips[i].hits);
                    this.myShips[i].hit();
                    // console.log(this.myShips[i].hits);
                    this.totalHits();
                    this.getSunkCount();
                    break;
                  }
                }
              
                if (targetShipIndex !== null) break;
            }
            // console.log({targetShipIndex});
            

        }
        return true;
    }

    getSunkCount(){
        let sunkCountX = 0;
        for(let i = 0; i < this.myShips.length; i++){
            if(this.myShips[i].sunk === true){
                sunkCountX = sunkCountX + 1;
            }
        }
        this.sunkCount = sunkCountX;
        return sunkCountX;
    }
}

export class Player{
    constructor(name='', type=null){
        this.name = name;
        this.board = null;
        this.isBoardSet = false;
        this.type = type;
    }
    setBoard(){
        if(this.isBoardSet === false){
            this.board = new Gameboard();
            this.isBoardSet = true;
            return true;
        }
        return false;
    }
}
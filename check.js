import { Gameboard } from "./index.js";

const testBoard = new Gameboard();
testBoard.placeShip();
console.log(testBoard);
console.log(testBoard.myShips[0].coordinates);

const coords = testBoard.myShips[0].coordinates;
const target = coords[0];
const secondTarget = coords[1];
console.log(testBoard.layout[target[0]][target[1]]);
testBoard.receiveAttack(target);
console.log('++++++++++++');
console.log(testBoard.myShips[0].hits);
console.log('++++++++++++');
console.log(testBoard.myShips[0].sunk);
console.log('++++++++++++');
testBoard.receiveAttack(secondTarget);
console.log('++++++++++++');
console.log(testBoard.myShips[0].hits);
console.log('++++++++++++');
console.log(testBoard.myShips[0].sunk);

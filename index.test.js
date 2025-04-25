
import { Ship, Gameboard, Player } from "./index.js";


test('ship class works', () => {
    expect(new Ship()).toBeDefined();
    const cruiser = new Ship(2);
    expect(cruiser.size).toBe(2);
    expect(cruiser.hits).toBe(0);
    expect(cruiser.sunk).toBeFalsy();
    expect(cruiser.hit()).toBe(1);
    expect(cruiser.sunk).toBeFalsy();
    expect(cruiser.hit()).toBe(2);
    expect(cruiser.sunk).toBeTruthy();
})


test('Gameboard class works', () => {
    const board = new Gameboard()
    expect(board).toBeDefined();
    expect(board.layout.length).toBe(10);
    expect(board.layout.flat().length).toBe(100);
    expect(board.layout[0][0].hasShip).toBeFalsy();
    expect(board.placeShip()).toBeDefined();
    const testBoard = new Gameboard();
    testBoard.placeShip();
    const expectedShipCellCount = 17;
    const layoutArray = testBoard.layout.flat();
    const cellsWithShips = layoutArray.filter(node => node.hasShip);
    expect(cellsWithShips.length).toBe(expectedShipCellCount);
    expect(testBoard.myShips[4].size).toBe(5);
    const firstShipLocation = testBoard.myShips[0].coordinates;
    expect(firstShipLocation.length).toEqual(2);
    expect(testBoard.receiveAttack(firstShipLocation[0])).toBe(true);
    expect(testBoard.myShips[0].hits).toBe(1);
    console.log(testBoard.myShips[0]);
    testBoard.receiveAttack(firstShipLocation[1]);
    console.log(testBoard.myShips[0]);
    expect(testBoard.myShips[0].sunk).toBe(true);
    expect(testBoard.receiveAttack(firstShipLocation[0])).toBe(false);
    expect(testBoard.receiveAttack([9, 9])).toBe(true);
    expect(testBoard.receiveAttack([10, 9])).toBe(false);
    expect(testBoard.getSunkCount()).toBe(1);
})



test('Player class works', () => {
    const player1 = new Player()
    expect(player1.board).toBe(null);
    expect(player1.isBoardSet).toBe(false);
})
let materials = 1000;
let units = 0;
let areaControlled = 0;
let isPlacingBarracks = false;
let selectedUnit = null;
let unitIdCounter = 0;
let unitsList = [];

const materialsCount = document.getElementById("materials-count");
const unitsCount = document.getElementById("units-count");
const areaCount = document.getElementById("area-count");
const gameMap = document.getElementById("game-map");
const placeBarracksBtn = document.getElementById("place-barracks-btn");
const trainArcherBtn = document.getElementById("train-archer-btn");
const trainWarriorBtn = document.getElementById("train-warrior-btn");
const trainHealerBtn = document.getElementById("train-healer-btn");
const endTurnBtn = document.getElementById("end-turn-btn");
const minimap = document.getElementById("minimap");

const gridSize = 100; // 100x100 grid = 10,000 hexagons
const hexSize = 60;

// Create the hexagonal grid
function createGameMap() {
  const hexRows = gridSize;
  const hexCols = gridSize;
  const offsetX = hexSize * 0.75;
  const offsetY = hexSize * Math.sqrt(3) / 2;

  for (let row = 0; row < hexRows; row++) {
    for (let col = 0; col < hexCols; col++) {
      const hex = document.createElement("div");
      const x = col * offsetX;
      const y = row * offsetY;

      if (col % 2 === 1) {
        y += offsetY / 2; // Offset every other column for the hex pattern
      }

      hex.classList.add("hexagon");
      hex.style.top = `${y}px`;
      hex.style.left = `${x}px`;
      hex.setAttribute("data-x", col);
      hex.setAttribute("data-y", row);
      hex.addEventListener("click", () => handleHexClick(col, row));
      gameMap.appendChild(hex);
    }
  }
}

// Handle hexagon click for unit movement or barracks placement
function handleHexClick(x, y) {
  if (isPlacingBarracks && materials >= 25) {
    materials -= 25;
    areaControlled += 10; // Each barracks increases area controlled by 10m²
    updateUI();
    isPlacingBarracks = false;
    alert("Barracks placed!");
  } else if (selectedUnit) {
    moveUnit(selectedUnit, x, y);
  }
}

// Start placing barracks
placeBarracksBtn.addEventListener("click", () => {
  isPlacingBarracks = true;
  alert("Click on the hex grid to place a barracks!");
});

// Train Archer
trainArcherBtn.addEventListener("click", () => {
  if (materials >= 100) {
    materials -= 100;
    units += 1;
    unitsList.push(createUnit("Archer"));
    updateUI();
  } else {
    alert("Not enough materials!");
  }
});

// Train Warrior
trainWarriorBtn.addEventListener("click", () => {
  if (materials >= 50) {
    materials -= 50;
    units += 1;
    unitsList.push(createUnit("Warrior"));
    updateUI();
  } else {
    alert("Not enough materials!");
  }
});

// Train Healer
trainHealerBtn.addEventListener("click", () => {
  if (materials >= 125) {
    materials -= 125;
    units += 1;
    unitsList.push(createUnit("Healer"));
    updateUI();
  } else {
    alert("Not enough materials!");
  }
});

// Move Unit
function moveUnit(unit, x, y) {
  unit.position.x = x;
  unit.position.y = y;

  const unitElement = document.getElementById(`unit-${unit.id}`);
  unitElement.style.left = `${x * hexSize * 0.75}px`;
  unitElement.style.top = `${y * hexSize * Math.sqrt(3) / 2}px`;

  selectedUnit = null;
}

// Select Unit
function selectUnit(unit) {
  selectedUnit = unit;
  const unitElement = document.getElementById(`unit-${unit.id}`);
  unitElement.classList.add("selected");
}

// Create Unit
function createUnit(type) {
  unitIdCounter++;
  const unit = {
    id: unitIdCounter,
    type: type,
    health: 100,
    position: { x: 0, y: 0 }, // Starting position (default top-left)
  };

  // Create a DOM element for the unit
  const unitElement = document.createElement("div");
  unitElement.classList.add("unit");
  unitElement.style.top = `${unit.position.y * hexSize * Math.sqrt(3) / 2}px`;
  unitElement.style.left = `${unit.position.x * hexSize * 0.75}px`;
  unitElement.setAttribute('id', `unit-${unit.id}`);
  unitElement.innerHTML = `<div class="unit-bar"><div class="unit-bar-inner" style="width: 100%;"></div></div>`;
  unitElement.addEventListener("click", () => selectUnit(unit));
  gameMap.appendChild(unitElement);

  return unit;
}

// Update UI
function updateUI() {
  materialsCount.textContent = `Materials: ${materials}`;
  unitsCount.textContent = `Units: ${units}`;
  areaCount.textContent = `Area Controlled: ${areaControlled}m²`;
}

// Initialize the game
createGameMap();
updateUI();

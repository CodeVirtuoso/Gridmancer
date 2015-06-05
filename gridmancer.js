var gridData = this.getNavGrid().grid; // Original grid structure
var gridMaxX = gridData[0].length - 1; // Rightmost point of the grid
var gridMaxY = gridData.length - 1; // Highest point of the grid
var tileSize = 4; // Each tile is 4x4 meters

var grid = []; // Binary representation of the grid structure
var gridRow = []; // Binary representation of a single row in the grid
var x; // X position marker
var y; // Y position marker

// Create binary representation of the grid, so we can deal with logic separately from implementation details
for (y = 0; y + tileSize < gridMaxY; y += tileSize) {
	for (x = 0; x + tileSize < gridMaxX; x += tileSize) {
		gridData[y][x].length > 0 ? gridRow.push(1) : gridRow.push(0);
	}
	grid.push(gridRow);
	gridRow = [];
}

var buildingModeX = false; 
var buildingModeY = false;
var startX;
var startY;
var currentX;
var currentY;
var tilesWidth;
var tilesHeight;
var takenX;
var takenY;
var leftSideOpen;
var rightSideOpen;

// Parse tiles of our logical grid, from left to right, from bottom to top
for (y = 0; y < grid.length; y += 1) {
	for (x = 0; x < grid[0].length; x += 1) {	
		// When available field is found, if we're not currently building a rectangle, start one. Add a horizontal tile to the current rectangle.
		if (grid[y][x] === 0) {
			if (buildingModeX === false) {
				startX = x;
				tilesWidth = 0;
				buildingModeX = true;
				buildingModeY = false;
			}			
			tilesWidth += 1;			
		} else {		
			// If we were building a rectangle horizontally, and just hit the wall, now try building it out vertically as much as we can.
			if (buildingModeX === true) { 
				startY = y;
				currentX = startX;
				currentY = startY;				
				tilesHeight = 1;			
				buildingModeX = false;
				buildingModeY = true;
				leftSideOpen = false;
				rightSideOpen = false;
				
				while (buildingModeY === true) {
					currentY += 1;
					
					// Check if there's an available field on the left side
					if (startX > 0) {
						if (grid[currentY][startX - 1] === 0) {
							leftSideOpen = true;
						}
					}
			
					// Check if there's an available field on the right side					
					if (startX + tilesWidth < gridMaxX) {
						if (grid[currentY][startX + tilesWidth] === 0) {
							rightSideOpen = true;
						}						
					}
					
					// Check if we've reached the crossroad
					if (leftSideOpen === true && rightSideOpen === true) {
						buildingModeY = false;
					} else {					
						// If we're not at the crossroad, see can we build up our rectangle for one more level
						for (currentX = startX; currentX < startX + tilesWidth; currentX += 1) {
							if (grid[currentY][currentX] !== 0) {
								buildingModeY = false;
							}
						}
						if (buildingModeY === true) {
							tilesHeight += 1;
						}
					}
				}
				
				// Update our binary map, by marking fields of our new rectangle as taken
				for (takenY = startY; takenY < startY + tilesHeight; takenY += 1) {
					for (takenX = startX; takenX < startX + tilesWidth; takenX += 1) {					
						grid[takenY][takenX] = 1;
					}
				}				

				// Draw the rectangle
				this.addRect((startX + tilesWidth - tilesWidth / 2) * tileSize, (startY + tilesHeight - tilesHeight / 2) * tileSize, tilesWidth * tileSize, tilesHeight * tileSize);
			}
		}
	}
}

// We win! Brag about the score!
this.say(this.spawnedRectangles.length);

const defaultAttributeScores = [15, 14, 13, 12, 10, 8];

// Fisher-Yates algorithm for randomly sorting an array
function shuffleArray(targetArray) {
    let shuffled = Array.from(targetArray); // Creates a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Fixed double Math.floor
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled; // Returning the shuffled array
}

class Player {
    constructor(characterName = 'Naruto') {
        this.name = characterName;
        this.attributes = {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        };
        
        
        // Shuffle and assign the default attribute scores
        let shuffledResult = shuffleArray(defaultAttributeScores);
        for (const [key, value] of Object.entries(this.attributes)) {
            let attributeValue = shuffledResult.pop();
            this.attributes[key] = attributeValue;
        }
    }

    rollAttributes() {
        // Rolls for each attribute
        for (const key in this.attributes) {
            let results = diceRoller(4, 6); // Roll 4d6
            results.sort((a, b) => a - b); // Sort in ascending order
            results.shift(); // Drop the lowest value
            let sum = sumArrayElements(results); // Sum the remaining 3 dice
            this.attributes[key] = sum; // Update the attribute with the new value
        }
    }

    printPlayer() {
        // Prints the player's name and attributes
        console.log(`NAME: ${this.name}`);
        for (const [key, value] of Object.entries(this.attributes)) {
            console.log(`${key.slice(0, 3).toUpperCase()}: ${value}`); // Abbreviation and value
        }
    }
}

// Function to simulate dice rolls
function diceRoller(times, sides) {
    let results = [];
    for (let i = 0; i < times; i++) {
        results.push(Math.floor(Math.random() * sides) + 1); // Roll a single dice
    }
    return results;
}

// Function to sum elements of an array
function sumArrayElements(array) {
    return array.reduce((total, currentNumber) => total + currentNumber); // Sum all elements
}

// Create and print two players
const player01 = new Player();
player01.printPlayer();

const player02 = new Player('Son Goku');
player02.rollAttributes();
player02.printPlayer();



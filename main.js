const defaultAttributeScores = [15, 14, 13, 12, 10, 8];

// Fisher-Yates algorithm for randomly sorting an array
function shuffleArray(targetArray) {
  const shuffled = Array.from(targetArray); // Creates a copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Fixed double Math.floor
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled; // Returning the shuffled array
}

class Player {
  constructor(characterName = "Selected Character") {
    this.name = characterName;
    this.attributes = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    };

    // Shuffle and assign the default attribute scores
    const shuffledResult = shuffleArray(defaultAttributeScores);
    for (const key of Object.keys(this.attributes)) {
      const attributeValue = shuffledResult.pop();
      this.attributes[key] = attributeValue;
    }
  }

  rollAttributes() {
    // Rolls for each attribute
    for (const key in this.attributes) {
      const results = diceRoller(4, 6); // Roll 4d6
      results.sort((a, b) => a - b); // Sort in ascending order
      results.shift(); // Drop the lowest value
      const sum = sumArrayElements(results); // Sum the remaining 3 dice
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
  const results = [];
  for (let i = 0; i < times; i++) {
    results.push(Math.floor(Math.random() * sides) + 1); // Roll a single dice
  }
  return results;
}

// Function to sum elements of an array
function sumArrayElements(array) {
  return array.reduce((total, currentNumber) => total + currentNumber, 0); // Sum all elements
}

// Map characters to images (stored in /Images)
const characterImages = {
  "Naruto": "Images/Image 2.png",
  "Son Goku": "Images/Image 1.png",
  "Luffy": "Images/Image 3.png",
  "Tanjiro": "Images/Image 4.png",
};

let currentSelection = {
  name: "Pick A Character",
  img: characterImages["Son Goku"],
};

function selectCharacter(name) {
  const imgSrc = characterImages[name] ||
    "https://via.placeholder.com/300?text=No+Image";
  currentSelection = { name, img: imgSrc };

  // Update main card
  document.getElementById("char-name").textContent = name;
  document.getElementById("char-img").src = imgSrc;

  // Clear optional custom name input
  const input = document.getElementById("player-name");
  if (input) input.value = "";

  // Highlight selected thumbnail
  document.querySelectorAll(".char-buttons img").forEach((img) => {
    img.classList.toggle("selected", img.dataset.name === name);
  });

  // Reset stats output message
  document.getElementById("stats-output").innerHTML =
    '<p>Click "Roll Stats" to begin!</p>';
}

function renderAttributes(attributes) {
  const container = document.getElementById("stats-output");
  container.innerHTML = "";

  for (const [key, value] of Object.entries(attributes)) {
    const statBox = document.createElement("div");
    statBox.className = "stat-box";
    statBox.innerHTML = `<div class="stat-label">${
      key.slice(0, 3).toUpperCase()
    }</div><div class="stat-value">${value}</div>`;
    container.appendChild(statBox);
  }
}
// deno-lint-ignore no-unused-vars
function triggerRoll() {
  const nameInput = document.getElementById("player-name").value.trim();
  const name = nameInput || currentSelection.name;

  const player = new Player(name);
  player.rollAttributes();

  renderAttributes(player.attributes);

  document.getElementById("char-name").textContent = name;
}
// deno-lint-ignore no-unused-vars
function assignPreset() {
  const nameInput = document.getElementById("player-name").value.trim();
  const name = nameInput || currentSelection.name;

  const player = new Player(name); // constructor assigns shuffled defaults
  renderAttributes(player.attributes);

  document.getElementById("char-name").textContent = name;
}

// Initialize UI selection
selectCharacter(currentSelection.name);

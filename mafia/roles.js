class playerRole {
    constructor (image, name, description) {
        this.image = image;
        this.name = name;
        this.description = description;
    }
}

function replaceText (text, unwantedText, desirableText) {
    return text.split(unwantedText).join(desirableText);
}

var roleTags = document.getElementById("role");
// roleTags Children

var roleTitle = roleTags.children[0];
var roleImage = roleTags.children[1];
var roleDescription = roleTags.children[2];

var roles = [];

var roleNames = localStorage.getItem("roleNames").split(",");
var roleDescs = localStorage.getItem("roleDescs").split(",");
var roleImages = localStorage.getItem("roleImages").split(",");

var roleCount = localStorage.getItem("roleCount").split(",");

roleCount = roleCount.map(x => parseInt(x));

roleNames = roleNames.map(z => replaceText(z, "$", ","));
roleDescs = roleDescs.map(z => replaceText(z, "$", ","));

for (let n = 0; n < roleNames.length; n++) {
    roles.push(new playerRole(roleImages[n], roleNames[n], roleDescs[n]))
}

var playerCount;
// Roles of the players
var playerRoles = [];
// Player names
var playerNames = [];

// Generate each specific count of the roles
if (!localStorage.getItem("plaguePlayerCount")) {
    for (let j = 0; j < roleCount.length; j++) {
        for (let i = 0; i < roleCount[j]; i++) {
            playerRoles.push(roles[j]);
            playerCount = playerRoles.length;
        }
    }

    generateNames(playerCount);
} else {
    generateNames(localStorage.getItem("plaguePlayerCount"));

    for (let i = 0; i < localStorage.getItem("plaguePlayerCount"); i++) {
        playerCount = parseInt(localStorage.getItem("plaguePlayerCount"));
        playerRoles.push(new playerRole("Icons/innocent1.png", "Innocent", "You have no special abilities."));
    }
}

playerRoles = playerRoles.sort(() => Math.random() - 0.5);

var hideRole = document.getElementById("hideRole");
var playerHeaderElements = document.getElementsByClassName("playerHeader");

// Variable for array
var index = 0;
// Timeout variable
var x;

generateRole();

playerHeaderElements[1].addEventListener("input", nameChange);
playerHeaderElements[1].addEventListener("propertychange", nameChange);

hideRole.addEventListener("click", () => {          
    hideRole.classList.add("hidden");

    x = setTimeout(() => {
        hideRole.classList.remove("hidden");
    }, 2500);
});

playerHeaderElements[0].addEventListener("click", () => {
    clearTimeout(x);
    hideRole.classList.remove("hidden");

    if (index !== 0) {
        index--;
    }

    if (index < playerCount - 1) {
        playerHeaderElements[2].classList.remove("hidden");
    }

    if (index === 0) {
        playerHeaderElements[0].classList.add("hidden");
    }

    playerHeaderElements[1].value = playerNames[index];
    generateRole();
});

playerHeaderElements[2].addEventListener("click", () => {
    clearTimeout(x);
    hideRole.classList.remove("hidden");

    if (index !== playerCount - 1) {
        index++;
    }

    if (index > 0) {
        playerHeaderElements[0].classList.remove("hidden");
    }

    if (index === playerCount - 1) {
        playerHeaderElements[2].classList.add("hidden");
    }
    
    playerHeaderElements[1].value = playerNames[index];
    generateRole();
});

function generateRole() {
    var role = playerRoles[index];

    roleTitle.innerText = role.name;

    roleImage.src = role.image;
    roleImage.alt = role.name;

    roleDescription.innerText = role.description;
}

function generateNames(count) {
    for (let i = 1; i <= count; i++) {
        playerNames.push(`Player ${i}`);
    }
}

function nameChange (e) {
    playerNames[index] = e.target.value;
}
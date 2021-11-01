var blackPlagueBool = false;

function replaceText (text, unwantedText, desirableText) {
    return text.split(unwantedText).join(desirableText);
}

if (!localStorage.roleNames || !localStorage.roleDescs || !localStorage.roleImages) {
    alert("No roles submitted yet, go to Roles button on home screen and interact with the roles.");
    window.location = "./index.html";
}

var backupNames = localStorage.getItem("roleNames");
var roleNames = localStorage.getItem("roleNames").split(',');
var roleDescs = localStorage.getItem("roleDescs");
var roleImages = localStorage.getItem("roleImages");

for (let i = 0; i < roleNames.length; i++) {
    roleNames[i] = replaceText(roleNames[i], "$", ",");
}

// Create the role inputs
for (let name of roleNames) {

    // Create paragraph tag for each role name
    let roleName = document.createElement('p');
    roleName.innerText = `${name}: `;

    // Create input to append
    let input = document.createElement('input');
    input.type = 'number';
    input.classList.add('gameRules');
    input.min = '0';

    roleName.appendChild(input);

    document.querySelector('#roles').appendChild(roleName);
}

var gameRules = document.getElementsByClassName("gameRules");
var pRules = document.getElementsByTagName("p");

// Specials Bool
gameRules[gameRules.length - 1].addEventListener('click',() => {
    blackPlagueBool = !blackPlagueBool;

    if (blackPlagueBool) {
        document.getElementById("blackPlagueCount").classList.remove("hidden");

        for (p of pRules) {
            if (p === pRules[pRules.length - 2]) {
                break;
            }

            p.classList.add("disabled");
            p.lastChild.setAttribute("readonly", "");
            p.lastChild.value = "";
        }
    } else {
        document.getElementById("blackPlagueCount").classList.add("hidden");

        for (p of pRules) {
            p.classList.remove("disabled");
            p.lastChild.removeAttribute("readonly", "");
        }

    }
});

var specialShowBool = false;

// Show Specials and Hide Specials TEXT
document.querySelector("#showSpecials").addEventListener("click", () => {
    let special = document.querySelector("#special");
    specialShowBool = !specialShowBool;
    
    if (specialShowBool) {
        special.classList.remove("hidden");
        document.querySelector("#showSpecials").innerHTML = "Hide Specials &#9650;";
    } else {
        special.classList.add("hidden");
        document.querySelector("#showSpecials").innerHTML = "Show Specials &#9660;";
    }
});

// Submit Button
document.querySelector("button").addEventListener("click", () => {

    if (typeof(Storage) !== "undefined" && localStorage.roleNames) {
        localStorage.clear();

        let roleCount = [];

        for (b of gameRules) {
            if (b === gameRules[gameRules.length - 1]) {
                if (b.checked) {
                    localStorage.setItem("plaguePlayerCount", parseInt(document.querySelector("#blackPlagueCount").value));
                }
            }

            // Set values for localStorage if specials not checked
            // if (b.value && b.value > 0) {
            //     roleCount.push(parseInt(b.value));
            // }

            if (Math.sign(parseInt(b.value)) <= 0 || !b.value) {
                roleCount.push(0);
            } else {
                roleCount.push(parseInt(b.value));
            }
        }
        localStorage.setItem("roleCount", roleCount);
        localStorage.setItem("roleNames", backupNames);
        localStorage.setItem("roleDescs", roleDescs);
        localStorage.setItem("roleImages", roleImages);
        
        window.location = "./rolegeneration.html";

    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
});

// HEY the localstorage keeps clearing for some reason so find a way to keep it, set a seperate variable for the names, don't call the images or descriptions yet until roles.js, thanks
fetch('https://efvarts.github.io/roles.txt')
    .then(response => response.text())
    .then(text => createRole(text.split('\n')))
    .catch(err => console.error(err))

var rolesDiv = document.querySelector('#rolesList');
var addDiv = document.querySelector('#add');

function createRole(txt) {
    if (txt.length % 3){
        txt.pop();
    }

    for (i = 0; i < txt.length / 3; i++) {
        let roleDiv = document.createElement('div');
        roleDiv.classList.add('role');

        let headingInput = document.createElement('input');
        headingInput.classList.add('headingInput');
        headingInput.value = txt[i*3];
        headingInput.placeholder = 'Name of role';
        headingInput.maxLength = '30';

        let descriptionInput = document.createElement('textarea');
        descriptionInput.classList.add('descriptionInput');
        descriptionInput.value = txt[1+i*3];
        descriptionInput.placeholder = 'Description of role';

        let image = document.createElement('img');
        image.alt = headingInput.value;
        image.src = txt[2+i*3] ?? '';

        let imageInput = document.createElement('input');
        imageInput.type = "url";
        imageInput.placeholder = "Image URL"
        imageInput.classList.add('imageInput');
        imageInput.addEventListener('change', () => loadFile(image, imageInput.value));

        let imageDiv = document.createElement('div');
        imageDiv.classList.add('imageDiv');
        imageDiv.appendChild(image);
        imageDiv.appendChild(imageInput);
        
        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerText = 'Remove';
        btn.onclick = () => removeRole(roleDiv);
        
        roleDiv.appendChild(headingInput);
        roleDiv.appendChild(imageDiv);
        roleDiv.appendChild(descriptionInput);
        roleDiv.appendChild(btn);

        // Maybe have a seperate div for the image and input so it can flow columm

        // Insert in div before the add element
        roleDiv = rolesDiv.insertBefore(roleDiv, addDiv);
    }
    lengthChange();
}


addDiv.addEventListener('click', () => {
    createRole(['Placeholder','','']);
});

var roles = [];

// Resposible for { roles [] }
// currentObject is an input element for role names
    function rolesWrite () {
        roles = [];

        let images = [];
        let descriptions = [];

        for (let r of document.getElementsByClassName('headingInput')) {
            roles.push(r.value.split(',').join('$'));

            // Images
            let image = r.parentElement.children[1].children[0].src ?? '';
            images.push(image);

            // Descriptions
            let description = r.parentElement.children[2].value.split(',').join('$') ?? '';
            descriptions.push(description);
        }

        // Local Storage Data
        localStorage.setItem('roleNames', roles);
        localStorage.setItem('roleImages', images);
        localStorage.setItem('roleDescs', descriptions);
        localStorage.setItem('roleCount', '');
    }

function lengthChange () {
    var roleNames = document.getElementsByClassName('headingInput');

    console.log();

    function changeWidth(a) {
        a.style.width = `${a.value.length}ch`;
    }
    
    for (let b of roleNames) {
        changeWidth(b);

        // The image corresponding to the name given
        let imageToName = b.parentElement.children[1];
        let descriptionInput = b.parentElement.children[2];

        // Role name input
        b.addEventListener('input', function () {
            changeWidth(b);
            imageToName.alt = b.value;

            rolesWrite();
        });

        b.addEventListener('propertychange', function () {
            changeWidth(b);

            rolesWrite();
        });

        // Description Input
        descriptionInput.addEventListener('input', function () {
            rolesWrite();
        });

        descriptionInput.addEventListener('propertychange', function () {
            rolesWrite();
        });

        rolesWrite();
    }
};

function loadFile(image, source) {
    image.src = source;
    rolesWrite();
}

function removeRole(roleHTML) {
    roleHTML.remove();
    rolesWrite();
}
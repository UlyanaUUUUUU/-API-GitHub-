searchInput = document.querySelector('.search_input');
users = document.querySelector('.users');
user = document.querySelector('.user');
usersWrapper = document.querySelector('.users_wrapper');
saveList = document.querySelector('.save_list');

const userPerPage = 5;

function createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
        element.classList.add(elementClass);
    }
    return element;
}

function createUser(userData) {
    const userElement = createElement('li', 'user');
    userElement.textContent = ` ${userData.name}`;

    this.users.append(userElement);

    userElement.addEventListener('click', saveUsers(userData))

}

let closeBtn
let saveUser

function saveUsers(userData) {
    return function () {
        saveUser = createElement('li', 'save_user')
        saveUser.innerHTML = `Name: ${userData.name}<br>
                                         Owner: ${userData.owner.login}<br>
                                        Stars: ${userData.stargazers_count}`;
        saveList.append(saveUser)
        closeBtn = createElement('button', 'close_button')
        saveUser.append(closeBtn)

        clearUsers()
        searchInput.value = ''
    }
}

document.querySelector('.list').onclick = function (e) {
    const btn = e.target.closest('.close_button');
    if (!btn) {
        return;
    }
    btn.parentElement.remove()

}


searchInput.addEventListener('keyup', debounce(loadUsers, 500));

async function loadUsers() {
    const searchValue = searchInput.value;
    usersWrapper.style.display = "none";
    if (searchValue) {
        clearUsers()
        usersRequest(searchValue)
        usersWrapper.style.display = "block";

    } else {
        clearUsers()
    }
}

async function usersRequest(searchValue) {
    return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&sort=stars&per_page=${userPerPage}`)
        .then(res => {
            if (res.ok) {
                res.json().then(res => {
                    res.items.forEach(user => {
                        createUser(user)
                    })
                })
            }
        })

}

function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        const context = this;

        clearTimeout(timer);

        timer = setTimeout(() => {

            fn.apply(context, args);
        }, debounceTime);
    };
}

function clearUsers() {
    users.textContent = '';
}



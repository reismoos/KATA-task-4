const gitUrl = 'https://api.github.com/search/repositories?q=';
const autocBox = document.querySelector('.autocomplite-box');
const input = document.querySelector('input');
const cardList = document.querySelector('.repo-card-list');
const wrapper = document.querySelector('.wrapper');
const savedAnswer = {
    data : []
}

function sendRequest (url) {
    return fetch(url).then(response => response.json())
}

function createAutoComplete(name, container, n) {
    const p = document.createElement('p');
    p.classList.add('autocomplite__item');
    p.setAttribute('data-n', n)
    p.textContent = name;
    container.appendChild(p);
}

function clearBox () {
    while (autocBox.firstChild) {
        autocBox.removeChild(autocBox.firstChild)
    }
}

function request () {
    if (input.value.trim()) {
        let url = gitUrl + input.value;
        sendRequest(url).then(response =>{
            clearBox();
            let fragment = document.createDocumentFragment();
            response.items.forEach((el, i) => {
                if (i < 5) {
                    savedAnswer.data[i] = el;
                    createAutoComplete(el.name, fragment, i)
                }
            });
            autocBox.appendChild(fragment)  
            
        } )
        .catch(er => console.log(er))
    } else return

}

function createRepoList ({name, owner: {login}, stargazers_count}) {
    const card = document.createElement('div');
    card.classList.add('repo-card');
    const classesArr = ['name', 'owner', 'stars'];

    for (let className of classesArr) {
        const p = document.createElement('p');
        p.classList.add(`card-${className}`);
        if (p.classList.contains('card-name')) {
            p.textContent = `Name: ${name}`
        } else if (p.classList.contains('card-owner')) {
            p.textContent = `Owner: ${login}`
        } else {
            p.textContent = `Stars: ${stargazers_count}`
        }
        card.appendChild(p)
    }

    const close = document.createElement('div');
    close.classList.add('close');
    card.appendChild(close);

    cardList.appendChild(card)
}

wrapper.addEventListener('click', e => {
    if(e.target.classList.contains('autocomplite__item')) {
        createRepoList(savedAnswer.data[e.target.dataset.n])
        input.value = '';
        clearBox();
    } else if (e.target.classList.contains('close')) {
        cardList.removeChild(e.target.closest('.repo-card'))
    }

})

function debounce (cb, ms) {
    let functionDebounced;
    return function () {
        const fnCall = () => {cb.apply(this, arguments)}
        clearTimeout(functionDebounced);
        functionDebounced = setTimeout(fnCall, ms)
    }
}

request = debounce(request, 500);

input.addEventListener('keyup', request);
const leftMenuNode = document.querySelector('#leftMenu');
const showMenuBtnNode = document.querySelector('#showMenuBtn');
const closeBtnNode = document.querySelector('#closeBtn');

closeBtnNode.addEventListener('click', () => {
    if(!leftMenuNode.classList.contains("hidden")) {
        leftMenuNode.classList.add("hidden");
    }
});

showMenuBtnNode.addEventListener('click', () => {
    leftMenuNode.classList.remove("hidden");
});

document.addEventListener('click', (e) => {
    if (e.target.id !== 'showMenuBtn' && e.target.id !== 'closeBtn' && e.target.id !== 'leftMenu') {
        if(!leftMenuNode.classList.contains("hidden")) {
            leftMenuNode.classList.add("hidden");
        }
    }
});
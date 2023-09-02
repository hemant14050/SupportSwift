const leftMenuNode = document.querySelector('#leftMenu');
const showMenuBtnNode = document.querySelector('#showMenuBtn');
const closeBtnNode = document.querySelector('#closeBtn');

closeBtnNode.addEventListener('click', () => {
    leftMenuNode.style = 'display: none';
});

showMenuBtnNode.addEventListener('click', () => {
    leftMenuNode.style = 'display: flex';
});

document.addEventListener('click', (e) => {
    if (e.target.id !== 'showMenuBtn' && e.target.id !== 'closeBtn' && e.target.id !== 'leftMenu') {
        leftMenuNode.style = 'display: none';
    }
});
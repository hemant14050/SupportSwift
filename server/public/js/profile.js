const profileBtnNode = document.getElementById('profileBtn');
const profilePicNode = document.getElementById('profilePic');
const profileContentNode = document.getElementById('profileContent');

profileBtnNode.addEventListener('click', () => {
    profileContentNode.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    if((event.target !== profilePicNode) && !profileContentNode.classList.contains('hidden')) {
        profileContentNode.classList.add('hidden');
    }
});
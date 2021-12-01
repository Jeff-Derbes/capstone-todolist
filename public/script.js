const rulesBtn = document.querySelector('#rules-btn')
const closeBtn = document.querySelector('#close-btn')
const rules = document.querySelector('.rules')

rulesBtn.addEventListener('click', () => rules.classList.add('show'))

closeBtn.addEventListener('click', () => rules.classList.remove('show'))

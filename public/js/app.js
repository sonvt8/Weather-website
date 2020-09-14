const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messOne = document.querySelector('#message-1')
const messTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value
    url = '/weather?address=' + location

    messOne.textContent = 'Loading.....'
    messTwo.textContent = ''

    fetch(url).then((res) => {
        res.json().then((data) => {
            if (data.error) {
                messOne.textContent = data.error
            } else {
                messOne.textContent = data.location
                messTwo.textContent = data.forecast
            }
        })
    })
})
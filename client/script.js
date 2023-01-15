import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = 'Please wait'

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === 'Please wait....') {
            element.textContent = 'Please wait';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    text = text.replace(/\\n/g, "<br>");

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML = text;  //This is the line I added to make the page breaks work!!
//            element.innerHTML += text.charAt(index)  //For now I can't do both paragraph breaks and one at a time typing. 
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <br>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

form.addEventListener('submit', handleSubmit)

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('devTopic'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    // https://betterbydai.onrender.com   http://localhost:3000
    const response = await fetch('https://betterbydai.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            devTopic: data.get('devTopic')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        const parsedDataString = JSON.stringify(parsedData)  // convert parsedData to a string
        const updatedParsedDataString = parsedDataString.replace(/\\n/g, "<br />")  // replace \n with <br />

        const updatedParsedData = JSON.parse(updatedParsedDataString)  // convert updatedParsedDataString back to an object

        typeText(messageDiv, updatedParsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}


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

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
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

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('devTopic','storeCity','visitDate','difLvlToFind','difLvlToUse','disabledSpaces','parkingKeywords','lobbyAesthetic','lobbySize','lobbySpeed','lobbyAtmos','lobbyLighting','lobbyDisplays','lobbyKeywords','btDesc','btComfort','btKnowledge','btQuestion','btKeywords','cOpkgDesc','coPmt','coKeywords','unboxDiff','unboxRateClr','unboxAppeal','unboxColors','unboxOdorInt','unboxOdorNotes','unboxKeywords','prepOdorNotes','prepMoisture','prepTasteNotes','prepKeywords','finalTasteRate','finalTasteNotes','finalEven','finalAshClr','finalMed','finalKeywords'))

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

    const response = await fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            devTopic: data.get('devTopic'),
            storeCity: data.get('storeCity'),
            visitDate: data.get('visitDate'),
            difLvlToFind: data.get('difLvlToFind'),
            difLvlToUse: data.get('difLvlToUse'),
            disabledSpaces: data.get('disabledSpaces'),
            parkingKeywords: data.get('parkingKeywords'),
            lobbyAesthetic: data.get('lobbyAesthetic'),
            lobbySize: data.get('lobbySize'),
            lobbySpeed: data.get('lobbySpeed'),
            lobbyAtmos: data.get('lobbyAtmos'),
            lobbyLighting: data.get('lobbyLighting'),
            lobbyDisplays: data.get('lobbyDisplays'),
            lobbyKeywords: data.get('lobbyKeywords'),
            btDesc: data.get('btDesc'),
            btComfort: data.get('btComfort'),
            btKnowledge: data.get('btKnowledge'),
            btQuestion: data.get('btQuestion'),
            btKeywords: data.get('btKeywords'),
            cOpkgDesc: data.get('cOpkgDesc'),
            coPmt: data.get('coPmt'),
            coKeywords: data.get('coKeywords'),
            unboxDiff: data.get('unboxDiff'),
            strain: data.get('strain'),
            unboxRateClr: data.get('unboxRateClr'),
            unboxAppeal: data.get('unboxAppeal'),
            unboxColors: data.get('unboxColors'),
            unboxOdorInt: data.get('unboxOdorInt'),
            unboxOdorNotes: data.get('unboxOdorNotes'),
            unboxKeywords: data.get('unboxKeywords'),
            prepOdorNotes: data.get('prepOdorNotes'),
            prepMoisture: data.get('prepMoisture'),
            prepTasteNotes: data.get('prepTasteNotes'),
            prepKeywords: data.get('prepKeywords'),
            finalTasteRate: data.get('finalTasteRate'),
            finalTasteNotes: data.get('finalTasteNotes'),
            finalEven: data.get('finalEven'),
            finalAshClr: data.get('finalAshClr'),
            finalMed: data.get('finalMed'),
            finalKeywords: data.get('finalKeywords')
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

form.addEventListener('submit', handleSubmit)

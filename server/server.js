import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Maria!'
  })
})

app.post('/', async (req, res) => {
  try {
    const devTopic = req.body.devTopic;
    const storeCity = req.body.storeCity;
    const visitDate = req.body.visitDate;
    const difLvlToFind = req.body.difLvlToFind;
    const difLvlToUse = req.body.difLvlToUse;
    const disabledSpaces = req.body.disabledSpaces;
    const parkingKeywords = req.body.parkingKeywords;
    const lobbyAesthetic = req.body.lobbyAesthetic;
    const lobbySize = req.body.lobbySize;
    const lobbySpeed = req.body.lobbySpeed;
    const lobbyAtmos = req.body.lobbyAtmos;
    const lobbyLighting = req.body.lobbyLighting;
    const lobbyDisplays = req.body.lobbyDisplays;
    const lobbyKeywords = req.body.lobbyKeywords;
    const btDesc = req.body.btDesc;
    const btComfort = req.body.btComfort;
    const btKnowledge = req.body.btKnowledge;
    const btQuestion = req.body.btQuestion;
    const btKeywords = req.body.btKeywords;
    const cOpkgDesc = req.body.cOpkgDesc;
    const coPmt = req.body.coPmt;
    const coKeywords = req.body.coKeywords;
    const unboxDiff = req.body.unboxDiff;
    const strain = req.body.strain;
    const unboxRateClr = req.body.unboxRateClr;
    const unboxAppeal = req.body.unboxAppeal;
    const unboxColors = req.body.unboxColors;
    const unboxOdorInt = req.body.unboxOdorInt;
    const unboxOdorNotes = req.body.unboxOdorNotes;
    const unboxKeywords = req.body.unboxKeywords;
    const prepOdorNotes = req.body.prepOdorNotes;
    const prepMoisture = req.body.prepMoisture;
    const prepTasteNotes = req.body.prepTasteNotes;
    const prepKeywords = req.body.prepKeywords;
    const finalTasteRate = req.body.finalTasteRate;
    const finalTasteNotes = req.body.finalTasteNotes;
    const finalEven = req.body.finalEven;
    const finalAshClr = req.body.finalAshClr;
    const finalMed = req.body.finalMed;
    const finalKeywords = req.body.finalKeywords;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a religious devotional about ${devTopic}. Then reference some bible verses about ${devTopic}. Then create 3 journaling prompts about ${devTopic}.`,
      temperature: 0.7, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.7, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(3000, () => console.log('AI server started on https://betterbydai.onrender.com'))

// ver 1.2
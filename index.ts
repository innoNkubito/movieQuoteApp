import dotenv from "dotenv-safe"
import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import freeClimbSdk from "@freeclimb/sdk"
import fetch from "node-fetch"

dotenv.config()
const { ACCOUNT_ID, API_KEY, HOST_URL, PORT, MOVIE_API } = process.env

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

interface MovieQuote {
    title: string
    year: number
    phrase: string
}

interface SmsBody {
    from: string
    text: string
    to: string
}

// init FreeClimb sdk 
const freeClimb = freeClimbSdk(ACCOUNT_ID, API_KEY)

const generateQuote = async (phrase: string): Promise<MovieQuote> => {
    // Movie quote api URL 
    const movieQuoteUrl = `${MOVIE_API}/${encodeURIComponent(phrase)}`

    // Trigger quote api request
    const mvResponse = await fetch(movieQuoteUrl, { method: "GET" })
    const movieQuotes: { docs: MovieQuote[] } = await mvResponse.json()

    // select random  element from returned array of quotes
    const randomIndex = Math.floor(Math.random() * (movieQuotes.docs.length - 1))
    return movieQuotes.docs[randomIndex]
}

app.get("/health", (req: Request, res: Response) => {
    res.json({
        data: {
            startTime: new Date().toLocaleString(),
            status: "Live"
        }
    })
})

app.post("/incomingCall", (req: Request, res: Response<freeClimbSdk.PerCL.Command[]>) => {
    const actionUrl = `${HOST_URL}/movieQuote`
    const grammarFile = `${HOST_URL}/grammar`
    const options: freeClimbSdk.PerCL.GetSpeechOptions = {
        grammarType: "URL",
        playBeep: true,
        grammarRule: "Movies",
        prompts: [
            {
                "Say": {
                    "text": "Please utter a phrase."
                }
            }
        ]
    }
    const getSpeech = freeClimb.percl.getSpeech(actionUrl, grammarFile, options)
    res.send(freeClimb.percl.build(getSpeech))
})

// Grammar URL/download url  for GetSpeech command
app.get("/grammar", (req: Request, res: Response) => {
    res.download("./files/test.xml", (err) => {
        if (err) {
            console.log(`Error downloading the XML file: ${err.message}`)
        }
    })
})

app.post("/movieQuote", async (req: Request<any, any, {
    recognitionResult: string
    to: string
    from: string
}>, res: Response<freeClimbSdk.PerCL.Command[]>) => {
    // Get Speech Recoginitio result
    const { recognitionResult: phrase, to, from } = req.body
    // redirect call command
    const redirect = freeClimb.percl.redirect(`${HOST_URL}/incomingCall`)
    if (phrase) {
        // Movie quote api URL 
        const randomQuote = await generateQuote(phrase)
        if (randomQuote) {
            const { title, phrase, year } = randomQuote
            const movieTitle = `${title} ${year}`
            const movieQuote = `The quote is: "${phrase}"`
            const resPercl = freeClimb.percl.build(freeClimb.percl.say(movieTitle), freeClimb.percl.say(movieQuote), freeClimb.percl.sms(to, from, `${movieTitle}`), redirect)
            res.send(resPercl)
        } else {
            res.send(freeClimb.percl.build(redirect))
        }
    } else {
        res.send(freeClimb.percl.build(redirect))
    }
})

app.post("/incomingSms", async (req: Request<any, any, SmsBody>, res: Response) => {
    console.log(req.body)
    const { from, to, text } = req.body

    const randomQuote = await generateQuote(text)

    if (randomQuote) {
        const { title, phrase, year } = randomQuote
        const movieTitle = `${title} ${year}`
        const movieQuote = `the quote is: "${phrase}"`
        await freeClimb.api.messages.create(to, from,`${movieTitle} ${movieQuote}`)
        res.sendStatus(200)
    } else {
        await freeClimb.api.messages.create(to, from, "Something unexpected happened")
    }
})

app.listen(PORT, () => {
    console.log(`Running app on: ${PORT}`)
})

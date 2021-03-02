const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express()
const port = 3010

app.use(bodyParser.urlencoded({ extended: true }))

let creditCardData = {number: null, expiration: null};

app.get('/', (req, res) => {
    res.send('I\m Alive!')
})

app.post('/incoming-call', (req, res) => {
    // Create TwiML response
    const twiml = new VoiceResponse();
    const gatherCreditCard = twiml.gather({
        numDigits: 16,
        action: '/gather-credit-card'
    });
    gatherCreditCard.say('Thank you for calling Travis. Please provide a fake 16 digit credit card to test this out.');

    // If the user doesn't enter an input, loop this question.
    twiml.redirect('/incoming-call')

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
})

app.post('/gather-credit-card', (req, res) => {
    const creditCardNumber = req.body.Digits;
    console.log('Credit Card Number Entered: ' + creditCardNumber)
    creditCardData.number = creditCardNumber

    const twiml = new VoiceResponse();
    const gatherDate = twiml.gather({
        numDigits: 4,
        action: '/gather-date'
    });
    gatherDate.say('Thank you. Please provide a fake 2 digit month and 2 digit year.');

    // If the user doesn't enter an input, loop this question.
    twiml.redirect('/gather-credit-card')

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
})

app.post('/gather-date', (req, res) => {
    const creditCardExpiration = req.body.Digits;
    console.log('Credit Card Expiration Entered: ' + creditCardExpiration)
    creditCardData.expiration = creditCardExpiration

    const twiml = new VoiceResponse();
    twiml.say('Thank you. Your fake payment worked!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

    console.log(creditCardData)
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
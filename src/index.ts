// import fs from 'fs'
// import readline from 'readline'
// import { google } from 'googleapis'
import dotenv from 'dotenv'
// import express from 'express'
import { MongoClient } from 'mongodb'

dotenv.config()

const {
  APP_DB_PROTOCOL,
  APP_DB_USERNAME,
  APP_DB_PASSWORD,
  APP_DB_HOST,
  APP_DB_PORT,
} = process.env
const client = new MongoClient(`${APP_DB_PROTOCOL}://${APP_DB_USERNAME}:${APP_DB_PASSWORD}@${APP_DB_HOST}:${APP_DB_PORT}`)

async function run() {
  try {
    await client.connect()

    const database = client.db(process.env.APP_DB_NAME)

    const pages = database.collection('pages')

    const movie = await pages.findOne({ title: 'Back to the Future' })

    console.log({ movie })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
run().catch(console.dir)

// // Constants
// const PORT = process.env.APP_PORT
// const HOST = process.env.APP_HOST

// // App
// const app = express()

// app.listen(PORT, HOST)
// console.log(`Running on http://${HOST}:${PORT}`)

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/documents.readonly']
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json'

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   })
//   console.log('Authorize this app by visiting this url:', authUrl)
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   })
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close()
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err)
//       oAuth2Client.setCredentials(token)
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (e) => {
//         if (err) console.error(e)
//         console.log('Token stored to', TOKEN_PATH)
//       })
//       return callback(oAuth2Client)
//     })
//   })
// }

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(callback) {
//   const oAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URI,
//   )

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback)
//     oAuth2Client.setCredentials(JSON.parse(token))
//     return callback(oAuth2Client)
//   })
// }

// /**
//  * Prints the title of a sample doc:
//  * https://docs.google.com/document/d/1MJ85BbYgjurQ6AyCaPpdaTHSgalzVouuBybJf5O0uos/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
//  */
// function printDocTitle(auth) {
//   const docs = google.docs({ version: 'v1', auth })
//   docs.documents.get({
//     documentId: '1MJ85BbYgjurQ6AyCaPpdaTHSgalzVouuBybJf5O0uos',
//   }, (err, res) => {
//     if (err) return console.log(`The API returned an error: ${err}`)
//     return res.data.title
//   })
// }

// app.get('/', (req, res) => {
//   console.log(authorize(printDocTitle))

//   res.send('Hello World')
// })

import { google } from 'googleapis'
import express from 'express'
import Token from './models/Token'
import Page from './models/Page'

const {
  APP_PORT,
  APP_HOST,
} = process.env

const app = express()

const documentId = '1MJ85BbYgjurQ6AyCaPpdaTHSgalzVouuBybJf5O0uos'

app.listen(APP_PORT, APP_HOST)

console.log(`Running on http://${APP_HOST}:${APP_PORT}`)

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly', 'https://www.googleapis.com/auth/drive.readonly']

function getClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
}

function generateAuthUrl() {
  const oAuth2Client = getClient()

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  return `<a target="__blank" href='${authUrl}'>${authUrl}</a>`
}

function getNewToken(code) {
  return new Promise((resolve, reject) => {
    const oAuth2Client = getClient()

    oAuth2Client.getToken(code, (err, token) => {
      if (err) reject(err)
      if (!token.access_token) reject(token)
      resolve(Token.insert({
        documentId,
        token,
      }))
    })
  })
}

function authorize(token) {
  const oAuth2Client = getClient()
  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

function printDocTitle(auth) {
  return new Promise((resolve, reject) => {
    const docs = google.docs({ version: 'v1', auth })

    docs.documents.get({
      documentId,
    }, (err, res) => {
      if (err) reject(err)
      if (!res?.data?.title) reject(res)
      resolve(res.data.title)
    })
  })
}

async function getDocument(auth) {
  const drive = google.drive({ version: 'v3', auth })

  return drive.files.export(
    {
      fileId: documentId,
      mimeType: 'text/html',
    },
  ).then(({ data }) => data)
}

app.get('/', async (_, res) => {
  res.send((await Page.first({ documentId })).attributes.html)
})

app.get('/admin', async (req, res) => {
  const token = (await Token.first({ documentId }))?.attributes?.token

  if (!token) {
    if (req.query.code) {
      await getNewToken(req.query.code)
    } else {
      res.send(generateAuthUrl())
    }
  }

  const client = authorize(token)

  const title = await printDocTitle(client)

  const html = await getDocument(client)

  await Page.update({ documentId }, { documentId, title, html })

  res.send(html)
})

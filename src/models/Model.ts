import { MongoClient } from 'mongodb'

const {
  APP_DB_PROTOCOL,
  APP_DB_USERNAME,
  APP_DB_PASSWORD,
  APP_DB_HOST,
  APP_DB_PORT,
} = process.env
const client = new MongoClient(`${APP_DB_PROTOCOL}://${APP_DB_USERNAME}:${APP_DB_PASSWORD}@${APP_DB_HOST}:${APP_DB_PORT}`)

async function run(collection, callback) {
  try {
    await client.connect()

    return await callback(client.db(process.env.APP_DB_NAME).collection(collection))
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

export default class Model {
  attributes: any

  constructor(attributes) {
    this.attributes = attributes
  }

  static get collection(): string {
    return `${this.name.toLowerCase()}s`
  }

  static async find(query) {
    return run(this.collection, async (pages) => pages.findOne(query))
  }
}

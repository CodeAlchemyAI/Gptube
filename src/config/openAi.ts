if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpeanAi key')
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''

export { OPENAI_API_KEY }

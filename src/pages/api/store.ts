import type { NextApiRequest, NextApiResponse } from 'next'
import { YoutubeTranscript, TranscriptResponse } from 'youtube-transcript'
import { OpenAI } from 'langchain/llms/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { pinecone } from '@/utils/pinecone-client'
import { PINECONE_INDEX_NAME } from '@/config/pinecone'
import { OPENAI_API_KEY } from '@/config/openAi'

const storeTranscript = async (text: string): Promise<PineconeStore> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs = await textSplitter.createDocuments([text])
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  })

  const index = pinecone.Index(PINECONE_INDEX_NAME)

  return await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
    namespace: 'test-2',
    textKey: 'text',
  })
}

const retrieveVectoreStore = async (): Promise<PineconeStore> => {
  return await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
    pineconeIndex: pinecone.Index(PINECONE_INDEX_NAME),
    namespace: 'test-2',
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const videoId = req.query.videoId as string | undefined

  if (!videoId) {
    res.status(400).json({ error: 'Video ID is required' })
    return
  }

  try {
    const transcriptResponse: TranscriptResponse[] =
      await YoutubeTranscript.fetchTranscript(videoId)

    if (!transcriptResponse || transcriptResponse.length === 0) {
      res.status(404).json({ error: 'No captions found for this video' })
      return
    }

    const index = pinecone.Index(PINECONE_INDEX_NAME)

    const transcript = transcriptResponse.map((t) => t.text.trim()).join(' ')

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const docs = await textSplitter.createDocuments([transcript])
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    })

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: videoId,
      textKey: 'text',
    })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error fetching captions' })
  }
}

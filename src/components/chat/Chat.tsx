import { useRef, useState, useEffect } from 'react'
import { Message } from '@/types/chat'
import BotBubble from './BotBubble'
import UserBubble from './UserBubble'
import { useRouter } from 'next/router'
import BubbleLoading from './BubbleLoading'
const Chat = () => {
  const router = useRouter()
  const { youtubeId } = router.query
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [messageState, setMessageState] = useState<{
    messages: Message[]
    pending?: string
    history: [string, string][]
    pendingSourceDocs?: Document[]
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this youtube video?',
        type: 'apiMessage',
      },
      {
        message: 'Eg: What is the video about?',
        type: 'apiMessage',
      },
    ],
    history: [],
  })

  const { messages, history } = messageState

  const messageListRef = useRef<HTMLDivElement>(null)
  const inputArea = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputArea.current?.focus()
  }, [])

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  async function handleSubmit(e: any) {
    e.preventDefault()

    setError(null)

    if (!query) {
      return
    }

    const question = query.trim()

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }))

    setLoading(true)
    setQuery('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          youtubeId: youtubeId,
          history,
        }),
      })
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }))
      }

      setLoading(false)

      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight)
    } catch (error) {
      setLoading(false)
      setError('An error occurred while fetching the data. Please try again.')
      console.log('error', error)
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e)
    } else if (e.key == 'Enter') {
      e.preventDefault()
    }
  }

  const DisplayBubble = (message: Message, key: number) => {
    if (message.type == 'apiMessage') {
      return (
        <div key={key} className="col-start-1 col-end-8 p-3 rounded-lg">
          <BotBubble message={message.message} />
        </div>
      )
    } else {
      return (
        <div key={key} className="col-start-6 col-end-13 p-3 rounded-lg">
          <div className="flex items-center justify-start flex-row-reverse">
            <UserBubble message={message.message} />
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div
                    ref={messageListRef}
                    className="grid grid-cols-12 gap-y-2"
                  >
                    {messages.map((message, index) => {
                      return DisplayBubble(message, index)
                    })}
                    {loading && (
                      <div className="col-start-1 col-end-8 p-3 rounded-lg">
                        <BubbleLoading />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        maxLength={512}
                        ref={inputArea}
                        placeholder={
                          loading
                            ? 'Waiting for response...'
                            : 'What is this youtube video is talking about?'
                        }
                        disabled={loading}
                        onKeyDown={handleEnter}
                        type="text"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        className="flex w-full border rounded-xl focus:outline-none focus:border-border-black pl-4 h-10"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex items-center justify-center bg-blue-950 hover:bg-blue-800 rounded-lg text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                      <span className="ml-2">
                        <svg
                          className="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat

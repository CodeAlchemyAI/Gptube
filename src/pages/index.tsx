import Loader from '@/components/Loader'
import { Router, useRouter } from 'next/router'
import { useState, useEffect, ChangeEvent } from 'react'

const Home = () => {
  const Router = useRouter()
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const retrieveVideoId = (url: string) => {
    return url.replace('https://www.youtube.com/watch?v=', '')
  }
  const loadVideo = async () => {
    if (youtubeUrl === '') {
      return
    }
    setIsLoading(true)

    try {
      const videoId = retrieveVideoId(youtubeUrl)

      const response = await fetch(`/api/store?videoId=${videoId}`)
      const data = await response.json()
      if (response.ok) {
        Router.push(`/${videoId}`)
      } else {
        setErrorMessage(data.error)
      }
    } catch (error) {
      setErrorMessage('Error fetching video')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Chat YouTube Video</h1>
        <div className="mb-4">
          <label
            htmlFor="youtubeUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Youtube ID or URL:
          </label>
          <input
            id="youtubeUrl"
            type="text"
            disabled={isLoading}
            value={youtubeUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setYoutubeUrl(e.target.value)
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-black sm:text-sm"
          />
        </div>
        {errorMessage && !isLoading && (
          <div className="p-4">{errorMessage} </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            className="flex bg-blue-950 hover:bg-blue-800  text-white py-2 px-4 rounded-md shadow-md"
            onClick={loadVideo}
            disabled={isLoading || youtubeUrl === ''}
          >
            {isLoading && <Loader />}
            Load video
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

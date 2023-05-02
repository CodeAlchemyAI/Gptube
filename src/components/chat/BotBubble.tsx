interface Props {
  message: string
}
const BotBubble = ({ message }: Props) => {
  return (
    <div className="flex flex-row items-center">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-950 flex-shrink-0 text-white">
        B
      </div>
      <div className="relative ml-3 text-sm bg-gray-200 py-2 px-4 shadow rounded-xl">
        <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
      </div>
    </div>
  )
}

export default BotBubble

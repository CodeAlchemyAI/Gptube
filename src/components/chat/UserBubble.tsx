interface Props {
  message: string
}
const UserBubble = ({ message }: Props) => {
  return (
    <div className="flex flex-row items-center">
      <div className="border  border-black flex items-center justify-center h-10 w-10 rounded-full bg-white-500 flex-shrink-0 text-black">
        U
      </div>
      <div className="bg-orange-200 relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl bg">
        <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
      </div>
    </div>
  )
}

export default UserBubble

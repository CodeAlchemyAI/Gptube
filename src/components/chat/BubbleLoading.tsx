const BubbleLoading = () => {
  return (
    <div className="flex flex-row items-center">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-950 flex-shrink-0 text-white">
        B
      </div>
      <div className="relative ml-3 text-sm bg-gray-200 py-2 px-4 shadow rounded-xl">
        <div className="animate-pulse">
          <div className="flex-1 space-y-6 py-1 ">
            <div className="space-y-3 h-10 w-20">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BubbleLoading

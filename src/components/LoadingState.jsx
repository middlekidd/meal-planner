export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl">
          🍳
        </span>
      </div>
      <p className="text-xl font-medium text-brand-700">Cooking up your week…</p>
      <p className="text-sm text-gray-500">This usually takes 15–30 seconds</p>
    </div>
  )
}

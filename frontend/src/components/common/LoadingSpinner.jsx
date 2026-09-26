export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-navy-900 rounded-full animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}
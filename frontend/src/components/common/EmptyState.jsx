import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {message && <p className="text-xs text-slate-500 mt-1 max-w-sm">{message}</p>}
    </div>
  )
}
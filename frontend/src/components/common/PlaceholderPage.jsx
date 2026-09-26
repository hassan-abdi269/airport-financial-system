import { Construction } from 'lucide-react'
import PageHeader from './PageHeader'

export default function PlaceholderPage({ title, subtitle, description }) {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <Construction className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Coming soon</p>
            <p className="text-sm text-slate-500 mt-1">
              {description ||
                'This page will be connected to the backend in a later step.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
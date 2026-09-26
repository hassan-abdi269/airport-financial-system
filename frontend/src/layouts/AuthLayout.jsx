export default function AuthLayout({ children }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 px-4 overflow-auto">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
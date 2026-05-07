function App(): React.JSX.Element {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="flex flex-col items-center gap-4 px-8 text-center">
        <div className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-400/30">
          Posture monitoring
        </div>
        <h1 className="bg-gradient-to-r from-white via-indigo-200 to-emerald-200 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
          PosturePal
        </h1>
        <p className="max-w-md text-base text-slate-300">
          Privacy-first, real-time posture coaching powered by your webcam. Nothing leaves your
          device.
        </p>
        <div className="mt-2 font-mono text-xs text-slate-400">v0.0.1</div>
      </div>
    </div>
  )
}

export default App

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, BarChart3, ClipboardList, FileText, Home, Map, Menu, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/register', label: 'Register complaint', icon: FileText },
  { href: '/track', label: 'Track complaint', icon: Search },
  { href: '/intelligence', label: 'Area intelligence', icon: Map },
  { href: '/dashboard', label: 'City dashboard', icon: BarChart3 },
  { href: '/priority', label: 'Priority issues', icon: ClipboardList },
]

export function CivicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#172b4d]">
      <header className="sticky top-0 z-30 border-b border-[#dce5ed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#0b3558] text-white shadow-sm"><ShieldCheck className="size-5" /></span>
            <span className="hidden max-w-[230px] text-[13px] font-bold leading-tight tracking-wide text-[#0b3558] sm:block">AI Urban Service Priority<br />& Issue Intelligence System</span>
            <span className="text-sm font-bold text-[#0b3558] sm:hidden">AI Urban Service</span>
          </Link>
          <button aria-label="Toggle navigation" className="rounded-lg p-2 text-[#52708c] lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          <nav className={`${open ? 'absolute left-0 top-[76px] flex border-b bg-white p-4 shadow-lg' : 'hidden'} w-full flex-col gap-1 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? 'bg-[#e7f4f3] text-[#087f7b]' : 'text-[#52708c] hover:bg-[#f1f6f9] hover:text-[#0b3558]'}`}><Icon className="size-4" />{label}</Link>
            })}
          </nav>
          <div className="hidden items-center gap-3 lg:flex"><button aria-label="Notifications" className="relative rounded-lg p-2 text-[#52708c] hover:bg-[#f1f6f9]"><Bell className="size-5" /><span className="absolute right-1 top-1 size-2 rounded-full bg-[#d97745]" /></button><div className="flex items-center gap-2 border-l border-[#dce5ed] pl-4"><span className="flex size-8 items-center justify-center rounded-full bg-[#d8ecea] text-xs font-bold text-[#087f7b]">CU</span><span className="text-sm font-medium text-[#35516d]">Citizen user</span></div></div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[#dce5ed] bg-white px-5 py-7 lg:px-10"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 text-xs text-[#6b8298] sm:flex-row"><p>© 2024 Urban Services Department · Built for better civic response</p><p>Data shown is illustrative for demonstration</p></div></footer>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <section className="border-b border-[#dce5ed] bg-white"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-9 sm:flex-row sm:items-end sm:justify-between lg:px-10"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#087f7b]">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight text-[#0b3558] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b8298]">{description}</p></div>{action}</div></section>
}

export function StatCard({ label, value, note, tone = 'navy' }: { label: string; value: string; note: string; tone?: 'navy' | 'teal' | 'orange' | 'blue' }) {
  const tones = { navy: 'bg-[#eaf0f6] text-[#0b3558]', teal: 'bg-[#e3f3f1] text-[#087f7b]', orange: 'bg-[#fdf0e8] text-[#b75c2b]', blue: 'bg-[#e8f0fb] text-[#3267a8]' }
  return <div className="rounded-2xl border border-[#dce5ed] bg-white p-5 shadow-[0_2px_8px_rgba(11,53,88,0.03)]"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-[#6b8298]">{label}</p><span className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}>{tone === 'teal' ? 'Healthy' : tone === 'orange' ? 'Attention' : 'Live'}</span></div><p className="mt-4 text-3xl font-bold tracking-tight text-[#0b3558]">{value}</p><p className="mt-1 text-xs font-medium text-[#6b8298]">{note}</p></div>
}

export function SectionTitle({ title, action }: { title: string; action?: string }) { return <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-[#0b3558]">{title}</h2>{action && <span className="text-xs font-semibold text-[#087f7b]">{action}</span>}</div> }

export function TrendBars() { const bars = [46, 62, 54, 78, 67, 91, 84, 74, 88, 96, 80, 72]; return <div className="flex h-40 items-end gap-2 px-2">{bars.map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-[#3da9a4] opacity-90" style={{ height: `${height}%` }} /><span className="text-[10px] text-[#8aa0b2]">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span></div>)}</div> }

export function PriorityBars() { const data = [['Street lighting', 88, 'Critical'], ['Waste collection', 74, 'High'], ['Road maintenance', 62, 'Elevated'], ['Water supply', 51, 'Moderate']]; return <div className="flex flex-col gap-4">{data.map(([label, score, level]) => <div key={label as string}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-[#35516d]">{label}</span><span className="font-bold text-[#0b3558]">{score}<span className="font-normal text-[#8aa0b2]"> / 100</span></span></div><div className="h-2 rounded-full bg-[#e7eef3]"><div className={`h-2 rounded-full ${Number(score) > 80 ? 'bg-[#d97745]' : Number(score) > 60 ? 'bg-[#e7a65c]' : 'bg-[#3da9a4]'}`} style={{ width: `${score}%` }} /></div><p className="mt-1 text-[11px] text-[#8aa0b2]">{level}</p></div>)}</div> }

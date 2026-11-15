'use client'
import wardData from '@/lib/wards.json'
import { useEffect, useState, type FormEvent } from 'react'


import {
  getAreas,
  getDashboard,
  registerComplaint,
  trackComplaint,
  type AreaStatistics,
  type RegistrationResponse,
  type TrackingResponse
} from '@/lib/api'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, BarChart3, CheckCircle2, Clock3, FileText, MapPin, Search, ShieldCheck, Sparkles, TrendingUp, Users, AlertTriangle } from 'lucide-react'
import { CivicShell, PageHeader, PriorityBars, SectionTitle, StatCard, TrendBars } from '@/components/civic-shell'

const complaints = [
  ['UTL-240184', 'Street lighting', 'Ward 12 · Central Avenue', 'In progress', '12 Jun 2024'],
  ['UTL-240167', 'Waste collection', 'Ward 07 · Green Park', 'Pending', '11 Jun 2024'],
  ['UTL-240142', 'Road maintenance', 'Ward 03 · Lakeside Road', 'Resolved', '10 Jun 2024'],
]
const priority = [['Street lighting', '184', '88', 'Critical', 'Frequent outages around Central Avenue'], ['Waste collection', '156', '74', 'High', 'Overflow reported across 4 neighborhoods'], ['Road maintenance', '121', '62', 'Elevated', 'Potholes affecting major commuter routes'], ['Water supply', '98', '51', 'Moderate', 'Low pressure reported during peak hours']]

function Home() { return <>
  <section className="bg-[#0b3558] text-white"><div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:px-10 lg:py-24"><div><div className="mb-7 flex items-center gap-2 text-sm font-semibold text-[#9de0d8]"><Sparkles className="size-4" /> Intelligent civic response, made visible</div><h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">Better city services start with <span className="text-[#73d2cc]">your voice.</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-[#c1d4e2]">Report local issues, follow progress, and help city teams prioritize the services that matter most to your neighborhood.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#3da9a4] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#062844]/30 transition hover:bg-[#50bdb7]">Register a complaint <ArrowRight className="size-4" /></Link><Link href="/track" className="inline-flex items-center gap-2 rounded-lg border border-[#5e819b] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Track a complaint <Search className="size-4" /></Link></div><div className="mt-12 flex flex-wrap gap-8 text-sm"><div><p className="text-2xl font-bold">6,842</p><p className="mt-1 text-[#9bb7c8]">Issues resolved</p></div><div className="border-l border-[#42657d] pl-8"><p className="text-2xl font-bold">24 hrs</p><p className="mt-1 text-[#9bb7c8]">Average response</p></div><div className="border-l border-[#42657d] pl-8"><p className="text-2xl font-bold">18</p><p className="mt-1 text-[#9bb7c8]">Active wards</p></div></div></div><div className="relative rounded-3xl border border-[#35617e] bg-[#124464] p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#9de0d8]">Live city pulse</p><p className="mt-1 text-lg font-bold">Service health overview</p></div><span className="flex items-center gap-1.5 rounded-full bg-[#1e5a68] px-3 py-1.5 text-xs font-semibold text-[#a9e5df]"><span className="size-1.5 rounded-full bg-[#73d2cc]" /> Updated now</span></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#0b3558]/70 p-4"><TrendingUp className="size-5 text-[#73d2cc]" /><p className="mt-4 text-2xl font-bold">82%</p><p className="text-xs text-[#9bb7c8]">Resolution rate</p></div><div className="rounded-xl bg-[#0b3558]/70 p-4"><Clock3 className="size-5 text-[#f2bd7b]" /><p className="mt-4 text-2xl font-bold">1.8d</p><p className="text-xs text-[#9bb7c8]">Median response</p></div></div><div className="mt-3 rounded-xl bg-white p-4 text-[#0b3558]"><div className="flex items-center justify-between"><span className="text-sm font-bold">Top priority zone</span><span className="rounded-full bg-[#fdf0e8] px-2 py-1 text-[10px] font-bold uppercase text-[#b75c2b]">Attention</span></div><p className="mt-2 text-xl font-bold">Ward 12 · Central</p><div className="mt-3 h-2 rounded-full bg-[#e7eef3]"><div className="h-2 w-[88%] rounded-full bg-[#d97745]" /></div><p className="mt-2 text-xs text-[#6b8298]">88 / 100 priority score</p></div></div></div></section>
  <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087f7b]">How it works</p><h2 className="mt-2 text-2xl font-bold text-[#0b3558]">A clearer path from report to resolution</h2></div><Link href="/dashboard" className="hidden text-sm font-bold text-[#087f7b] sm:block">Explore city data <ArrowRight className="ml-1 inline size-4" /></Link></div><div className="grid gap-4 md:grid-cols-3">{[['01','Report an issue','Tell us what needs attention in your neighborhood.'],['02','Follow the progress','Use your complaint ID and token to stay informed.'],['03','Improve your city','Your reports help teams target recurring problems.']].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-[#dce5ed] bg-white p-6"><span className="text-sm font-bold text-[#3da9a4]">{n}</span><h3 className="mt-7 text-lg font-bold text-[#0b3558]">{t}</h3><p className="mt-2 text-sm leading-6 text-[#6b8298]">{d}</p></div>)}</div></section>
</> }


const HYDERABAD_AREAS = [
  "Kukatpally",
  "Miyapur",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Uppal",
  "LB Nagar",
  "Dilsukhnagar",
  "Secunderabad",
  "Ameerpet",
  "Begumpet",
  "Mehdipatnam",
  "Manikonda",
  "Nallagandla",
  "Chandanagar",
  "Serilingampally",
  "Habsiguda",
  "Tarnaka",
  "Nacharam",
  "KPHB Colony",
  "Banjara Hills",
  "Jubilee Hills",
  "Attapur"
]
function Register() {
const [city, setCity] = useState('Bengaluru')
  const [ward, setWard] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<RegistrationResponse | null>(null)

 

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!ward || !description.trim()) {
      setError('Please select a ward and describe the issue.')
      return
    }

    setLoading(true)

    try {
      const complaint = [
        description.trim(),
        location.trim() ? `Location: ${location.trim()}` : ''
      ].filter(Boolean).join('. ')

      const response = await registerComplaint({
        complaint_text: complaint,
        ward
      })

      setResult(response)
      setDescription('')
      setLocation('')
      setWard('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Complaint registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return <>
    <PageHeader
      eyebrow="Citizen services / 01"
      title="Register a complaint"
      description="Share the details of a local issue and help your ward team respond faster."
    />

    <div className="mx-auto max-w-[900px] px-5 py-10 lg:px-10">
      <div className="rounded-2xl border border-[#dce5ed] bg-white p-6 shadow-sm sm:p-8">

        <div className="mb-8 flex items-center gap-3 border-b border-[#e7eef3] pb-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#e3f3f1] text-[#087f7b]">
            <FileText className="size-5" />
          </span>
          <div>
            <h2 className="font-bold text-[#0b3558]">Complaint details</h2>
            <p className="text-sm text-[#6b8298]">Fields marked with * are required.</p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
<label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
  City *
  <select
    required
    value={city}
    onChange={(e) => {
      setCity(e.target.value)
      setWard('')
    }}
    className="rounded-lg border border-[#cbd9e3] bg-white px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
  >
    <option value="Bengaluru">Bengaluru</option>
    <option value="Hyderabad">Hyderabad</option>
  </select>
</label>


          <label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
            
  Ward *
  <select
    required
    value={ward}
    onChange={(e) => setWard(e.target.value)}
    className="rounded-lg border border-[#cbd9e3] bg-white px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
  >
    <option value="">Select your ward</option>

    {(wardData as Record<string, string[]>)[city]?.map((area) => (
      <option key={area} value={area}>
        {area}
      </option>
    ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-[#cbd9e3] px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
              placeholder="Street, landmark or nearby address"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
            Describe the issue *
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-36 rounded-lg border border-[#cbd9e3] px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
              placeholder="What happened? Include useful details such as timing or frequency."
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-xl border border-[#b8e1d5] bg-[#effaf5] p-5 text-sm text-[#155b46]">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <CheckCircle2 className="size-5" />
                Complaint registered successfully!
              </div>
              <p><strong>Complaint ID:</strong> {result.complaint_id}</p>
              <p><strong>Tracking token:</strong> {result.tracking_token}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Predicted urgency:</strong> {result.predicted_urgency}</p>
              <p><strong>Priority score:</strong> {result.priority_score}</p>
              <p className="mt-3 font-semibold">
                Save your complaint ID and tracking token. You will need both to track your complaint.
              </p>
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 border-t border-[#e7eef3] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs leading-5 text-[#6b8298]">
              Your report may be used to improve city services.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b3558] px-5 py-3 text-sm font-bold text-white hover:bg-[#124464] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit complaint'}
              <ArrowRight className="size-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  </>
}

function Intelligence() {
  const [areas, setAreas] = useState<AreaStatistics[]>([])
  const [ward, setWard] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAreas()
      .then((data) => {
        setAreas(data.areas)
        if (data.areas.length) setWard(data.areas[0].ward)
      })
      .catch((err) => setError(err.message || 'Unable to load area data.'))
      .finally(() => setLoading(false))
  }, [])

  const selected = areas.find((area) => area.ward === ward)
  const topCategory = selected?.category_breakdown
    .slice()
    .sort((a, b) => b.count - a.count)[0]

  const comparisons = [...areas]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 3)

  return <>
    <PageHeader
      eyebrow="Decision support / 03"
      title="Area intelligence"
      description="Understand how service issues are distributed across wards and where attention is needed most."
      action={
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="rounded-lg border border-[#cbd9e3] bg-white px-3 py-2 text-sm font-semibold text-[#35516d]"
        >
          {areas.map((area) => (
            <option key={area.ward} value={area.ward}>{area.ward}</option>
          ))}
        </select>
      }
    />

    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
      {loading && <p className="py-6 text-sm text-[#6b8298]">Loading area intelligence...</p>}
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {selected && <>
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Risk score" value={`${selected.risk_score} / 100`} note={selected.risk_zone} tone="orange" />
          <StatCard label="Total complaints" value={String(selected.total_complaints)} note={`${selected.recent_30_days} in the last 30 days`} tone="blue" />
          <StatCard label="Unresolved complaints" value={String(selected.unresolved_complaints)} note={`${selected.recurring_issue_groups} recurring issue groups`} tone="teal" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
            <SectionTitle title="Complaint trend" action="Last 30 days vs previous 30 days" />
            <div className="mt-6 flex flex-col gap-5">
              {[['Previous 30 days', selected.previous_30_days], ['Recent 30 days', selected.recent_30_days]].map(([label, count]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-[#52708c]">
                    <span>{label}</span><span>{count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#edf2f5]">
                    <div
                      className="h-3 rounded-full bg-[#3da9a4]"
                      style={{ width: `${Math.min(100, Number(count) / Math.max(1, selected.recent_30_days, selected.previous_30_days) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold text-[#087f7b]">
              Trend: {selected.complaint_trend}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
            <SectionTitle title="Risk zone" />
            <div className="mt-5 flex items-center gap-5">
              <div className="flex size-28 shrink-0 items-center justify-center rounded-full border-[12px] border-[#d97745] text-2xl font-bold text-[#0b3558]">
                {selected.risk_score}
              </div>
              <div>
                <p className="text-lg font-bold text-[#0b3558]">{selected.risk_zone}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b8298]">
                  Risk assessment based on complaint activity and urgency.
                </p>
                <p className="mt-3 text-xs font-bold text-[#b75c2b]">
                  Top driver: {topCategory?.category || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dce5ed] bg-white p-6">
          <SectionTitle title="Ward comparison" action="Top 3 by risk score" />
          <div className="grid gap-4 md:grid-cols-3">
            {comparisons.map((area) => (
              <div key={area.ward} className="rounded-xl bg-[#f7fafc] p-4">
                <div className="flex justify-between gap-2 text-sm font-bold text-[#35516d]">
                  <span>{area.ward}</span>
                  <span>{area.risk_score}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#e7eef3]">
                  <div className="h-2 rounded-full bg-[#d97745]" style={{ width: `${Math.min(100, area.risk_score)}%` }} />
                </div>
                <p className="mt-2 text-xs text-[#6b8298]">
                  {area.risk_zone} · {area.total_complaints} complaints
                </p>
              </div>
            ))}
          </div>
        </div>
      </>}
    </div>
  </>
}



function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('Unable to load dashboard data. Check the backend connection.'))
  }, [])

  if (error) {
    return <div className="p-10 text-red-600">{error}</div>
  }

  if (!data) {
    return <div className="p-10 text-[#52708c]">Loading dashboard data...</div>
  }

  const total = data.total_complaints || 0
  const percentage = (value: number) =>
    total ? `${((value / total) * 100).toFixed(1)}%` : '0%'

  return (
    <>
      <PageHeader
        eyebrow="Operations / 04"
        title="City dashboard"
        description="A citywide view of complaints, response performance, and recurring issue patterns."
      />

      <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total complaints" value={String(total)} note="Live backend data" tone="blue" />
          <StatCard label="Pending" value={String(data.pending)} note={`${percentage(data.pending)} of total`} tone="orange" />
          <StatCard label="In progress" value={String(data.in_progress)} note={`${percentage(data.in_progress)} of total`} tone="navy" />
          <StatCard label="Resolved" value={String(data.resolved)} note={`${percentage(data.resolved)} of total`} tone="teal" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
            <SectionTitle title="Category breakdown" />
            <div className="flex flex-col gap-4">
              {data.category_breakdown.map((item) => {
                const share = percentage(item.count)
                return (
                  <div key={item.category}>
                    <div className="mb-2 flex justify-between text-xs font-semibold text-[#52708c]">
                      <span>{item.category}</span>
                      <span>{item.count} ({share})</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#edf2f5]">
                      <div className="h-2 rounded-full bg-[#3da9a4]" style={{ width: share }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
            <SectionTitle title="Top wards" />
            <div className="flex flex-col gap-4">
              {data.top_wards.map((item) => (
                <div key={item.ward} className="flex justify-between border-b border-[#eef3f6] pb-3 text-sm">
                  <span className="text-[#35516d]">{item.ward}</span>
                  <span className="font-bold text-[#087f7b]">{item.count} complaints</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dce5ed] bg-white p-6">
          <SectionTitle title="Priority issues" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-[#e7eef3] text-xs uppercase text-[#8aa0b2]">
                <tr>
                  <th className="pb-3">Issue group</th>
                  <th className="pb-3">Complaints</th>
                  <th className="pb-3">Urgency</th>
                  <th className="pb-3">Priority score</th>
                </tr>
              </thead>
              <tbody>
                {data.priority_issues.map((item) => (
                  <tr key={item.issue_group_id} className="border-b border-[#eef3f6]">
                    <td className="py-4 font-semibold text-[#35516d]">{item.issue_group_id}</td>
                    <td className="py-4">{item.complaint_count}</td>
                    <td className="py-4">{item.urgency}</td>
                    <td className="py-4 font-bold text-[#087f7b]">{item.priority_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}



function Track() {
  const [complaintId, setComplaintId] = useState('')
  const [token, setToken] = useState('')
  const [result, setResult] = useState<TrackingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTrack(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await trackComplaint({
        complaint_id: complaintId.trim(),
        tracking_token: token.trim()
      })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to track complaint.')
    } finally {
      setLoading(false)
    }
  }

  return <>
    <PageHeader
      eyebrow="Citizen services / 02"
      title="Track your complaint"
      description="Check the latest status and follow the progress of your reported issue."
    />

    <div className="mx-auto max-w-[900px] px-5 py-10 lg:px-10">
      <div className="rounded-2xl border border-[#dce5ed] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="font-bold text-[#0b3558]">Complaint tracking details</h2>
          <p className="mt-1 text-sm text-[#6b8298]">
            Enter the complaint ID and tracking token you received after registration.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
            Complaint ID *
            <input
              required
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Example: URB-XXXXXXXXXX"
              className="rounded-lg border border-[#cbd9e3] px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[#35516d]">
            Tracking token *
            <input
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your tracking token"
              className="rounded-lg border border-[#cbd9e3] px-3 py-3 font-normal outline-none focus:border-[#3da9a4]"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b3558] px-5 py-3 text-sm font-bold text-white hover:bg-[#124464] disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Track complaint'}
            <Search className="size-4" />
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-[#dce5ed] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7eef3] pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#087f7b]">
                Complaint details
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0b3558]">
                {result.complaint.complaint_id}
              </h2>
            </div>
            <span className="rounded-full bg-[#e3f3f1] px-3 py-1.5 text-sm font-bold text-[#087f7b]">
              {result.complaint.status}
            </span>
          </div>

          <div className="grid gap-5 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#8aa0b2]">Ward</p>
              <p className="mt-1 font-semibold text-[#35516d]">{result.complaint.ward}</p>
            </div>
            <div>
              <p className="text-xs text-[#8aa0b2]">Category</p>
              <p className="mt-1 font-semibold text-[#35516d]">{result.complaint.category}</p>
            </div>
            <div>
              <p className="text-xs text-[#8aa0b2]">Predicted urgency</p>
              <p className="mt-1 font-semibold text-[#35516d]">{result.complaint.predicted_urgency}</p>
            </div>
            <div>
              <p className="text-xs text-[#8aa0b2]">Priority score</p>
              <p className="mt-1 font-semibold text-[#35516d]">{result.complaint.priority_score}/100</p>
            </div>
          </div>

          <div className="border-t border-[#e7eef3] pt-5">
            <h3 className="mb-3 font-bold text-[#0b3558]">Reported issue</h3>
            <p className="text-sm leading-6 text-[#6b8298]">
              {result.complaint.complaint_text}
            </p>
          </div>

          <div className="mt-7 border-t border-[#e7eef3] pt-6">
            <h3 className="mb-5 font-bold text-[#0b3558]">Status history</h3>

            {result.status_history.length === 0 ? (
              <p className="text-sm text-[#6b8298]">No status history available.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {result.status_history.map((item, index) => (
                  <div key={`${item.changed_at}-${index}`} className="flex gap-3">
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e3f3f1] text-[#087f7b]">
                      <CheckCircle2 className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#35516d]">
                        {item.old_status
                          ? `${item.old_status} → ${item.new_status}`
                          : `Complaint ${item.new_status}`}
                      </p>
                      <p className="mt-1 text-xs text-[#8aa0b2]">
                        {new Date(item.changed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </>
}


function Priority() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('Unable to load priority data. Check the backend connection.'))
  }, [])

  const issues = data?.priority_issues ?? []
  const criticalCount = issues.filter(
    issue => issue.urgency.toLowerCase() === 'critical'
  ).length

  const distribution = ['Critical', 'High', 'Medium', 'Low'].map(level => ({
    level,
    count: issues.filter(
      issue => issue.urgency.toLowerCase() === level.toLowerCase()
    ).length
  }))

  const maxCount = Math.max(...distribution.map(item => item.count), 1)

  return (
    <>
      <PageHeader
        eyebrow="Decision support / 05"
        title="Priority issues"
        description="Recurring issue groups ranked by urgency, impact, and volume to guide focused action."
      />

      <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-10">
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!data && !error && (
          <p className="py-10 text-center text-sm text-[#6b8298]">
            Loading priority data...
          </p>
        )}

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Priority groups"
                value={String(data.recurring_issue_groups)}
                note="Recurring issue groups"
                tone="blue"
              />
              <StatCard
                label="Critical issues"
                value={String(criticalCount)}
                note="Require immediate attention"
                tone="orange"
              />
              <StatCard
                label="Total complaints"
                value={String(data.total_complaints)}
                note="Across all recorded complaints"
                tone="navy"
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
              <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
                <SectionTitle title="Priority group distribution" />

                <div className="mt-6 space-y-5">
                  {distribution.map(item => (
                    <div key={item.level}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold text-[#35516d]">
                          {item.level}
                        </span>
                        <span className="text-[#8aa0b2]">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#edf2f6]">
                        <div
                          className="h-full rounded-full bg-[#3267a8]"
                          style={{
                            width: `${(item.count / maxCount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#dce5ed] bg-white p-6">
                <SectionTitle
                  title="Recurring issue groups"
                  action="Ranked by priority"
                />

                {issues.length === 0 ? (
                  <p className="py-8 text-sm text-[#6b8298]">
                    No recurring issue groups available yet.
                  </p>
                ) : (
                  <div className="flex flex-col">
                    {issues.map((issue, i) => (
                      <div
                        key={issue.issue_group_id}
                        className="flex gap-4 border-b border-[#eef3f6] py-4 first:pt-0 last:border-0"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf0f6] text-sm font-bold text-[#0b3558]">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-bold text-[#35516d]">
                              Issue group {issue.issue_group_id}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                issue.urgency === 'Critical'
                                  ? 'bg-[#fdf0e8] text-[#b75c2b]'
                                  : 'bg-[#e8f0fb] text-[#3267a8]'
                              }`}
                            >
                              {issue.urgency}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#8aa0b2]">
                            <span>{issue.complaint_count} complaints</span>
                            <span>
                              Score {Number(issue.priority_score).toFixed(1)}/100
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[#8aa0b2]">
                            Latest activity: {issue.latest_activity || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#0b3558] p-6 text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#9de0d8]">
                    <AlertTriangle className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Recommendation
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold">
                    {issues.length > 0
                      ? `Review issue group ${issues[0].issue_group_id}`
                      : 'No priority recommendation available'}
                  </h3>

                  <p className="mt-1 text-sm text-[#b9cfdd]">
                    {issues.length > 0
                      ? `${issues[0].complaint_count} complaints recorded. Priority score: ${Number(issues[0].priority_score).toFixed(1)}/100.`
                      : 'Priority recommendations will appear when recurring issues are recorded.'}
                  </p>
                </div>

                <Link
                  href="/intelligence"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#0b3558]"
                >
                  View area intelligence <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default function Page() { const pathname = usePathname(); const content = pathname === '/register' ? <Register /> : pathname === '/track' ? <Track /> : pathname === '/intelligence' ? <Intelligence /> : pathname === '/dashboard' ? <Dashboard /> : pathname === '/priority' ? <Priority /> : <Home />; return <CivicShell>{content}</CivicShell> }

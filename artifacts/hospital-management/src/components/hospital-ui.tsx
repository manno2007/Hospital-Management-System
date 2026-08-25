import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { CalendarDays, ChevronDown, ChevronRight, ClipboardList, Clock3, Edit3, LayoutDashboard, Menu, Plus, Search, Stethoscope, Trash2, UsersRound, X, type LucideIcon } from 'lucide-react';
import { useHospitalStore } from '@/lib/hospital-store';

export const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/departments', label: 'Departments', icon: ClipboardList },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: UsersRound },
  { href: '/appointments', label: 'Appointments', icon: CalendarDays },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-shell flex">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center gap-3 border-b border-sidebar-border px-7">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><span className="text-lg font-bold">H</span></div>
          <div><div className="text-[15px] font-bold tracking-tight text-white">Harborview</div><div className="mono text-[9px] uppercase tracking-[.18em] text-slate-400">Clinical operations</div></div>
        </div>
        <div className="px-4 pt-8">
          <p className="mono mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? location === '/' : location.startsWith(href);
              return <Link key={href} href={href} data-testid={`link-${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${active ? 'bg-sidebar-accent text-white' : 'text-slate-400 hover:bg-sidebar-accent/70 hover:text-slate-100'}`}><Icon size={17} strokeWidth={active ? 2.3 : 1.8} /><span>{label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}</Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto px-5 pb-5">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
            <div className="mb-2 flex items-center justify-between"><span className="mono text-[9px] uppercase tracking-[.16em] text-slate-500">System status</span><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
            <p className="text-[12px] font-medium text-slate-200">All services operational</p>
            <p className="mt-1 text-[11px] text-slate-500">Last checked just now</p>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-sidebar-border pt-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#d6e8e7] text-[11px] font-bold text-[#1e5f6a]">AC</div>
            <div className="min-w-0"><p className="truncate text-[12px] font-semibold text-slate-200">Alex Carter</p><p className="truncate text-[11px] text-slate-500">Care coordinator</p></div>
            <ChevronDown size={15} className="ml-auto text-slate-500" />
          </div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" data-testid="button-close-navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"><span className="sr-only">Close navigation</span></button>}
      <main className="min-w-0 flex-1">
        <div className="flex h-[82px] items-center justify-between border-b border-border bg-card/70 px-5 md:px-10">
          <button aria-label="Open navigation" data-testid="button-open-navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"><Menu size={20} /></button>
          <div className="hidden items-center gap-2 text-[12px] text-muted-foreground md:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live workspace <span className="mx-2 text-border">/</span> Tue, Jun 18, 2024</div>
          <div className="ml-auto flex items-center gap-3"><button data-testid="button-global-search" onClick={() => document.querySelector<HTMLInputElement>('[data-testid="input-search-records"]')?.focus()} className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-primary/40 sm:flex"><Search size={15} /> Search anything <span className="mono ml-5 text-[10px] text-muted-foreground/70">⌘ K</span></button><button data-testid="button-notifications" onClick={() => {}} aria-label="Notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" /><Clock3 size={18} /></button></div>
        </div>
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action, actionLabel }: { eyebrow: string; title: string; description: string; action?: () => void; actionLabel?: string }) {
  return <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mono mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p><h1 className="text-[30px] font-bold tracking-[-.035em] text-foreground md:text-[36px]">{title}</h1><p className="mt-2 max-w-xl text-[14px] leading-6 text-muted-foreground">{description}</p></div>{action && <button data-testid={`button-${actionLabel?.toLowerCase().replaceAll(' ', '-')}`} onClick={action} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"><Plus size={16} />{actionLabel}</button>}</header>;
}

export function StatTile({ label, value, detail, icon: Icon, accent }: { label: string; value: string | number; detail: string; icon: LucideIcon; accent: 'teal' | 'amber' | 'blue' | 'green' }) {
  const colors = { teal: 'bg-[#d9eeed] text-[#17626c]', amber: 'bg-[#fff0d4] text-[#a36208]', blue: 'bg-[#dfeafa] text-[#365e9e]', green: 'bg-[#dcefe5] text-[#27704c]' };
  return <div className="surface rounded-xl p-5 transition-transform hover:-translate-y-0.5"><div className="flex items-start justify-between"><div><p className="text-[12px] font-medium text-muted-foreground">{label}</p><p data-testid={`text-stat-${label.toLowerCase().replaceAll(' ', '-')}`} className="mt-2 text-[28px] font-bold tracking-[-.04em]">{value}</p></div><div className={`grid h-9 w-9 place-items-center rounded-lg ${colors[accent]}`}><Icon size={18} /></div></div><p className="mt-3 text-[11px] text-muted-foreground">{detail}</p></div>;
}

export function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[2px]"><div role="dialog" aria-modal="true" className="page-enter w-full max-w-[500px] rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-lg font-bold tracking-tight">{title}</h2><p className="mt-1 text-[12px] text-muted-foreground">{subtitle}</p></div><button data-testid="button-close-modal" aria-label="Close dialog" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18} /></button></div>{children}</div></div>;
}

export function ConfirmModal({ title, description, onConfirm, onClose }: { title: string; description: string; onConfirm: () => void; onClose: () => void }) {
  return <Modal title={title} subtitle="This action cannot be undone." onClose={onClose}><div className="rounded-lg border border-[#f3d9d5] bg-[#fff7f5] p-4 text-[13px] leading-5 text-[#8d4138]">{description}</div><div className="mt-6 flex justify-end gap-2"><button data-testid="button-cancel-delete" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-[13px] font-semibold hover:bg-muted">Cancel</button><button data-testid="button-confirm-delete" onClick={onConfirm} className="rounded-lg bg-destructive px-4 py-2 text-[13px] font-semibold text-destructive-foreground hover:opacity-90">Delete record</button></div></Modal>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action: () => void }) {
  return <div className="flex min-h-[270px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/55 px-6 text-center"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><ClipboardList size={21} /></div><h3 className="text-[15px] font-bold">{title}</h3><p className="mt-1.5 max-w-xs text-[12px] leading-5 text-muted-foreground">{description}</p><button data-testid="button-empty-add" onClick={action} className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline"><Plus size={15} /> Add first record</button></div>;
}

export function ErrorState({ retry }: { retry: () => void }) {
  return <div className="rounded-xl border border-[#f3d9d5] bg-[#fff7f5] p-5 text-center"><p className="text-[13px] font-semibold text-[#8d4138]">We couldn't load this workspace</p><p className="mt-1 text-[12px] text-[#a9675d]">The local view is still available. Try again when the service is reachable.</p><button data-testid="button-retry" onClick={retry} className="mt-3 text-[12px] font-bold text-primary hover:underline">Retry connection</button></div>;
}

export function SkeletonRows() {
  return <div className="space-y-3 p-5">{[1, 2, 3, 4].map((item) => <div key={item} className="flex items-center gap-4"><div className="skeleton h-9 w-9" /><div className="flex-1"><div className="skeleton h-3 w-1/3" /><div className="skeleton mt-2 h-2.5 w-1/5" /></div><div className="skeleton h-8 w-20" /></div>)}</div>;
}

export function RecordActions({ onEdit, onDelete, id }: { onEdit: () => void; onDelete: () => void; id: number }) {
  return <div className="flex items-center justify-end gap-1"><button data-testid={`button-edit-${id}`} aria-label="Edit record" onClick={onEdit} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-primary"><Edit3 size={15} /></button><button data-testid={`button-delete-${id}`} aria-label="Delete record" onClick={onDelete} className="rounded-md p-2 text-muted-foreground hover:bg-[#fff0ee] hover:text-destructive"><Trash2 size={15} /></button></div>;
}

export function Avatar({ name, tone = 'teal' }: { name: string; tone?: 'teal' | 'amber' | 'blue' | 'green' }) {
  const tones = { teal: 'bg-[#d9eeed] text-[#17626c]', amber: 'bg-[#fff0d4] text-[#a36208]', blue: 'bg-[#dfeafa] text-[#365e9e]', green: 'bg-[#dcefe5] text-[#27704c]' };
  return <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${tones[tone]}`}>{name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()}</div>;
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input data-testid="input-search-records" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/10" /></div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.1em] text-muted-foreground">{label}</span>{children}</label>;
}

export function FormFooter({ onClose, pending = false }: { onClose: () => void; pending?: boolean }) {
  return <div className="mt-7 flex justify-end gap-2 border-t border-border pt-4"><button type="button" data-testid="button-cancel-form" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-[13px] font-semibold hover:bg-muted">Cancel</button><button type="submit" data-testid="button-save-form" disabled={pending} className="rounded-lg bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{pending ? 'Saving…' : 'Save record'}</button></div>;
}
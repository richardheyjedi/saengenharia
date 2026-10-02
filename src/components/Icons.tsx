type IconProps = { size?: number; className?: string }

const common = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
})

export function ArrowUpRight({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M7 17 17 7M7 7h10v10" /></svg>
}

export function ArrowRight({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

export function MapPin({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
}

export function Check({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="m5 12 4 4L19 6" /></svg>
}

export function MenuIcon({ size = 24, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
}

export function CloseIcon({ size = 24, className }: IconProps) {
  return <svg {...common(size, className)}><path d="m6 6 12 12M18 6 6 18" /></svg>
}

export function MessageIcon({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M8 10h8M8 14h5" /></svg>
}

export function Plus({ size = 20, className }: IconProps) {
  return <svg {...common(size, className)}><path d="M12 5v14M5 12h14" /></svg>
}

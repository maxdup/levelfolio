import { FaGithub, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { IoExpand } from 'react-icons/io5'

const OCTICONS = {
  'gear':          { viewBox: '0 0 14 16', d: 'M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' },
  'info':          { viewBox: '0 0 14 16', d: 'M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z' },
  'x':             { viewBox: '0 0 12 16', d: 'M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z' },
  'chevron-right': { viewBox: '0 0 8 16',  d: 'M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3l5 5z' },
  'chevron-left':  { viewBox: '0 0 8 16',  d: 'M5.5 3L7 4.5 3.25 8 7 11.5 5.5 13l-5-5 5-5z' },
  'chevron-down':  { viewBox: '0 0 10 16', d: 'M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z' },
  'grabber':       { viewBox: '0 0 8 16',  d: 'M8 4v1H0V4h8zM0 8h8V7H0v1zm0 3h8v-1H0v1z' },
}

const FA_ICONS = {
  'github':   FaGithub,
  'youtube':  FaYoutube,
  'facebook': FaFacebook,
  'linkedin': FaLinkedin,
}

const MISC_ICONS = {
  'md-expand': IoExpand,
}

export function LvlIcon({ name, className = '', style }) {
  if (OCTICONS[name]) {
    const { viewBox, d } = OCTICONS[name]
    return (
      <svg
        className={`lvl lvl-${name} ${className}`.trim()}
        style={style}
        viewBox={viewBox}
        aria-hidden="true"
      >
        <path fillRule="evenodd" d={d} />
      </svg>
    )
  }
  const Icon = FA_ICONS[name] || MISC_ICONS[name]
  if (!Icon) return null
  return <Icon className={`lvl lvl-${name} ${className}`.trim()} style={style} />
}

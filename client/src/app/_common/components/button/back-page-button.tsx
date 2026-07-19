import Link from 'next/link'

export const BackPageButton = ({ link, label = 'Back', ...props }: { link: string; label?: string }) => {
  return (
    <Link
      href={link}
      aria-label="none"
      className="rounded-lg bg-white dark:bg-darkblack-600 dark:text-white p-4 inline-flex items-center justify-center text-base text-bgray-600 border border-transparent hover:border-success-300 transition duration-300 ease-in-out"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </Link>
  )
}

import flag from '@/app/_common/assets/images/flag/flag_placeholder.png'
import Image from 'next/image'
export function countryTemplate(country: { name: string; code: string }) {
  return (
    <div className={`flex align-countrys-center`}>
      <Image
        alt={country.name}
        src={flag.src}
        width={21}
        height={21}
        className={`flag flag-${country.code.toLowerCase()} mr-2`}
        style={{ height: '21px' }}
      />
      <div>{country.name}</div>
    </div>
  )
}

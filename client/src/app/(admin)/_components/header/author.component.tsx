'use client'
import profile from '@/app/_common/assets/images/avatar/profile-52x52.png'
import { AuthContext } from '@/app/_common/contexts/auth.context'
import Image from 'next/image'
import ProtoTypes from 'prop-types'
import { useContext } from 'react'

function Author({ showProfile }: { showProfile: (name: string) => void }) {
  const { user } = useContext(AuthContext)
  return (
    <div onClick={() => showProfile('profile')} className="flex cursor-pointer space-x-0 lg:space-x-3">
      <div className="h-[52px] w-[52px] overflow-hidden rounded-xl border border-bgray-300">
        <Image
          priority={true}
          height={profile.height}
          width={profile.width}
          className="object-cover"
          src={profile.src}
          alt="avater"
        />
      </div>
      <div className="hidden 2xl:block">
        <div className="flex items-center space-x-2.5">
          <h3 className="text-base font-bold leading-[28px] text-bgray-900 dark:text-white">{user?.name}</h3>
          <span>
            <svg
              className="stroke-bgray-900 dark:stroke-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 10L12 14L17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <p className="text-sm font-medium leading-[20px] text-bgray-600 dark:text-bgray-50">{user?.email}</p>
      </div>
    </div>
  )
}

Author.propTypes = {
  showProfile: ProtoTypes.func,
}

export default Author

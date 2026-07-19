import img from '@/app/_common/assets/images/illustration/404.svg'
import Image from 'next/image'
import Link from 'next/link'
import bgLight from '@/app/_common/assets/images/background/404-bg.png'

function Error() {
  return (
    <section
      className="bg-notfound bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url('${bgLight.src}')`,
      }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Image priority={true} height={img.height} width={img.width} src={img.src} alt="" />

          <div className="flex justify-center mt-10">
            <Link href="/" className="bg-success-300 text-sm font-bold text-white rounded-lg px-10 py-3 docs-creator">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Error

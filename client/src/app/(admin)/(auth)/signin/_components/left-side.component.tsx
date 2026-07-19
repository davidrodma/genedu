import ProtoTypes from "prop-types"
import square from "@/app/_common/assets/images/shapes/square.svg"
import vline from "@/app/_common/assets/images/shapes/vline.svg"
import dotted from "@/app/_common/assets/images/shapes/dotted.svg"
import Image from "next/image"
import { WEBSITE_TITLE } from "@/app/_common/configs/constants"

function LeftSide({ img }: any) {
  return (
    <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-darkblack-600  relative min-h-screen ">
      <ul>
        <li className="absolute top-10 left-8">
          <Image
            priority={true}
            height={square.height}
            width={square.width}
            src={square.src}
            alt=""
          />
        </li>
        <li className="absolute right-12 top-14">
          <Image
            priority={true}
            height={vline.height}
            width={vline.width}
            src={vline.src}
            alt=""
          />
        </li>
        <li className="absolute bottom-1 left-8">
          <Image
            priority={true}
            height={dotted.height}
            width={dotted.width}
            src={dotted.src}
            alt=""
          />
        </li>
      </ul>
      <div className="">
        <Image
          priority={true}
          height={img.height}
          width={img.width}
          src={img.src}
          alt=""
        />
      </div>
      <div>
        <div className="text-center max-w-lg px-1.5 m-auto">
          <h3 className="text-bgray-900 dark:text-white font-semibold font-popins text-4xl mb-4">
            Create educational presentations
          </h3>
          <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium">
            {WEBSITE_TITLE} is a comprehensive platform that automatically
            generates educational materials from media content using artificial
            intelligence. The system processes audio/video files through
            multiple AI-powered stages to create professional educational
            content with presentations
            <span className="text-success-300 font-bold"> (pptx) </span>.
          </p>
        </div>
      </div>
    </div>
  )
}

LeftSide.propTypes = {
  img: ProtoTypes.object,
}

export default LeftSide

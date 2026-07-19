import signinImg from "@/app/_common/assets/images/illustration/signin.svg"

import { SignInForm } from "./_components/form/signin-form.component"
import LeftSide from "./_components/left-side.component"
import RightSide from "./_components/right-side.component"

function SignIn() {
  return (
    <section className="bg-white dark:bg-darkblack-500">
      <div className="flex flex-col lg:flex-row justify-between min-h-screen">
        <LeftSide img={signinImg} />
        <RightSide>
          <SignInForm />
        </RightSide>
      </div>
    </section>
  )
}

export default SignIn

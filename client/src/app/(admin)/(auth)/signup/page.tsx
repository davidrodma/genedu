import signupImg from "@/app/_common/assets/images/illustration/signup.svg"
import SignUpForm from "@/app/(admin)/(auth)/signup/_components/signup-form.component"
import RightSide from "../_components/right-side.component"
import LeftSide from "../_components/left-side.component"

function SignUp() {
  return (
    <section className="bg-white dark:bg-darkblack-500">
      <div className="flex flex-col lg:flex-row justify-between min-h-screen">
        <LeftSide>
          <SignUpForm />
        </LeftSide>
        <RightSide img={signupImg} />
      </div>
    </section>
  )
}

export default SignUp

import ConfirmTelegramForm from './_components/confirm-telegram-form.component'

function SignUp() {
  return (
    <section className="bg-white dark:bg-darkblack-500">
      <div className="flex flex-col lg:flex-row justify-between">
        <ConfirmTelegramForm />
      </div>
    </section>
  )
}

export default SignUp

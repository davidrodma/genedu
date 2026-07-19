import RootLayout from '@/app/(website)/layout'

export default function PublicLayout({ ...props }: React.PropsWithChildren) {
  return <RootLayout {...props}>{props.children}</RootLayout>
}

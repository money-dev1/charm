import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import ClientOnly from './components/ClientOnly'
import LoginModal from './components/modals/LoginModal'
import RegisterModal from './components/modals/RegisterModal'
import Navbar from './components/navbar/Navbar'
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'
import UploadModal from './components/modals/UploadModal'

const font = Nunito({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lucky Charm',
  description: 'Keep your own charm',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  console.log(`currentUser ${currentUser}`)
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <UploadModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  )
}

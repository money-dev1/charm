'use client'

import useLoginModal from '@/app/hooks/useLoginModal'
import useRegiserModal from '@/app/hooks/useRegisterModal'
import { SafeUser } from '@/app/types'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import MenuItem from './MenuItem'
import Avatar from '../Avatar'
import useUploadModal from '@/app/hooks/useUploadModal'

interface UserMenuProps {
  currentUser?: SafeUser | null | undefined
}
const UseMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter()
  const registerModal = useRegiserModal()
  const loginModal = useLoginModal()
  const uploadModal = useUploadModal()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value)
  }, [])

  const onUpload = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen()
    }

    uploadModal.onOpen()
  }, [currentUser, loginModal, uploadModal])

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={toggleOpen}
          className="flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-4 transition hover:shadow-md md:px-2 md:py-1"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:w-3/4">
          <div className="flex cursor-pointer flex-col">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push('/favorites')}
                  label="My favorites"
                />
                <MenuItem
                  onClick={() => {
                    router.push('/reservations')
                  }}
                  label="My reservations"
                />
                <MenuItem
                  onClick={() => router.push('/properties')}
                  label="My properties"
                />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={onUpload} label="Upload charms" />
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UseMenu

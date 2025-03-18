import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useLogoutMutation, useMyInfoQuery } from '@/store/api/authApi';

import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import { useAppContext } from './hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileDropdown = () => {

  const navigate = useNavigate();
  const { setIsLoggedIn, localLogout } = useAppContext()
  const { data: profileInfo } = useMyInfoQuery({})
  const [logoutAction, { isLoading: isLoggingOut }] = useLogoutMutation()
  const { t } = useTranslation()


  const UserInitials = profileInfo?.name?.split(" ").map((n: string) => n[0]).join("") ?? ""


  const handleLogout = async () => {
    if (isLoggingOut) return;

    const loadingId = toast.loading("Logging out...")

    try {
      await logoutAction({}).unwrap()
      toast.dismiss(loadingId)
      setIsLoggedIn(false)
      localLogout()
      navigate("/")
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }

  }



  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant='ghost'
        className='relative h-8 w-8 rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>
            {UserInitials}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='w-56' align='end' forceMount>
      {
        profileInfo?.name ?
          <DropdownMenuLabel className='font-normal cursor-pointer' onClick={() => navigate('/app/profile')}>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{profileInfo?.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {profileInfo?.email}
              </p>
            </div>
          </DropdownMenuLabel> : null
      }
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
        <LogOut size={18} />
        {t("Log Out")}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default ProfileDropdown
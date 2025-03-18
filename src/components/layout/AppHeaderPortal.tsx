import React from 'react'
import { createPortal } from 'react-dom';

type Props = {
  children?: React.ReactNode;
  title: React.ReactNode;
}

const AppHeaderPortal = ({ children, title }: Props) => {

  const [isAppLoaded, setIsAppLoaded] = React.useState(false)

  React.useEffect(() => {
    setIsAppLoaded(true)
  }, [])

  if (!isAppLoaded) {
    return null
  }

  return createPortal(
    <div className='w-full flex items-center justify-between gap-4'>
      <h2 className='text-lg font-medium'>{title}</h2>

      <div>
        {children}
      </div>
    </div>
    , document.getElementById('app-header-portal') as HTMLElement)

}

export default AppHeaderPortal
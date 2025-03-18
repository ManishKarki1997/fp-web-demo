import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

import { APP_CONFIG } from '@/config/config';
import React from 'react'
import { Switch } from './ui/switch'
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {

  const [language, setLanguage] = React.useState("en")

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng)
  };


  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === APP_CONFIG.LANGUAGE_KEYBOARD_SHORTCUT_KEY &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        changeLanguage(language === 'en' ? 'np' : 'en')
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [changeLanguage])

  return (
    <div className='justify-self-start'>
      <ToggleGroup type="single" value={language} onValueChange={changeLanguage}>
        <ToggleGroupItem value="en" aria-label="Change to Nepali Language" className={cn(language === "en" ? '!bg-secondary !border-primary' : "", "border w-10 h-10 p-2")}>
          <img className='h-4 w-8 object-fill' src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/800px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20230715230526" />
        </ToggleGroupItem>
        <ToggleGroupItem value="np" aria-label="Change to English Language" className={cn(language === "np" ? '!bg-secondary !border-primary' : "", "border w-10 h-10")}>
          <img className='h-5 w-5 object-cover' src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/492px-Flag_of_Nepal.svg.png?20220926151831" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default LanguageSwitcher
export const APP_CONFIG = {
  VITE_APP_BACKEND_API_URL: import.meta.env.VITE_APP_BACKEND_API_URL,
  API_STATIC_FILE_URL: `${import.meta.env.VITE_APP_BACKEND_API_URL}/uploads`,
  LANGUAGE_KEYBOARD_SHORTCUT_KEY:"l",
  THEME_KEYBOARD_SHORTCUT_KEY:"k",
  SIDEBAR_KEYBOARD_SHORTCUT_KEY:"b",
  getStaticFileUrl: (fileName:string) => `${APP_CONFIG.API_STATIC_FILE_URL}/${fileName}`, 
}
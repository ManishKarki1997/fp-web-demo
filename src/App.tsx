import './lib/i18n';

import { AppProvider } from './context/AppContext';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { router } from './Router';
import { store } from './store/store';

function App() {
  return (
    <>
      <Provider store={store}>
        <AppProvider>
          <ThemeProvider>
            <SidebarProvider>

              <TooltipProvider>
                <Toaster position='top-center' />
                <RouterProvider router={router} />
              </TooltipProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AppProvider>
      </Provider>
    </>
  );
}

export default App;

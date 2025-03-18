import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAppContext } from '@/components/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/hooks/useTheme';

const Home = () => {

  const { theme } = useTheme()
  const { isLoggedIn } = useAppContext()
  const navigate = useNavigate()

  const IMAGES = {
    light: {
      entity: "/images/entity.png",
      reporting: "/images/reporting.png",
      tags: "/images/tags.png",
    },
    dark: {
      entity: "/images/entity_dark.png",
      reporting: "/images/reporting_dark.png",
      tags: "/images/tags_dark.png",
    }
  }

  return (
    <div className='container'>

      <div className="text-center max-w-full md:max-w-6xl mx-auto h-[500px] flex flex-col items-center justify-center gap-4">
        <Logo />
        <h2 className='text-3xl lg:text-4xl font-bold text-balance  -mt-8'>Streamline Your Transactions</h2>
        <p className=' text-balance leading-8 text-lg font-normal mb-6'>
          Effortlessly track, analyze, and manage all your financial transactions across various entities. From loans to repayments, gain insights with comprehensive reports, intuitive charts, and organized tagging systems—all in one place.
        </p>

        <Button size={"lg"} variant="default" onClick={() => {
          navigate(isLoggedIn ? '/app' : '/get-started')
        }}>Get Started</Button>
      </div>

      <div className="mt-8 min-h-[700px]">
        <Tabs defaultValue="entities" className="w-full flex flex-col items-center justify-center">
          <TabsList>
            <TabsTrigger className='px-6' value="entities">Entities</TabsTrigger>
            <TabsTrigger className='px-6' value="reporting">Reporting</TabsTrigger>
            <TabsTrigger className='px-6' value="tagging">Tagging</TabsTrigger>
          </TabsList>
          <TabsContent value="entities">
            <img src={theme === "light" ? IMAGES.light.entity : IMAGES.dark.entity} alt="hero" className="w-full h-auto object-cover rounded border border-input" />
          </TabsContent>
          <TabsContent value="reporting">
            <img src={theme === "light" ? IMAGES.light.reporting : IMAGES.dark.reporting} alt="hero" className="w-full h-auto object-cover rounded border border-input" />
          </TabsContent>
          <TabsContent value="tagging">
            <img src={theme === "light" ? IMAGES.light.tags : IMAGES.dark.tags} alt="hero" className="w-full h-auto object-cover rounded border border-input" />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Home;

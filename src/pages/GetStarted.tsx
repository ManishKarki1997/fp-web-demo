import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserLoginSchema, UserRegistrationSchema } from "@/schema/UserSchema"
import { useLoginMutation, useRegisterMutation } from "@/store/api/authApi"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAppContext } from "@/components/hooks/useAppContext"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export default function GetStarted() {

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation()
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
  const { setIsLoggedIn } = useAppContext()
  const { t } = useTranslation()

  const activeTab = searchParams.get("tab") ?? "login"

  const registerForm = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const loginForm = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmitRegister(values: z.infer<typeof UserRegistrationSchema>) {
    if (isRegistering) return;

    const loadingId = toast.loading("Creating account....")

    try {
      await registerMutation(values).unwrap()
      toast.dismiss(loadingId)
      toast.success("Account created successfully.")
      registerForm.reset()
      setSearchParams("login")
    } catch (error) {
      console.log('error registering', error)
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }

  }

  async function onSubmitLogin(values: z.infer<typeof UserLoginSchema>) {
    if (isLoggingIn) return;

    const loadingId = toast.loading("Logging in...")

    try {
      await loginMutation(values).unwrap()
      toast.dismiss(loadingId)
      toast.success("Logged in successfully.")
      setIsLoggedIn(true)
      loginForm.reset()
      localStorage.setItem("isLoggedIn", "true")
      setTimeout(() => {
        navigate("/app")
      }, 1000);
    } catch (error) {
      const errorMessage = error?.data?.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="h-full flex-1 w-full flex items-center justify-center">
      <Card className="w-[450px] p-4">
        <CardHeader className="text-center">
          <CardTitle>{t("Authentication")}</CardTitle>
          <CardDescription>{t("Get Started Subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={(tab) => {
            setSearchParams({ tab })
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("Login")}</TabsTrigger>
              <TabsTrigger value="register">{t("Register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="py-4">
                  <div className="grid gap-4">
                    <div className="grid gap-1 mb-2">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Email")}</FormLabel>
                            <FormControl>
                              <Input type="email"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                    <div className="grid gap-1 mb-2">
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Password")}</FormLabel>
                            <FormControl>
                              <Input type="password"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button disabled={isLoggingIn}>
                      {isLoggingIn && (
                        <span className="mr-2">{t("Loading")}...</span>
                      )}
                      {t("Sign In")}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="py-4">
                  <div className="grid gap-4">
                    <div className="grid gap-1 mb-2">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Name")}</FormLabel>
                            <FormControl>
                              <Input type="name"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-1 mb-2">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Email")}</FormLabel>
                            <FormControl>
                              <Input type="email"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-1 mb-2">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Password")}</FormLabel>
                            <FormControl>
                              <Input type="password"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button disabled={isRegistering}>
                      {t("Create Account")}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
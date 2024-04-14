"use client"

import { Button } from "./ui/button";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast"
import Loading from "@/components/loading";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email invalid",
  }),
  password: z.string().min(1, {
    message: "Password is not empty",
  }),
})

export const UserLogin = ({onLoginSuccess}) => {
  const { toast } = useToast() 
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { email, password } = data
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (resp.ok) {
      onLoginSuccess()
      form.reset()
      toast({
        title: "Login Success",
        // description: (
        //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //   </pre>
        // ),
      })}
  }

  return (
    <>
    {form.formState.isSubmitting && <Loading />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full space-x-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </>

  )
}
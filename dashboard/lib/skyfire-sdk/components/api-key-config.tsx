"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { set } from "lodash"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updateError, updateSkyfireAPIKey } from "../context/action"
import { useSkyfire } from "../context/context"
import { setApiKeyToLocalStorage } from "../util"

const FormSchema = z.object({
  apikey: z
    .string()
    .refine(
      (value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value ?? ""
        ),
      "Invalid API key format"
    ),
})

export function ApiKeyConfig({ error }: { error?: AxiosError | null }) {
  const { dispatch } = useSkyfire()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apikey: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = setApiKeyToLocalStorage(data.apikey)
    dispatch(updateError(null))
    if (res) dispatch(updateSkyfireAPIKey(data.apikey))
  }

  return (
    <Card className="bg-transparent border-none p-0 shadow-none">
      <CardHeader>
        <CardTitle>Skyfire API Key Configuration</CardTitle>
        <CardDescription>
          {error ? (
            <p className="text-primary">
              It seems that your API key was invalid. Please re-enter. Make sure
              to copy from the correct environment.
            </p>
          ) : (
            "If you do not have an API Key, please visit app.skyfire.xyz to create."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="apikey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="API Key" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-secondary mt-4">
              Save it locally
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

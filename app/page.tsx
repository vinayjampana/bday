"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Cake,
  Calendar,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Wine,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitRSVP } from "@/app/actions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  drink: z.enum(["beer", "whiskey", "rum", "vodka", "no-booze"], {
    required_error: "Please select your drink preference.",
  }),
});

export default function BirthdayInvitation() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      // Submit to Google Sheets via server action
      await submitRSVP(values);

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit RSVP. Please try again later.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Birthday Celebration!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You're invited to my birthday party
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Party Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Saturday, March 22nd, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>7:00 PM onwards</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>
                {" "}
                <a
                  href="https://maps.app.goo.gl/MNrTdJN4BqwLPMmp9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  BITS Villa
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Cake className="h-5 w-5 text-primary" />
              <span>Food, drinks, music, and good vibes!</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-primary" />
              <span>Note</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Food and drinks are covered! But if we hit my booze budget
                limit, it’s BYOB or group up to keep the party going!
              </li>
              {/* <li>Alocoholic beverages could be limited, pool and bring your own once my budget is exhausted</li> */}
            </ul>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!submitted ? (
          <Card>
            <CardHeader>
              <CardTitle>RSVP</CardTitle>
              <CardDescription>Let me know if you can make it!</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drink"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Drink Preference</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="beer" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Beer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="whiskey" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Whiskey
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rum" />
                              </FormControl>
                              <FormLabel className="font-normal">Rum</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="vodka" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Vodka
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no-booze" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No booze for me
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit RSVP
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Thanks for your RSVP!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-16 w-16 text-primary mb-4" />
                <p className="text-lg">
                  Looking forward to celebrating with you!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        <footer className="text-center text-sm text-muted-foreground">
          {/* <p>Questions? Call or text 555-123-4567</p> */}
        </footer>
      </div>
    </div>
  );
}

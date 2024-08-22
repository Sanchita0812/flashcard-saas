import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flasher.io",
  description: "Flashcard SaaS with OpenAI and Stripe",
};

export default function RootLayout() {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className={inter.className}>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>
            <h1>Welcome to Flasher.io</h1>
            <p>This is your flashcard SaaS powered by OpenAI and Stripe.</p>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

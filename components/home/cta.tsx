import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <div className="bg-rose-600">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-playfair text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your wedding business?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-rose-100">
            Join Wedding Gate today and start leveraging powerful analytics and management tools to grow your wedding
            planning business.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-rose-600"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

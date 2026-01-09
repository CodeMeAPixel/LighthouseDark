import WrappedAnalyzerForm from "@/components/AnalyzerForm"
import LandingSections from "@/components/LandingSections"

const subtitle = "Blunt site audits. Real fixes."

export default function Home() {
  return (
    <div className="pb-9 lg:pb-8">
      <section className="container m-auto pt-[100px] lg:pt-[130px]">
        <div className="mx-auto flex max-w-[640px] flex-col items-center px-4">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF2574]/20 bg-[#FF2574]/5 px-4 py-1.5 text-sm dark:border-[#FF6B00]/20 dark:bg-[#FF6B00]/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2574] opacity-75 dark:bg-[#FF6B00]"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF2574] dark:bg-[#FF6B00]"></span>
            </span>
            <span className="font-medium text-[#FF2574] dark:text-[#FF6B00]">Free • No signup required</span>
          </div>

          {/* Main heading */}
          <div className="mt-2">
            <h1 className="font-display text-balance text-center text-[48px] font-medium leading-[1.05] tracking-[-0.02em] lg:text-[72px]">
              <div className="title-font relative mx-auto w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="relative bg-gradient-to-r from-[#FF2574] to-[#FF8AB2] bg-clip-text text-transparent dark:from-[#FF6B00] dark:to-[#FFC000]">
                  <span>{subtitle}</span>
                </div>
              </div>
            </h1>
            
            {/* Subtitle */}
            <p className="mx-auto mt-5 max-w-[480px] text-balance text-center text-base text-light11 dark:text-dark11 md:text-lg">
              Paste a URL and get a sharp, no-BS critique across{" "}
              <span className="font-medium text-light12 dark:text-dark12">SEO</span> and{" "}
              <span className="font-medium text-light12 dark:text-dark12">Core Web Vitals</span>{" "}
              with clear next steps.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center gap-4 text-xs text-light11 dark:text-dark11">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real CrUX data
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI-powered insights
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Privacy-first
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <WrappedAnalyzerForm />
      </section>

      <LandingSections />
    </div>
  )
}

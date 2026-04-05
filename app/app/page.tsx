import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { EmailSignupForm } from '@/components/elements/email-signup-form'
import { Link } from '@/components/elements/link'
import { Main } from '@/components/elements/main'
import { Screenshot } from '@/components/elements/screenshot'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { FeatureThreeColumnWithDemos, Features } from '@/components/sections/features-three-column-with-demos'
import { FooterCategory, FooterLink, FooterWithLinkCategories } from '@/components/sections/footer-with-link-categories'
import { HeroWithDemoOnBackground } from '@/components/sections/hero-with-demo-on-background'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLogoActionsAndCenteredLinks,
} from '@/components/sections/navbar-with-logo-actions-and-centered-links'
import { Plan, PricingMultiTier } from '@/components/sections/pricing-multi-tier'
import { Stat, StatsWithGraph } from '@/components/sections/stats-with-graph'
import { TestimonialLargeQuote } from '@/components/sections/testimonial-with-large-quote'

export default function Page() {
  return (
    <>
      <NavbarWithLogoActionsAndCenteredLinks
        id="navbar"
        links={
          <>
            <NavbarLink href="/pricing">Pricing</NavbarLink>
            <NavbarLink href="/about">About</NavbarLink>
            <NavbarLink href="/app" className="sm:hidden">
              Get started
            </NavbarLink>
          </>
        }
        logo={
          <NavbarLogo href="/">
            <span className="text-2xl font-display font-bold text-olive-950 dark:text-olive-50">
              Stride
            </span>
          </NavbarLogo>
        }
        actions={
          <>
            <NavbarLink href="/login">Sign in</NavbarLink>
            <ButtonLink href="/app">Get started</ButtonLink>
          </>
        }
      />

      <Main>
        {/* Hero */}
        <HeroWithDemoOnBackground
          id="hero"
          eyebrow={
            <AnnouncementBadge href="#" text="AI-powered daily planning" cta="Learn more" variant="overlay" />
          }
          headline="Your day, planned automatically."
          subheadline={
            <p>
              Add your tasks, connect your calendar, and let AI build your perfect day. No more manual scheduling, no more decision fatigue.
            </p>
          }
          cta={
            <EmailSignupForm
              className="max-w-full"
              variant="overlay"
              cta={
                <>
                  Start planning <ArrowNarrowRightIcon />
                </>
              }
            />
          }
          demo={
            <>
              <img
                className="bg-white/75 md:hidden dark:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=900"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
              <img
                className="bg-black/75 not-dark:hidden md:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=900&color=olive"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
              <img
                className="bg-white/75 max-md:hidden lg:hidden dark:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=1200"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
              <img
                className="bg-black/75 not-dark:hidden max-md:hidden lg:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=1200&color=olive"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
              <img
                className="bg-white/75 max-lg:hidden dark:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=1500"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
              <img
                className="bg-black/75 not-dark:hidden max-lg:hidden"
                src="https://assets.tailwindplus.com/screenshots/1.webp?top=1500&color=olive"
                alt="Stride app preview"
                width={3440}
                height={1500}
              />
            </>
          }
          footer={null}
        />

        {/* Features */}
        <Features
          id="features"
          headline="Everything you need to plan your perfect day."
          subheadline={
            <p>
              Stride combines your tasks, calendar, and AI to create a realistic daily schedule in seconds. Stop juggling multiple tools and let AI do the heavy lifting.
            </p>
          }
          cta={
            <Link href="/app">
              Try it now <ArrowNarrowRightIcon />
            </Link>
          }
          features={
            <>
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="blue" placement="bottom-right">
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1200&top=736"
                      alt="Calendar sync"
                      className="bg-white/75 sm:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1200&top=736&color=olive"
                      alt="Calendar sync"
                      className="bg-black/75 not-dark:hidden sm:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1800&top=736"
                      alt="Calendar sync"
                      className="bg-white/75 max-sm:hidden lg:hidden dark:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1800&top=736&color=olive"
                      alt="Calendar sync"
                      className="bg-black/75 not-dark:hidden max-sm:hidden lg:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1200&top=736"
                      alt="Calendar sync"
                      className="bg-white/75 max-lg:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?left=1200&top=736&color=olive"
                      alt="Calendar sync"
                      className="bg-black/75 not-dark:hidden max-lg:hidden"
                      width={1200}
                      height={736}
                    />
                  </Screenshot>
                }
                headline="Smart Calendar Sync"
                subheadline={<p>Connect Google Calendar and Stride automatically finds free time between your meetings.</p>}
              />
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="purple" placement="top-left">
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&bottom=736"
                      alt="AI scheduling"
                      className="bg-white/75 sm:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&bottom=736&color=olive"
                      alt="AI scheduling"
                      className="bg-black/75 not-dark:hidden sm:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&bottom=736"
                      alt="AI scheduling"
                      className="bg-white/75 max-sm:hidden lg:hidden dark:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&bottom=736&color=olive"
                      alt="AI scheduling"
                      className="bg-black/75 not-dark:hidden max-sm:hidden lg:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&bottom=736"
                      alt="AI scheduling"
                      className="bg-white/75 max-lg:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&bottom=736&color=olive"
                      alt="AI scheduling"
                      className="bg-black/75 not-dark:hidden max-lg:hidden"
                      width={1200}
                      height={736}
                    />
                  </Screenshot>
                }
                headline="AI-Powered Scheduling"
                subheadline={<p>AI places your tasks in the best time slots based on priorities, deadlines, and your calendar.</p>}
              />
              <FeatureThreeColumnWithDemos
                demo={
                  <Screenshot wallpaper="brown" placement="bottom-left">
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&top=736"
                      alt="Photo to task"
                      className="bg-white/75 sm:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&top=736&color=olive"
                      alt="Photo to task"
                      className="bg-black/75 not-dark:hidden sm:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&top=736"
                      alt="Photo to task"
                      className="bg-white/75 max-sm:hidden lg:hidden dark:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1800&top=736&color=olive"
                      alt="Photo to task"
                      className="bg-black/75 not-dark:hidden max-sm:hidden lg:hidden"
                      width={1800}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&top=736"
                      alt="Photo to task"
                      className="bg-white/75 max-lg:hidden dark:hidden"
                      width={1200}
                      height={736}
                    />
                    <img
                      src="https://assets.tailwindplus.com/screenshots/1.webp?right=1200&top=736&color=olive"
                      alt="Photo to task"
                      className="bg-black/75 not-dark:hidden max-lg:hidden"
                      width={1200}
                      height={736}
                    />
                  </Screenshot>
                }
                headline="Photo-to-Task"
                subheadline={<p>Snap a photo of your whiteboard, syllabus, or notes. AI extracts tasks automatically.</p>}
              />
            </>
          }
        />

        {/* Stats */}
        <StatsWithGraph
          id="stats"
          eyebrow="Built for productivity"
          headline="The daily planner that actually works."
          subheadline={
            <p>
              Stride helps students, professionals, and teams plan their days with AI. From busy college students to startup founders, we help thousands of people stay organized and productive every day.
            </p>
          }
        >
          <Stat stat="10k+" text="Tasks scheduled every day across thousands of users." />
          <Stat stat="30 min" text="Average time saved per day." />
        </StatsWithGraph>

        {/* Widget Download */}
        <section id="widget" className="py-16">
          <Container className="flex flex-col items-center gap-10 text-center">
            <div className="flex max-w-3xl flex-col gap-4">
              <Subheading>Stay in flow with the Stride widget</Subheading>
              <Text className="text-pretty">
                <p>
                  A floating desktop companion that shows your current task, upcoming schedule, and lets you chat with your AI planner — without switching to the browser.
                </p>
              </Text>
            </div>
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-olive-200 shadow-lg dark:border-olive-800">
              <img
                src="/widget-preview.svg"
                alt="Stride desktop widget preview"
                width={760}
                height={520}
                className="h-auto w-full"
              />
            </div>
            <ButtonLink
              href={process.env.NEXT_PUBLIC_WIDGET_DOWNLOAD_URL || "#"}
              size="lg"
            >
              Download for macOS
            </ButtonLink>
          </Container>
        </section>

        {/* Testimonial */}
        <TestimonialLargeQuote
          id="testimonial"
          quote={
            <p>
              Stride has completely changed how I manage my day. I used to spend 20 minutes every morning figuring out when to do things. Now AI does it in seconds, and the schedule actually works.
            </p>
          }
          img={
            <img
              src="https://assets.tailwindplus.com/avatars/10.webp?size=160"
              alt="Jordan Rogers"
              className="not-dark:bg-white/75 dark:bg-black/75 rounded-full object-cover"
              width={160}
              height={160}
            />
          }
          name="Jordan Rogers"
          byline="Founder at Anomaly"
        />

        {/* FAQs */}
        <FAQsTwoColumnAccordion id="faqs" headline="Questions & Answers">
          <Faq
            id="faq-1"
            question="How does Stride build my schedule?"
            answer="Stride uses AI (powered by OpenAI) to analyze your tasks, calendar events, and available time. It automatically places tasks in the best time slots, avoiding conflicts and ensuring a realistic schedule."
          />
          <Faq
            id="faq-2"
            question="What calendars does Stride support?"
            answer="Currently, Stride supports Google Calendar. We're working on adding Outlook and Apple Calendar support soon."
          />
          <Faq
            id="faq-3"
            question="Can I use Stride on my phone?"
            answer="Yes! Stride is a Progressive Web App (PWA), which means you can install it on your phone and use it like a native app. It works on both iOS and Android."
          />
          <Faq
            id="faq-4"
            question="How does photo-to-task work?"
            answer="Take a photo of your whiteboard, syllabus, or handwritten notes. Stride uses AI to extract tasks from the image and add them to your task list automatically."
          />
        </FAQsTwoColumnAccordion>

        {/* Pricing */}
        <PricingMultiTier
          id="pricing"
          headline="Pricing to fit your needs."
          plans={
            <>
              <Plan
                name="Free"
                price="$0"
                period="/mo"
                subheadline={<p>Perfect for trying out Stride</p>}
                features={[
                  '10 AI schedules per month',
                  'Google Calendar sync',
                  'Task management',
                  'PWA (installable app)',
                  'Basic support',
                ]}
                cta={
                  <SoftButtonLink href="/app" size="lg">
                    Start free
                  </SoftButtonLink>
                }
              />
              <Plan
                name="Professional"
                price="$12"
                period="/mo"
                subheadline={<p>For individuals who want unlimited planning</p>}
                badge="Most popular"
                features={[
                  'Unlimited AI schedules',
                  'Photo-to-task',
                  'Browser notifications',
                  'Goals & priorities',
                  'Dynamic re-scheduling',
                  'Priority support',
                ]}
                cta={
                  <ButtonLink href="/app" size="lg">
                    Start free trial
                  </ButtonLink>
                }
              />
              <Plan
                name="Student"
                price="$6"
                period="/mo"
                subheadline={<p>50% off for students with .edu email</p>}
                features={[
                  'Everything in Professional',
                  'Student discount',
                  'Photo syllabus import',
                  'Academic calendar sync',
                  'Study time optimization',
                ]}
                cta={
                  <SoftButtonLink href="/app" size="lg">
                    Verify student status
                  </SoftButtonLink>
                }
              />
            </>
          }
        />

        {/* Call To Action */}
        <CallToActionSimple
          id="call-to-action"
          headline="Ready to plan your perfect day?"
          subheadline={
            <p>
              Join thousands of people using Stride to stay organized and productive. Start planning with AI today.
            </p>
          }
          cta={
            <div className="flex items-center gap-4">
              <ButtonLink href="/app" size="lg">
                Start planning
              </ButtonLink>

              <PlainButtonLink href="#features" size="lg">
                Learn more <ChevronIcon />
              </PlainButtonLink>
            </div>
          }
        />
      </Main>

      <FooterWithLinkCategories
        id="footer"
        links={
          <>
            <FooterCategory title="Product">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/app">Get Started</FooterLink>
            </FooterCategory>
            <FooterCategory title="Company">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </FooterCategory>
            <FooterCategory title="Resources">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">API Docs</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterCategory>
            <FooterCategory title="Legal">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </FooterCategory>
          </>
        }
        fineprint="© 2026 Stride. AI-powered daily planner."
      />
    </>
  )
}

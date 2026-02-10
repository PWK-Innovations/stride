import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { RocketIcon } from '@/components/icons/rocket-icon'
import { HeartIcon } from '@/components/icons/heart-icon'
import { TargetIcon } from '@/components/icons/target-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import { FooterCategory, FooterLink, FooterWithLinkCategories } from '@/components/sections/footer-with-link-categories'
import { HeroTwoColumnWithPhoto } from '@/components/sections/hero-two-column-with-photo'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLogoActionsAndCenteredLinks,
} from '@/components/sections/navbar-with-logo-actions-and-centered-links'
import { TeamMember, TeamThreeColumnGrid } from '@/components/sections/team-three-column-grid'
import { AnnouncementBadge } from '@/components/elements/announcement-badge'

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
            <ButtonLink href="/app">Get started</ButtonLink>
          </>
        }
      />

      <Main>
        {/* Hero */}
        <HeroTwoColumnWithPhoto
          id="hero"
          eyebrow={<AnnouncementBadge href="#" text="Built for productivity" cta="Learn more" />}
          headline="Planning made simple with AI."
          subheadline={
            <p>
              We're on a mission to help people reclaim their time and reduce decision fatigue. Stride uses AI to automatically build your perfect day, so you can focus on what matters most.
            </p>
          }
          photo={
            <>
              <img
                className="h-full w-full max-xl:hidden object-cover not-dark:bg-white/75 dark:bg-black/75"
                src="https://assets.tailwindplus.com/photos/1.webp"
                width={1800}
                height={1600}
                alt="Stride - planning made simple"
              />
              <img
                className="h-full w-full xl:hidden object-cover not-dark:bg-white/75 dark:bg-black/75"
                src="https://assets.tailwindplus.com/photos/1.webp"
                width={1800}
                height={945}
                alt="Stride - planning made simple"
              />
            </>
          }
        />

        {/* Leadership team */}
        <TeamThreeColumnGrid
          id="team"
          headline="Our leadership team"
          subheadline={
            <p>
              Stride&apos;s leadership team combines decades of experience in private equity, where they honed their
              skills in cost-cutting and maximizing shareholder value.
            </p>
          }
        >
          <TeamMember
            img={
              <img
                src="/about/parker.png"
                alt="Parker Watts"
                className="h-full w-full object-cover object-center not-dark:bg-white/75 dark:bg-black/75"
                style={{ objectViewBox: 'inset(5% 5% 5% 5%)' }}
                width={800}
                height={800}
              />
            }
            name="Parker Watts"
            byline="Frontend Engineer"
          />
          <TeamMember
            img={
              <img
                src="/about/alex.png"
                alt="Alex Fankhauser"
                className="h-full w-full object-cover object-top not-dark:bg-white/75 dark:bg-black/75"
                style={{ objectViewBox: 'inset(0% 0% 0% 0%)' }}
                width={800}
                height={800}
              />
            }
            name="Alex Fankhauser"
            byline="Backend Engineer"
          />
          <TeamMember
            img={
              <img
                src="/about/caleb.png"
                alt="Caleb Gooch"
                className="h-full w-full object-cover object-top not-dark:bg-white/75 dark:bg-black/75"
                style={{ objectViewBox: 'inset(0% 0% 0% 0%)' }}
                width={800}
                height={800}
              />
            }
            name="Caleb Gooch"
            byline="Data Engineer"
          />
        </TeamThreeColumnGrid>

        {/* Values */}
        <FeaturesThreeColumn
          id="values"
          eyebrow="Our values"
          headline="What drives us forward."
          subheadline={
            <p>
              Stride is built on the belief that technology should reduce complexity, not add to it. We're committed to building tools that actually help people be more productive.
            </p>
          }
        >
          <Feature
            icon={<RocketIcon />}
            headline="Move fast"
            subheadline={<p>Ship features quickly and iterate based on real user feedback. No bureaucracy, just results.</p>}
          />
          <Feature
            icon={<TargetIcon />}
            headline="Stay focused"
            subheadline={<p>Build what matters. Every feature should solve a real problem for real users.</p>}
          />
          <Feature
            icon={<HeartIcon />}
            headline="Care deeply"
            subheadline={<p>Treat users' time and data with respect. Build products we'd want to use ourselves.</p>}
          />
        </FeaturesThreeColumn>

        {/* Story - Why we built Stride */}
        <section className="bg-olive-50 py-0 pb-15 dark:bg-olive-950" id="why-we-built">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col gap-12 xl:flex-row xl:items-center xl:gap-16">
              <div className="flex flex-1 overflow-hidden rounded-xl outline -outline-offset-1 outline-black/5 dark:outline-white/5 order-2 xl:order-1 aspect-[4/5] xl:aspect-[4/5]">
                <img
                  src="/about/running.png"
                  alt="Planning your day"
                  className="h-full w-full object-cover not-dark:bg-white/75 dark:bg-black/75"
                  width={800}
                  height={1067}
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h2 className="text-3xl font-display font-bold tracking-tight text-olive-900 dark:text-olive-50 sm:text-4xl">
                  Why we built Stride
                </h2>
                <div className="mt-6 space-y-4 text-lg text-olive-700 dark:text-olive-300">
                  <p>
                    Every morning, millions of people spend precious time figuring out when to do things. They juggle tasks, meetings, deadlines, and priorities across multiple tools. It&apos;s exhausting and inefficient.
                  </p>
                  <p>
                    We built Stride because we experienced this problem ourselves. As busy professionals and students, we were tired of spending 20+ minutes every morning manually planning our day.
                  </p>
                  <p>
                    With AI, we can automate this entire process. Stride looks at your tasks and calendar, understands your constraints, and builds a realistic schedule in seconds. It&apos;s like having a personal assistant who knows exactly how to organize your day.
                  </p>
                  <p>
                    We&apos;re just getting started. Our vision is to make daily planning completely automatic, so you can focus on doing great work instead of organizing it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                Get started
              </ButtonLink>

              <PlainButtonLink href="/#features" size="lg">
                See how it works <ChevronIcon />
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
              <FooterLink href="/#features">Features</FooterLink>
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

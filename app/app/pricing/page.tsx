import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { ChevronIcon } from '@/components/icons/chevron-icon'
import { CallToActionSimpleCentered } from '@/components/sections/call-to-action-simple-centered'
import { FAQsAccordion, Faq } from '@/components/sections/faqs-accordion'
import { FooterCategory, FooterLink, FooterWithLinkCategories } from '@/components/sections/footer-with-link-categories'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLogoActionsAndCenteredLinks,
} from '@/components/sections/navbar-with-logo-actions-and-centered-links'
import { Plan, PricingMultiTier } from '@/components/sections/pricing-multi-tier'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { Section } from '@/components/elements/section'

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
        <Section className="text-center">
          <Heading>Simple, transparent pricing</Heading>
          <Text size="lg" className="mx-auto max-w-2xl text-center pt-4">
            Start free, upgrade when you need more. No contracts, cancel anytime.
          </Text>
        </Section>

        {/* Pricing */}
        <PricingMultiTier
          id="pricing"
          headline="Choose the plan that fits your needs."
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
                  <ButtonLink href="/app" size="lg">
                    Start free
                  </ButtonLink>
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
                  <ButtonLink href="/app" size="lg">
                    Verify student status
                  </ButtonLink>
                }
              />
            </>
          }
        />

        {/* FAQs */}
        <FAQsAccordion id="faqs" headline="Pricing Questions">
          <Faq
            id="faq-1"
            question="Do I need a credit card for the free plan?"
            answer="No! The free plan is completely free with no credit card required. You get 10 AI schedules per month to try out Stride."
          />
          <Faq
            id="faq-2"
            question="What happens after my free trial ends?"
            answer="If you're on the Professional trial, you'll be charged $12/month after 14 days. You can cancel anytime before then with no charge."
          />
          <Faq
            id="faq-3"
            question="How do I verify my student status?"
            answer="We use a simple .edu email verification. Sign up with your school email address and you'll automatically get the 50% student discount."
          />
          <Faq
            id="faq-4"
            question="Can I switch plans later?"
            answer="Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
          />
          <Faq
            id="faq-5"
            question="What payment methods do you accept?"
            answer="We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. We'll add more payment methods soon."
          />
        </FAQsAccordion>

        {/* Call To Action */}
        <CallToActionSimpleCentered
          id="call-to-action"
          headline="Ready to start planning?"
          subheadline={
            <p>Join thousands of people using Stride to stay organized. Start with the free plan today.</p>
          }
          cta={
            <div className="flex items-center gap-4">
              <ButtonLink href="/app" size="lg">
                Get started
              </ButtonLink>

              <PlainButtonLink href="/#features" size="lg">
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

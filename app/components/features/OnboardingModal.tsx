"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  CalendarDaysIcon,
  PlusCircleIcon,
  SparklesIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { createLogger } from "@/lib/logger";

const logger = createLogger("onboarding");

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  hint: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "Connect your calendar",
    description:
      "Link your Google or Outlook calendar so Stride can schedule around your existing meetings and commitments.",
    icon: CalendarDaysIcon,
    hint: "You'll find the calendar buttons on your dashboard",
  },
  {
    title: "Add your tasks",
    description:
      "Type a task, snap a photo of your to-do list, or record a voice note — Stride extracts tasks from all three.",
    icon: PlusCircleIcon,
    hint: "Try adding a task with the + button",
  },
  {
    title: "Build your day",
    description:
      "Hit \"Build my day\" and the AI agent will create an optimized schedule based on your tasks, calendar, and preferences.",
    icon: SparklesIcon,
    hint: "Use ⌘B as a shortcut",
  },
  {
    title: "Install the widget",
    description:
      "Get the Stride desktop widget to see your schedule at a glance — always visible on your desktop.",
    icon: ComputerDesktopIcon,
    hint: "Available for macOS",
  },
];

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({
  open,
  onComplete,
}: OnboardingModalProps): React.ReactNode {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  async function markComplete() {
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { completed_onboarding: true },
      });
    } catch (error) {
      logger.error("Failed to mark onboarding complete", { error });
    }
  }

  function handleNext() {
    if (isLastStep) {
      handleFinish();
      return;
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    trackEvent("onboarding_step_viewed", {
      step: nextStep,
      stepName: STEPS[nextStep].title,
    });
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSkip() {
    trackEvent("onboarding_skipped", { atStep: currentStep });
    await markComplete();
    onComplete();
  }

  async function handleFinish() {
    trackEvent("onboarding_completed");
    await markComplete();
    onComplete();
  }

  return (
    <Dialog open={open} onClose={handleSkip} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-olive-900">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-display font-semibold text-olive-900 dark:text-olive-50">
              Welcome to Stride
            </DialogTitle>
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-olive-500 hover:text-olive-700 dark:text-olive-400 dark:hover:text-olive-200"
            >
              Skip
            </button>
          </div>

          {/* Step content */}
          <div className="mt-6 flex flex-col items-center text-center">
            {/* Icon placeholder */}
            <div className="flex h-32 w-full items-center justify-center rounded-lg bg-olive-50 dark:bg-olive-800/50">
              <step.icon className="h-16 w-16 text-olive-400 dark:text-olive-500" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-olive-900 dark:text-olive-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-olive-600 dark:text-olive-400">
              {step.description}
            </p>
            <p className="mt-1 text-xs text-olive-400 dark:text-olive-500">
              {step.hint}
            </p>
          </div>

          {/* Step indicator dots */}
          <div className="mt-6 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === currentStep
                    ? "bg-olive-600 dark:bg-olive-300"
                    : "bg-olive-200 dark:bg-olive-700"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-md border border-olive-300 px-4 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:bg-olive-500 dark:hover:bg-olive-600"
            >
              {isLastStep ? "Get started" : "Next"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

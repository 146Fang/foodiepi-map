'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Trophy, Coins, Gift, Star } from 'lucide-react';
import { PiAuthProvider } from '@/components/PiAuthProvider';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'How to Earn Points',
    description: 'Learn how to accumulate points through various actions',
    icon: <Trophy className="w-8 h-8" />,
    details: [
      'Recommend a restaurant: +1 point',
      'Like a restaurant: +1 point',
      'Rate a restaurant: +1 point',
      'Comment on a restaurant: +1 point',
      'Tip a restaurant: +1 point',
      'Make a payment: +2 points (once per 24 hours)',
    ],
  },
  {
    title: 'How to Make Payments',
    description: 'Pay for meals using Pi Network',
    icon: <Coins className="w-8 h-8" />,
    details: [
      'Click on a restaurant marker on the map',
      'View the restaurant dashboard',
      'Enter the payment amount',
      'Click "Pay with Pi"',
      'Complete the payment in Pi app',
      '95% goes to restaurant, 5% to reward pool',
    ],
  },
  {
    title: 'How Rewards Work',
    description: 'Understand the reward distribution system',
    icon: <Gift className="w-8 h-8" />,
    details: [
      'Rewards are calculated annually (Jan 1 - Dec 31)',
      'Formula: (Your Score / Restaurant Total Score) × (Reward Pool × 90%)',
      'Your contribution to each restaurant determines your share',
      'Check your estimated reward in the dashboard',
      'Rewards are distributed at year end',
    ],
  },
  {
    title: 'Tips for Success',
    description: 'Maximize your rewards and contributions',
    icon: <Star className="w-8 h-8" />,
    details: [
      'Be active: More actions = more points',
      'Explore different restaurants',
      'Make payments regularly (once per 24 hours)',
      'Share quality restaurant recommendations',
      'Engage with the community through likes and comments',
    ],
  },
];

export default function TutorialPage() {
  return (
    <PiAuthProvider autoAuth={false}>
      <TutorialContent />
    </PiAuthProvider>
  );
}

function TutorialContent() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Tutorial</h1>
          <p className="text-white/80">
            Learn how to use FoodiePi Map and maximize your rewards
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mb-8">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-white w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* 当前步骤卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white mb-4">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-white/70 text-center">
              {currentStepData.description}
            </p>
          </div>

          <div className="space-y-3">
            {currentStepData.details.map((detail, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <span className="text-white/60 text-sm">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>

          <button
            onClick={nextStep}
            disabled={currentStep === tutorialSteps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* 快速链接 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors text-center"
          >
            <p className="text-white font-medium">Explore Map</p>
          </a>
          <a
            href="/recommend"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors text-center"
          >
            <p className="text-white font-medium">Recommend Restaurant</p>
          </a>
          <a
            href="/dashboard"
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors text-center"
          >
            <p className="text-white font-medium">View Dashboard</p>
          </a>
        </div>
      </div>
    </div>
  );
}

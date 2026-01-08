import React from 'react';
import { LayoutTemplate, Sparkles, Zap, Shield, Heart } from 'lucide-react';
import { CarouselSlide } from '@/types/carousel';

interface TemplatesPanelProps {
  onSelectTemplate: (slides: CarouselSlide[]) => void;
}

const TEMPLATES = [
  {
    id: 'how-to-guide',
    name: 'Step-by-Step Guide',
    description: 'Perfect for educational content and tutorials.',
    icon: LayoutTemplate,
    category: 'Creative',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'How to Master [Your Topic] in 5 Steps',
          subtitle: 'A complete guide for beginners',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Step 1: The Foundation',
          body: 'Explain the first and most important step here. Focus on the value provided.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'Step 2: Implementation',
          body: 'Now show how to actually apply the foundation built in step 1.',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'Was this helpful?',
          cta_text: 'Follow for more tips!',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'listicle',
    name: 'Top 5 Listicle',
    description: 'High engagement format for quick tips and insights.',
    icon: Zap,
    category: 'Premium',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: '5 Secrets to [Desired Outcome]',
          subtitle: 'Number 3 will surprise you!',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: '1. Quality over Quantity',
          body: 'Focus on depth rather than surface-level breadth.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Ready to scale?',
          cta_text: 'Book a discovery call',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'mistakes-to-avoid',
    name: 'Mistakes to Avoid',
    description: 'Stop your audience from making common errors.',
    icon: Shield,
    category: 'Professional',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'Stop Doing These 3 Things in [Your Field]',
          subtitle: "They are killing your progress.",
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Mistake #1: [Common Error]',
          body: 'Most people think [X] is good, but actually it leads to [Y].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Avoid these and scale.',
          cta_text: 'Get the full checklist',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'case-study',
    name: 'Client Case Study',
    description: 'Build massive authority with real results.',
    icon: Sparkles,
    category: 'Premium',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'How we helped [Client] achieve [Result]',
          subtitle: 'The 3-step strategy we used.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Challenge',
          body: '[Client] was struggling with [Problem] for months.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'The Solution',
          body: 'We implemented [Strategy] and saw immediate improvements.',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'Want similar results?',
          cta_text: 'DM me "SCALE"',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'pas-formula',
    name: 'Problem-Agitate-Solve',
    description: 'Classic copywriting formula for conversions.',
    icon: Zap,
    category: 'Creative',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'Tired of [Common Pain Point]?',
          subtitle: "It's more common than you think.",
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Why it hurts',
          body: 'Every day you wait, [Pain Point] costs you [Time/Money].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'The Solution',
          body: 'Introducing [Your Product/Service]. The fix for [Pain Point].',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'Fix it today.',
          cta_text: 'Link in bio',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'before-after',
    name: 'Before vs After',
    description: 'Visual comparison of transformation.',
    icon: Heart,
    category: 'Creative',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'The Transformation: [Before] to [After]',
          subtitle: 'A journey of [Timeframe].',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Where we started',
          body: 'Low engagement, zero leads, and total frustration.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'Where we are now',
          body: '10k followers, consistent leads, and a clear brand.',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'Start your journey.',
          cta_text: 'Follow for the roadmap',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'daily-routine',
    name: 'A Day in the Life',
    description: 'Build personal connection with your routine.',
    icon: Sparkles,
    category: 'Minimal',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'My Daily Routine as a [Your Role]',
          subtitle: 'Consistency is the secret sauce.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Morning: Deep Work',
          body: '4 hours of uninterrupted focus on high-leverage tasks.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'Evening: Reflection',
          body: 'Reviewing progress and planning the next day.',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'What does your day look like?',
          cta_text: 'Comment below!',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'tools-roundup',
    name: 'Tech Stack Roundup',
    description: 'Share the tools that make you productive.',
    icon: Zap,
    category: 'Professional',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'My Top 3 Tools for [Activity]',
          subtitle: "You won't believe how much time these save.",
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: '1. [Tool Name]',
          body: 'Best for [Feature]. It replaced 3 other apps for me.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'What am I missing?',
          cta_text: 'Share your stack!',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'vs-myth',
    name: 'Myth vs Reality',
    description: 'Debunk common industry misconceptions.',
    icon: Shield,
    category: 'Professional',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'Myth vs Reality in [Industry]',
          subtitle: "Let's set the record straight.",
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Myth',
          body: '"You need [X] to achieve [Y]."',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'content',
        content: {
          title: 'The Reality',
          body: 'Actually, you only need [Z]. Here is why.',
        },
        isVisible: true
      },
      {
        id: '4',
        type: 'outro',
        content: {
          title: 'Spread the truth.',
          cta_text: 'Share this post',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'quick-tips',
    name: 'Lightning Tips',
    description: 'Rapid-fire value for quick consumption.',
    icon: Zap,
    category: 'Creative',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: '3 Lightning Tips for [Niche]',
          subtitle: 'Save 10+ hours a week.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Tip #1: [Actionable Tip]',
          body: 'Just do [Action] and see [Result].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Want more like this?',
          cta_text: 'Follow for daily value',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'hiring-guide',
    name: 'Hiring Playbook',
    description: 'Establish yourself as a leader and manager.',
    icon: Shield,
    category: 'Professional',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'How to Hire Your First [Role]',
          subtitle: 'The framework for scale.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Filter',
          body: 'Look for [Skill] and [Trait]. Ignore [Cliché].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Building a team?',
          cta_text: 'Check my free guide',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'personal-transformation',
    name: 'Personal Journey',
    description: 'Share your background and build trust.',
    icon: Heart,
    category: 'Creative',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: "How I went from [Job] to [Passion]",
          subtitle: "It wasn't an easy path.",
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Turning Point',
          body: 'I realized that [Insight] was more important than [Security].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Your turn.',
          cta_text: 'What is stopping you?',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'resource-list',
    name: 'Ultimate Resource',
    description: 'Provide an curated list of valuable assets.',
    icon: Sparkles,
    category: 'Premium',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'The Ultimate [Topic] Toolkit',
          subtitle: 'Everything you need to get started.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Resources',
          body: 'Books: [X], Courses: [Y], Podcasts: [Z].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Did I miss any?',
          cta_text: 'Drop a comment!',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'comparison-guide',
    name: 'Tool Comparison',
    description: 'Help your audience choose the right solution.',
    icon: Zap,
    category: 'Minimal',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: '[Tool A] vs [Tool B]',
          subtitle: 'Which one should you choose in 2026?',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Verdict',
          body: 'Use [A] for [Need], Use [B] for [Budget].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Still undecided?',
          cta_text: 'DM for a custom recommendation',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'mindset-shift',
    name: 'Mindset Shift',
    description: 'Change how your audience thinks about a topic.',
    icon: Heart,
    category: 'Minimal',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'Stop Thinking About [Old Idea]',
          subtitle: 'Start thinking about [New Idea].',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'The Shift',
          body: 'When you change your perspective, you change your results.',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Ready to shift?',
          cta_text: 'Follow for mindset tips',
        },
        isVisible: true
      }
    ]
  },
  {
    id: 'expert-predictions',
    name: '2026 Predictions',
    description: 'Show authority by predicting future trends.',
    icon: Sparkles,
    category: 'Premium',
    slides: [
      {
        id: '1',
        type: 'intro',
        content: {
          title: 'My Top 3 Predictions for [Field] in 2026',
          subtitle: 'Be ahead of the curve.',
        },
        isVisible: true
      },
      {
        id: '2',
        type: 'content',
        content: {
          title: 'Prediction #1',
          body: '[AI/Tech] will completely replace [Manual Task].',
        },
        isVisible: true
      },
      {
        id: '3',
        type: 'outro',
        content: {
          title: 'Are you ready?',
          cta_text: 'Get the full report',
        },
        isVisible: true
      }
    ]
  }
];

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-brand-500" />
            Carousel Templates
        </h3>
        <p className="text-xs text-slate-500">Pick a structure to start from scratch.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.slides as any)}
            className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                <template.icon className="w-4 h-4 text-slate-600 group-hover:text-brand-600" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                {template.category}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">{template.name}</h4>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;

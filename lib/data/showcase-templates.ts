export const SHOWCASE_TEMPLATES = {
    "viral-hook": {
        slides: [
            {
                id: "slide-1",
                type: "intro",
                layout: "big-text",
                content: {
                    title: "Stop Selling.",
                    subtitle: "Start Solving.",
                    body: "Why 99% of LinkedIn pitches fail (and what to do instead).",
                    cta_text: "Swipe to learn"
                },
                   design_overrides: {
                    background_color: "#8b5cf6", // Purple
                    text_color: "#ffffff"
                }
            },
            {
                id: "slide-2",
                type: "content",
                layout: "classic",
                content: {
                    title: "The Problem",
                    body: "People don't buy products. They buy better versions of themselves.\n\n your pitch is about you, you've already lost."
                }
            },
            {
                id: "slide-3",
                type: "content",
                layout: "classic",
                content: {
                    title: "The Fix",
                    body: "Focus on the 'After State'.\n\nDon't sell the plane ticket. Sell the vacation."
                }
            },
             {
                id: "slide-4",
                type: "outro",
                layout: "cta",
                content: {
                    title: "Want more?",
                    subtitle: "Follow for daily tips.",
                    cta_text: "Visit My Profile"
                },
                 design_overrides: {
                    background_color: "#1e293b",
                    text_color: "#ffffff"
                }

            }
        ]
    },
    "checklist-manifesto": {
        slides: [
             {
                id: "slide-1",
                type: "intro",
                layout: "intro",
                 content: {
                    title: "The Ultimate SaaS Launch Checklist",
                    subtitle: "Don't launch without checking these 5 boxes.",
                    cta_text: "Let's go"
                },
                design_overrides: {
                    background_color: "#3b82f6", // Blue
                    text_color: "#ffffff"
                }
            },
            {
                 id: "slide-2",
                type: "content",
                layout: "list",
                content: {
                    title: "Pre-Launch",
                     body: "✅ Validate with 10 users\n✅ Set up analytics\n✅ Draft launch email sequence"
                }
            },
             {
                 id: "slide-3",
                 type: "outro",
                 layout: "cta",
                 content: {
                     title: "Save this Post",
                     subtitle: "You'll need it later.",
                      cta_text: "Repost to help others"
                 }
             }
        ]
    }
};

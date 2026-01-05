-- Seeding: Viral Hooks & Closures (The Starter Pack)
-- Description: Populates the dynamic libraries with high-converting templates.
-- Author: Nexus AI

-- 1. SEED HOOKS (Ganchos)
INSERT INTO public.hooks (category, tags, template_text) VALUES
-- Educate
('Educate', '{productivity, tools}', 'The tool that saved me 10 hours this week:'),
('Educate', '{strategy, breakdown}', 'How I built a $10k/mo side hustle in 30 days (Step-by-step):'),
('Educate', '{mistakes, lessons}', 'Stop making this mistake if you want to grow on LinkedIn:'),
-- Inspire
('Inspire', '{mindset, growth}', 'Your only limit is the story you tell yourself.'),
('Inspire', '{transformation, story}', '3 years ago I was broke. Today I run a 6-figure agency. Here is what changed:'),
-- Engage
('Engage', '{question, debate}', 'Unpopular opinion: Remote work is killing creativity. Do you agree?'),
('Engage', '{question, poll}', 'If you could only use one SaaS tool for the rest of your life, what would it be?'),
-- Contrarian
('Contrarian', '{myth, reality}', 'Motivation is garbage. You need discipline.'),
('Contrarian', '{industry, truth}', 'SEO is dead. Here is why:');

-- 2. SEED CLOSURES (Cierres / CTAs)
INSERT INTO public.closures (category, tags, template_text) VALUES
-- Engagement
('Engagement', '{comment, debate}', 'Agree or disagree? Let me know in the comments 👇'),
('Engagement', '{share, network}', 'Found this useful? Repost to help your network ♻️'),
-- Sales/Lead Gen
('Sales', '{dm, service}', 'Want to achieve similar results? DM me "GROWTH" and let''s chat.'),
('Sales', '{link, bio}', 'Click the link in my bio to join the waitlist 🚀'),
-- Community
('Community', '{follow, value}', 'Follow me for more tips on [Topic] 🔔'),
('Community', '{newsletter, signup}', 'Join 5,000+ creators in my weekly newsletter (Link in comments)');

-- 3. Notify
NOTIFY pgrst, 'reload config';

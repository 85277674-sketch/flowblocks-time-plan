# FlowBlocks Design System

This design system is for a premium AI scheduling app that turns messy tasks into visual time blocks.

## Design Philosophy

The interface should reduce planning friction.

The user should feel:

- I do not need to fight with a calendar.
- I can throw my tasks into the app.
- The app will arrange my day.
- I can adjust the result visually.
- This feels calm, clean, and under control.

Design priority:

1. Clarity
2. Speed
3. Visual calm
4. Tactile interaction
5. Premium feeling

## Core Visual Keywords

- dark premium
- blue-gray
- soft rounded
- floating cards
- capsule tab bar
- tactile blocks
- spacious
- focused
- calm
- polished

## Color Palette

Use these colors strictly.

```css
:root {
  --color-background: #111418;
  --color-background-soft: #161B21;

  --color-surface: #1C2128;
  --color-surface-soft: #252B33;
  --color-surface-raised: #2C333C;

  --color-primary: #47709B;
  --color-primary-soft: #AFC8DA;
  --color-primary-deep: #345777;

  --color-text-primary: #FEFFFF;
  --color-text-secondary: rgba(254, 255, 255, 0.72);
  --color-text-tertiary: rgba(254, 255, 255, 0.48);

  --color-border-soft: rgba(255, 255, 255, 0.08);
  --color-border-medium: rgba(255, 255, 255, 0.14);

  --color-shadow: rgba(0, 0, 0, 0.22);
  --color-shadow-strong: rgba(0, 0, 0, 0.34);
}
```

Background

Use deep blue-black background.

Recommended background:

background:
  radial-gradient(circle at top left, rgba(71, 112, 155, 0.26), transparent 34%),
  radial-gradient(circle at bottom right, rgba(175, 200, 218, 0.12), transparent 36%),
  #111418;

Avoid pure black.

Task Category Colors

Keep task colors restrained within the blue-gray system.

--task-focus: #47709B;
--task-creative: #5E84AD;
--task-study: #6F94B8;
--task-life: #AFC8DA;
--task-rest: #D7E5EE;
--task-fixed: #2C333C;

Usage:

Focus / Important:
background: #47709B;
color: #FEFFFF;

Creative:
background: #5E84AD;
color: #FEFFFF;

Study:
background: #6F94B8;
color: #FEFFFF;

Life:
background: #AFC8DA;
color: #111418;

Rest:
background: #D7E5EE;
color: #111418;

Fixed Event:
background: #2C333C;
color: #FEFFFF;
border: 1px solid rgba(255,255,255,0.12);

Radius System

Use large rounded corners.

--radius-xs: 10px;
--radius-sm: 14px;
--radius-md: 18px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-pill: 999px;

Usage:

small chips: 999px
buttons: 18px
input cards: 28px
main cards: 32px
timeline blocks: 24px
tab bar: 999px

Avoid square corners.
Avoid mixing random radius values.

Shadow System

Use soft premium shadows.

--shadow-card: 0 10px 30px rgba(0, 0, 0, 0.20);
--shadow-card-soft: 0 8px 22px rgba(0, 0, 0, 0.16);
--shadow-floating: 0 18px 44px rgba(0, 0, 0, 0.26);
--shadow-active: 0 20px 48px rgba(0, 0, 0, 0.34);
--shadow-tab: 0 12px 32px rgba(0, 0, 0, 0.24);

Normal card:

box-shadow: 0 10px 30px rgba(0, 0, 0, 0.20);

Floating tab bar:

box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);

Dragging time block:

box-shadow: 0 20px 48px rgba(0, 0, 0, 0.34);
transform: scale(1.02);

Avoid hard shadows.

Spacing System

Use 8pt spacing.

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

Mobile screen padding:
20px to 24px.

Section gap:
24px to 32px.

Card padding:
20px to 24px.

Avoid cramped layouts.

Typography

Use clear hierarchy.

Large page title:

font-size: 30px;
line-height: 36px;
font-weight: 700;
letter-spacing: -0.04em;

Section title:

font-size: 20px;
line-height: 26px;
font-weight: 700;
letter-spacing: -0.02em;

Card title:

font-size: 16px;
line-height: 22px;
font-weight: 650;

Body:

font-size: 14px;
line-height: 20px;
font-weight: 400;

Caption:

font-size: 12px;
line-height: 16px;
font-weight: 500;

Avoid unreadably tiny text.

App Shell

The app should feel mobile-first.

Recommended shell:

min-height: 100vh;
background:
  radial-gradient(circle at top left, rgba(71, 112, 155, 0.26), transparent 34%),
  radial-gradient(circle at bottom right, rgba(175, 200, 218, 0.12), transparent 36%),
  #111418;
color: #FEFFFF;

Main content:

max-width: 430px;
margin: 0 auto;
padding: 20px;
padding-bottom: 100px;
Natural Language Input Card

This is the most important component.

It should feel like an AI command panel, not a normal input.

Default style:

background: rgba(28, 33, 40, 0.88);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 32px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.20);
padding: 24px;

On focus:

border-color: rgba(175, 200, 218, 0.42);
box-shadow:
  0 10px 30px rgba(0, 0, 0, 0.20),
  0 0 0 4px rgba(175, 200, 218, 0.08);

Placeholder example:

今天要做作品集 2 小时、健身 40 分钟、晚上 8 点开会……

Timeline View

The timeline is the signature visual area.

Use vertical timeline.

Left side:

time labels
subtle vertical guide

Right side:

task blocks

Timeline guide:

width: 1px;
background: rgba(255, 255, 255, 0.08);

Time label:

color: rgba(254, 255, 255, 0.48);
font-size: 11px;
Time Block Card

Time blocks should feel like draggable objects.

Default:

border-radius: 24px;
padding: 16px;
box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
border: 1px solid rgba(255, 255, 255, 0.10);

Important block:

background: #47709B;
color: #FEFFFF;

Light block:

background: #AFC8DA;
color: #111418;

Completed block:

opacity: 0.52;
filter: saturate(0.72);

Dragging block:

transform: scale(1.02);
box-shadow: 0 20px 48px rgba(0, 0, 0, 0.34);
z-index: 20;

Each block should include:

icon
task title
time range
duration
status chip or check button

Example:

作品集深化
14:00 - 16:00 · 2h

Floating Capsule Tab Bar

The tab bar must be a floating capsule.

Container:

position: fixed;
left: 50%;
bottom: 20px;
transform: translateX(-50%);
width: calc(100% - 40px);
max-width: 390px;
height: 64px;
background: rgba(254, 255, 255, 0.90);
border-radius: 999px;
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
backdrop-filter: blur(18px);
padding: 6px;

Selected item:

background: #111418;
color: #FEFFFF;
border-radius: 999px;
box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);

Inactive item:

color: rgba(17, 20, 24, 0.58);

Recommended tabs:

Today
Plan
Focus
Review
More

Use clean icons.
Avoid text-heavy tabs.

Buttons

Primary button:

height: 48px;
padding: 0 20px;
border-radius: 18px;
background: #47709B;
color: #FEFFFF;
font-weight: 700;
box-shadow: 0 10px 24px rgba(71, 112, 155, 0.28);

Primary hover:

background: #5E84AD;
transform: translateY(-1px);

Secondary button:

height: 44px;
padding: 0 18px;
border-radius: 16px;
background: rgba(255, 255, 255, 0.08);
color: #FEFFFF;
border: 1px solid rgba(255, 255, 255, 0.08);
Chips

Default chip:

border-radius: 999px;
padding: 8px 12px;
font-size: 12px;
font-weight: 600;
background: rgba(175, 200, 218, 0.16);
color: #FEFFFF;
border: 1px solid rgba(175, 200, 218, 0.20);

Selected chip:

background: #AFC8DA;
color: #111418;

Motion System

Use calm and subtle motion.

Durations:

--motion-fast: 140ms;
--motion-normal: 220ms;
--motion-slow: 320ms;

Recommended easing:

cubic-bezier(0.2, 0.8, 0.2, 1)

Card enter:

opacity 0 -> 1
translateY 12px -> 0
duration 220ms

Button press:

scale 1 -> 0.98
duration 120ms

Dragging card:

scale 1.02
shadow stronger

Tab selected:

selected capsule glides horizontally
duration 220ms

Avoid cartoon bouncy effects.

Today Page Copy

Headline:

今天先把节奏排好

Subtitle:

把要做的事丢进来，我帮你排成一张可执行的时间表。

Input label:

告诉我今天要做什么

Primary button:

自动排程

Empty timeline:

还没有安排。输入几件事，我会帮你生成今日时间表。

Final Visual Checklist

Before finishing, verify:

The app uses the blue-gray palette consistently.
The background is deep but not dead black.
Main cards have large radius and soft shadows.
The input card feels like the core AI entry point.
Timeline blocks feel tactile and draggable.
The floating tab bar clearly references the capsule style.
There is enough spacing between components.
Typography has hierarchy.
The screen does not look like a dashboard.
The screen could be used as a product showcase screenshot.

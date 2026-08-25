# Free Prompt Enhancer

**Turn your rough ideas into crystal-clear instructions for AI.**

![License](https://img.shields.io/badge/license-MIT-green.svg)

🔗 **Live Demo:** [https://prompt.crashai.dev](https://prompt.crashai.dev)

---

## What Is It?

**Free Prompt Enhancer** is a web tool that takes your basic prompt and transforms it into a polished, detailed instruction that AI models (like ChatGPT, Claude, Gemini, etc.) can understand and respond to much better.

Think of it as a translator — but instead of translating languages, it translates a rough thought into a perfectly crafted prompt.

---

## Why Use It?

- **Get Better Results** – Vague prompts = vague answers. Clear prompts = great answers.
- **Save Time** – Don't rewrite your prompt 10 times. Do it right once.
- **Learn Prompt Engineering** – See exactly how a good prompt is built.
- **It's Free & Works Offline** – No account needed. No hidden costs.

---

## Features

- **6 Enhancement Levels** – From quick summaries to deep expert analysis.
- **11 Tones** – Match your message to your audience.
- **3 Output Architectures** – Plain text, Markdown (GPT-style), or XML tags (Claude-style).
- **15 Languages** – Including full support for Arabic (RTL).
- **Live Prompt Analysis** – Real-time suggestions as you type.
- **Prompt History** – Your recent prompts are saved in your browser.
- **Templates** – Start with a pre-written example.
- **Edit & Export** – Tweak the result before copying, or download it as a file.

---

## Requirements

Before you begin, make sure you have the following installed on your computer:

| Tool | Version | Check with |
|------|---------|------------|
| [Node.js](https://nodejs.org/) | v18 or newer | `node -v` |
| npm | v9 or newer (comes with Node) | `npm -v` |

> 💡 **No installation needed?** You can also run the app with Docker (see [Docker](#docker)) or deploy it online (see [Deployment](#deployment)).

---

## Installation & Setup

### 1. Get the project files

Download or clone the repository:

```bash
git clone https://github.com/alshmry1/free-prompt-enhancer.git
cd free-prompt-enhancer
```

### 2. Install dependencies

```bash
npm install
```

This downloads all required packages (React, Tailwind CSS, Radix UI, etc.). It may take a minute or two.

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the app

Open your browser and go to:

```
http://localhost:8080
```

That's it! The app is now running locally. 🎉

---

## How to Use It

### Step 1 — Type Your Prompt

Paste or write down your rough idea in the big text box. As you type, you'll see:
- A **character/token counter**
- The **detected language** of your input
- A live **Analysis panel** with suggestions to improve your prompt

Need inspiration? Click one of the **template chips** (Blog Post, Code Helper, Ad Copy...) to fill the box instantly.

### Step 2 — Choose Your Mode

| Mode | What it does |
|------|--------------|
| ⚡ **Fast Mode** | Instant, local processing. Like a supercharged template. Works completely offline. |
| 🤖 **AI Mode** | Sends your prompt to Google's Gemini AI to be rewritten intelligently. Requires a free API key (see below). |

Then hit **"Start Enhancement"**.

### Step 3 — Customize (Optional)

Expand **Advanced Parameters** to fine-tune the output:

- **Optimization Strategy** – Pick a level:
  - *Simple* – quick clarity boost
  - *Advanced* – structured expert output
  - *Expert* – deep chain-of-thought reasoning
  - *Minimalist* – light touch, low token usage
  - *Balanced* – objectives, analysis, implementation
  - *Surgical* – precision parameters and quality metrics
- **Target Architecture** – Standard (plain text), Markdown, or XML
- **Personality Matrix** – Choose from 11 tones (Professional, Creative, Academic...)
- **Anti-Prompt** – List words or concepts to exclude from the output

### Step 4 — Use Your Enhanced Prompt

Once generated, you can:
- ✏️ **Edit** the result directly before copying
- 📋 **Copy** it to your clipboard
- 💾 **Download** it as `.txt`, `.md`, or `.xml`
- 🔄 **Regenerate** if you want another pass
- 🕘 Restore any previous run from **Recent History**

Paste the enhanced prompt into ChatGPT, Claude, Gemini, or any other AI tool.

---

## Enabling AI Mode (Optional)

AI Mode uses **Google Gemini** and requires a free API key:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and sign in with your Google account.
2. Click **Create API Key** and copy it.
3. In the app, click the **⚙️ Settings** icon (top right).
4. Paste your key and click **Save**.

> 🔒 **Privacy:** Your key is stored **only in your browser's local storage**. It is never sent to any server other than Google's own API endpoint when you run an enhancement.

Without a key, the app still works perfectly in **Fast Mode**.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `localhost:8080` |
| `npm run build` | Build the app for production (outputs to `dist/`) |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## Docker

A `Dockerfile` is included for containerized deployment:

```bash
# Build the image
docker build -t prompt-enhancer .

# Run the container
docker run -p 8080:8080 prompt-enhancer
```

Then open `http://localhost:8080`.

---

## Deployment

The app is a static single-page application and deploys anywhere that serves static files:

- **Vercel** – A `vercel.json` is already configured. Just import the repo and deploy.
- **Netlify / Cloudflare Pages / GitHub Pages** – Run `npm run build` and upload the `dist/` folder.

---

## Tech Stack

- **React 19** + TypeScript
- **Vite** – build tooling
- **Tailwind CSS** + shadcn/ui components
- **Supabase Edge Functions** *(optional server-side AI proxy)*
- **Google Gemini API** *(optional, user-provided key)*

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 is busy | Stop the other process, or change the port in `vite.config.ts` |
| AI Mode says "API key missing" | Add your Gemini key via the ⚙️ Settings modal |
| Arabic text looks misaligned | Make sure your browser supports RTL; the app handles direction automatically |
| History disappeared | History lives in browser storage — clearing site data removes it |

---

## License

This project is licensed under the MIT License.

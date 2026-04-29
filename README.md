# 🧠 Content IQ: Neural Analysis Suite

**Content IQ** is a high-performance, AI-driven content analysis platform designed for creators, professionals, and developers. Built with React 19 and Google's Gemini AI, it provides deep insights into YouTube content, documents, and resumes, alongside powerful neural image generation.

![Neural Suite Preview](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop)

## 🚀 Key Modules

- **📺 YouTube Audit**: Analyze video engagement, clarity, and metadata. Get actionable tips for thumbnails, titles, and descriptions.
- **💼 Resume Match**: Match your professional profile against complex job descriptions using advanced semantic alignment.
- **🎨 Neural Art**: Generate high-fidelity visual concepts directly from the neural command center.
- **🪄 Doc Refiner**: Transform, summarize, and refine technical documents or creative writing into specific tones and formats.
- **📄 General Scanner**: Deep-tissue analysis for any PDF or text-based document.

## 🛠️ Performance Tech Stack

- **Frontend**: [React 18+](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Intelligence**: [Google Gemini AI](https://ai.google.dev/) (`@google/genai`)
- **Cloud Infrastructure**: [Puter.js](https://puter.com/) (Distributed storage & Auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphic Industrial Aesthetic)
- **Motion**: [Motion](https://motion.dev/) (Fluid layout transitions)

## 🌐 Cloud Synchronization

Content IQ uses the **Puter KV Protocol** to ensure your data stays with you.
- **Decentralized Storage**: Your "Neural Archive" is stored securely on the Puter network.
- **Instant Syncing**: Results are instantly pushed to the cloud and available across any device after login.
- **Privacy First**: Analysis happens via secure neural links, and history is owned entirely by the user.

## 🚦 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd content-iq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Suite**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
├── components/          # GUI Modules (Analyzer, ResultView, etc.)
├── services/            # Neural Links (Gemini, Puter Storage)
├── types.ts             # Strict Type Definitions
├── constants.tsx        # UI & System Constants
├── App.tsx              # Main Application Controller
└── index.html           # Entry Point & Global Styles
```

## 🏗️ Architecture Note

The application implements a **clean service-based architecture**. UI components interact with abstracted services (`aiService.ts`, `puterStorageService.ts`), allowing for easy swapping of AI models or storage backends without disrupting the workspace environment.

---

*Built with ❤️ for the next generation of content creators.*

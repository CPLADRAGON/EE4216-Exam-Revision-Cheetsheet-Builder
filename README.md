# EE4216 Hardware for IoT - Exam Prep & Cheat Sheet

A comprehensive study companion web application designed to help students prepare for the **EE4216 Hardware for IoT** final exam. This tool includes an AI-powered exam simulator, a customizable cheat sheet generator, and deep-dive concept guides.

🔗 **Live Demo:** [View on GitHub Pages](https://cpladragon.github.io/EE4216-Exam-Revision-Cheetsheet-Builder/) 

---

## 🚀 Features

### 1. 📝 Customizable Cheat Sheet
- **A4 Landscape Layout**: Optimized for printing a single double-sided exam helper sheet.
- **Fully Editable**: Add, delete, rearrange, and modify code snippets and explanations directly in the browser.
- **Dynamic Pagination**: Automatically flows content into 3-column pages (4 sections per page).
- **PDF Export**: Built-in print styles for perfect "Save as PDF" output.

### 2. 🧠 AI Exam Simulator
- **Generative Questions**: Uses Google Gemini AI to create unique exam-style questions.
- **Exam Formats**:
  - **Spot the Error**: Identify syntax or logic bugs in C++/Arduino code.
  - **Fill in the Blanks**: Recall specific API function names and parameters.
  - **Concept Explanation**: Test your understanding of protocols like MQTT, HTTP, and FreeRTOS.

### 3. 📚 Key Concepts Guide
- **Deep Dive**: Detailed explanations of critical topics (FreeRTOS Tasks, Queues, Mutexes, MQTT vs HTTP, Sleep Modes).
- **Code Examples**: Production-ready snippets for common sensors (DHT, Ultrasonic, Soil Moisture) and RGB LEDs (NeoPixel).
- **Searchable**: Quickly filter topics to find exactly what you need.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API (`gemini-2.5-flash` model)
- **Deployment**: GitHub Pages (via GitHub Actions)

---

## 💻 Local Development Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/ee4216-exam-prep.git
    cd ee4216-exam-prep
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_actual_api_key_here
    ```
    *(Note: You can get a free API key from [Google AI Studio](https://aistudio.google.com/).)*

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🌍 Deployment (Free on GitHub Pages)

This project is configured for zero-cost deployment using GitHub Actions.

1.  **Push code to GitHub**: Ensure your code is in a public GitHub repository.
2.  **Add API Key Secret**:
    - Go to your Repo **Settings** > **Secrets and variables** > **Actions**.
    - Add a **New repository secret** named `API_KEY`.
    - Paste your Google Gemini API Key.
3.  **Watch it Build**:
    - Go to the **Actions** tab.
    - You will see the "Deploy to GitHub Pages" workflow running.
    - Once green, click the workflow run to find your live URL.

---

## 📖 Usage Guide

### Creating Your Cheat Sheet
1.  Go to **Cheat Sheet Generator**.
2.  Click **"Edit Layout"** to enter edit mode.
3.  **Add/Remove Sections**: Use the "New Section" button or the trash icon on existing sections.
4.  **Rearrange**: Use the Up/Down arrows on section headers to change their order.
5.  **Edit Text**: Click directly on any title, code block, or explanation to type your own notes.
6.  **Save**: Click "Save" to persist your changes to your browser's local storage.
7.  **Print**: Click "Print / Save PDF". In the print dialog, choose **"Save as PDF"**, Layout: **Landscape**, Margins: **None** (or Default).

### Practicing for the Exam
1.  Go to **Exam Simulator**.
2.  Click **"Generate Practice Set"**.
3.  The AI will generate 3 hard questions based on the course syllabus.
4.  Try to solve them, then click **"Reveal Answer"** to check your work and read the explanation.

---

## 📄 License

This project is open-source and available under the MIT License.
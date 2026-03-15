# 🍎 AppleAI — Vision-Based Crop Intelligence System

> AI-powered disease detection, severity estimation & fruit counting — exclusively for Apple crops.

**Live Demo**: [https://Astha167.github.io/apple-crop-intelligence](https://Astha167.github.io/apple-crop-intelligence)

---

## 📋 Problem Statement

Designed for **Group 10 / Team A** — Vision-Based Crop Intelligence System.

This prototype implements all three use cases from the problem statement, scoped exclusively to **Apple (Malus domestica)** crops — leaves and fruits.

---

## 🔬 Use Cases

### Use Case A1 — Disease Detection (Classification)
Upload a photo of an **apple leaf**. The system classifies it into one of 5 known disease categories:

| Class | Disease |
|-------|---------|
| 1 | Apple Scab (*Venturia inaequalis*) |
| 2 | Apple Black Rot (*Botryosphaeria obtusa*) |
| 3 | Cedar Apple Rust (*Gymnosporangium juniperi-virginianae*) |
| 4 | Alternaria Leaf Blotch (*Alternaria mali*) |
| 5 | Healthy |

**Approach**: MobileNetV2 / EfficientNet backbone fine-tuned on the Apple subset of the PlantVillage dataset.

---

### Use Case A2 — Disease Severity Estimation
After disease detection, the system estimates how severely the leaf is infected.

```
Severity (%) = Diseased Pixels ÷ Total Leaf Pixels × 100
```

- **0–25%** → Low severity, preventive treatment
- **25–55%** → Moderate severity, treatment within 48 hours
- **>55%** → High severity, immediate action required

**Approach**: U-Net segmentation model separating diseased vs. healthy tissue.

---

### Use Case A3 — Apple Fruit Detection & Counting
Upload an image of an apple tree or orchard section. The system detects and counts individual apples with bounding boxes.

**Approach**: YOLOv8 trained on apple orchard images. Handles:
- Overlapping fruits
- Partially visible apples
- Varied lighting conditions

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/apple-crop-intelligence.git
cd apple-crop-intelligence

# No build step needed — it's pure HTML/CSS/JS
# Open index.html in any browser, or use a local server:
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080`

---

## 🌐 Deploying to GitHub Pages

### Option 1: GitHub UI
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch → `/ (root)` folder
4. Click **Save** — your site will be live at `https://YOUR-USERNAME.github.io/apple-crop-intelligence`

### Option 2: GitHub Actions (auto-deploy on push)
The included `.github/workflows/deploy.yml` automatically deploys on every push to `main`.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Visualization | Canvas API |
| AI (Production) | MobileNetV2, U-Net, YOLOv8 |
| Deployment | GitHub Pages |

> **Note**: This is a UI prototype. The AI inference is simulated for demonstration purposes. In production, replace the simulation functions in `app.js` with real model inference calls (via TensorFlow.js, ONNX Runtime Web, or a backend API).

---

## 📁 Project Structure

```
apple-crop-intelligence/
├── index.html          # Main app shell + all three tabs
├── style.css           # Full design system (dark theme, organic aesthetic)
├── app.js              # Navigation, file handling, AI simulation logic
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml  # Auto GitHub Pages deployment
```

---

## 🔮 Production Roadmap

- [ ] Integrate TensorFlow.js with real PlantVillage apple model
- [ ] Replace severity simulation with U-Net WASM inference
- [ ] Add YOLOv8 ONNX export for in-browser fruit detection
- [ ] Add image preprocessing (resize, normalize, augment)
- [ ] Add offline PWA support for field use on mobile

---

## 👥 Team

Group 10 — Vision-Based Crop Intelligence System  
Theme: Image-driven crop monitoring for precision agriculture

---

*For educational and prototype purposes only.*

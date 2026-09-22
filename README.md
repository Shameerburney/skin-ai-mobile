# 🌿 SkinAI Diagnostics — Mobile App (Expo / React Native)

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![FastAPI Backend](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![HuggingFace](https://img.shields.io/badge/Hugging%20Face-Vision%20Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)

**SkinAI Diagnostics** is an advanced mobile dermatology and skincare diagnostic application built with **React Native** and **Expo**. It delivers laboratory-grade facial skin analysis using an integrated pipeline of deep learning neural networks and computer vision algorithms. 

Designed for both iOS and Android via the Expo ecosystem, the app features real-time camera alignment guides, multi-spectral skin scoring, blemish localization, and algorithmic AM/PM routine formulation tailored to the user's specific skin metrics.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Diagnostic Capabilities & Metrics](#-diagnostic-capabilities--metrics)
- [Machine Learning & CV Pipeline](#-machine-learning--cv-pipeline)
- [Mobile UX & Key Screens](#-mobile-ux--key-screens)
- [Project Directory Structure](#-project-directory-structure)
- [API Contract & Specifications](#-api-contract--specifications)
- [Quick Start Guide](#-quick-start-guide)
- [Network & Diagnostics Configuration](#-network--diagnostics-configuration)
- [Privacy & Biometric Data Handling](#-privacy--biometric-data-handling)

---

## 🔬 Architectural Overview

The SkinAI ecosystem follows a decoupled edge-and-cloud architecture:

```
┌────────────────────────────────────────────────────────┐
│               SkinAI Mobile Client (Expo)               │
│                                                        │
│  [Live Camera Scanner]  ──>  [Base64 Encoding & Payload]│
│            ▲                               │           │
│            │ (Analysis Results)            │           │
│  [Diagnostics Dashboard]                   ▼           │
└────────────────────┬───────────────────────┬───────────┘
                     │ (JSON REST Payload)   │
                     ▼                       ▼
┌────────────────────────────────────────────────────────┐
│               Python AI Diagnostic Engine              │
│                                                        │
│  ┌────────────────────────┐  ┌───────────────────────┐ │
│  │ Vision Transformers    │  │ MediaPipe FaceMesh    │ │
│  │ • Skin Type (ViT)      │  │ • 468 3D Landmarks    │ │
│  │ • Acne & Blemish (ViT) │  │ • Regional Masking    │ │
│  │ • Facial Characteristics│  │ • Reflection Filters  │ │
│  └───────────┬────────────┘  └───────────┬───────────┘ │
│              │                           │             │
│              └─────────────┬─────────────┘             │
│                            ▼                           │
│              [Color Space & Laplacian Calibration]     │
│                            │                           │
│                            ▼                           │
│        [AM/PM Personalized Skincare Engine]            │
└────────────────────────────────────────────────────────┘
```

1. **Client Layer (This Repository)**: React Native mobile client running on Expo SDK 57, handling hardware camera feeds, orientation-aware facial guidelines, optimistic UI rendering, and report visualization.
2. **Inference Layer (FastAPI)**: High-throughput Python server leveraging PyTorch, Hugging Face Transformers, and OpenCV to process high-resolution facial imagery.

---

## 📊 Diagnostic Capabilities & Metrics

SkinAI does not rely on subjective questionnaires. Instead, it extracts quantifiable physical attributes across 6 major categories:

| Parameter | Detection Methodology | Output Metric |
| :--- | :--- | :--- |
| **Primary Skin Type** | Vision Transformer (`dima806/skin_types_image_detection`) | Categorical: Oily, Dry, Normal, Combination (%) |
| **Acne Severity** | Fine-tuned ViT (`imfarzanansari/skintelligent-acne`) | Grade 0–4 (None, Mild, Moderate, Severe, Cystic) |
| **Pore Visibility** | Resolution-Adaptive Laplacian Kernel & Contour Density | Quantitative Score (0–100) |
| **Erythema / Redness** | Lab Color Space $\Delta E$ on Cheek/Nose ROIs | Inflammation Index (0–100) |
| **Hydration / Oiliness**| HSV Specular Reflection Ratios (excluding glasses/teeth) | Balanced, Dehydrated, or Hyper-Sebaceous |
| **Texture & Fine Lines** | Multi-directional Gabor Filters & Edge Energy Gradient | Smoothness / Roughness Index (0–100) |
| **Under-Eye Circles** | CIELAB Luminance ($L^*$) Differential on Infraorbital Zones | Pigmentation Severity (0–100) |

---

## 🧠 Machine Learning & CV Pipeline

### 1. Illumination Normalization & White Balancing
Ambient lighting variances often corrupt mobile phone photos. SkinAI executes **Gray-World Assumption** color constancy followed by **CLAHE** (Contrast Limited Adaptive Histogram Equalization) on the luminance channel. This eliminates warm indoor bulbs or cool outdoor tints before neural inference.

### 2. Biometric Facial Zoning via MediaPipe FaceMesh
Using 468 3D facial landmarks, the engine automatically isolates discrete anatomical zones:
- **T-Zone**: Forehead and nasal bridge (highest concentration of sebaceous glands).
- **U-Zone**: Cheeks and jawline (primary site for hormonal acne and moisture depletion).
- **Periorbital & Infraorbital Zone**: Under-eye regions evaluated for micro-vascular dark circles.
- **Occlusion Masking**: Reflections from spectacles, hair bangs, and open lips are dynamically segmented and excluded to prevent false positives.

### 3. Neural Classification
The normalized regions are passed through three pre-trained deep learning vision transformers to predict primary skin classifications, acne subtypes, and morphological facial age indicators.

### 4. Algorithmic Routine Synthesis
Based on the synthesized diagnostic fingerprint, the app outputs a custom regimen:
- **Morning (AM) Routine**: Cleansing, antioxidant hydration, barrier support, and photo-protection (SPF).
- **Evening (PM) Routine**: Double cleanse, cellular turnover actives (AHAs/BHAs/Retinoids), and lipid replenishment.
- **Active Ingredient Recommendations**: Specific percentage guidelines for Niacinamide, Hyaluronic Acid, Salicylic Acid, Ceramides, Azelaic Acid, and Centella Asiatica.

---

## 📱 Mobile UX & Key Screens

- **`HomeScreen.js`**: Welcome screen highlighting core features, real-time backend latency badge, one-tap camera scan, and photo gallery selection.
- **`CameraScreen.js`**: High-performance camera interface leveraging `expo-camera` (`CameraView`) with face oval guidelines, front/back camera toggle, and torch control.
- **`PreviewScreen.js`**: Immediate visual confirmation allowing the user to inspect clarity or retake before submitting heavy inferences.
- **`LoadingScreen.js`**: Animated multi-phase neural processing states (Biometric Mesh Alignment $\rightarrow$ Multi-spectral Colorimetric Analysis $\rightarrow$ Deep Learning Inference).
- **`ResultsScreen.js`**: Medical-style diagnostic report containing:
  - Overall Skin Health Score circular progress gauge.
  - Skin type probability distribution bars.
  - Interactive parameter cards with contextual advice.
  - Tabbed AM / PM step-by-step skincare routines.
  - Target ingredients to embrace or avoid.
- **`ServerConfigModal.js`**: Built-in network diagnostics modal enabling dynamic IP configuration, ping test, and latency verification.

---

## 📁 Project Directory Structure

```
mobile/
├── assets/                  # Icons, splash images, adaptive backgrounds
│   ├── android-icon-foreground.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/          # Modular, reusable UI components
│   │   ├── Header.js        # Brand header with backend status indicator
│   │   ├── ServerConfigModal.js # Live IP config & network ping diagnostic tool
│   │   └── Stepper.js       # 4-stage visual flow progress bar
│   ├── screens/             # Flow-based user interfaces
│   │   ├── CameraScreen.js  # Live hardware camera scanner with biometric guide
│   │   ├── HomeScreen.js    # Welcome, feature highlights, and scan triggers
│   │   ├── LoadingScreen.js # Animated neural network diagnostic sequence
│   │   ├── PreviewScreen.js # Image review and quality confirmation
│   │   └── ResultsScreen.js # Full analytical skin diagnostic report
│   ├── services/
│   │   └── api.js           # Network layer: health polling and Base64 upload
│   └── theme/
│       └── colors.js        # Curated dark-mode aesthetic color tokens
├── App.js                   # Application entry point & state-machine coordinator
├── app.json                 # Expo project configuration & permission descriptors
├── package.json             # NPM package declarations & scripts
└── push_to_github.bat       # One-click deployment utility
```

---

## 🔌 API Contract & Specifications

The mobile app interfaces with the backend over REST.

### 1. Health & Model Readiness Endpoint
```http
GET /api/health
```
**Response (200 OK):**
```json
{
  "status": "online",
  "models_ready": true,
  "version": "3.0 - MediaPipe + WhiteBalance + ResAdaptive",
  "models": {
    "skin_type": "dima806/skin_types_image_detection",
    "acne": "imfarzanansari/skintelligent-acne",
    "characteristics": "varun1505/face-characteristics",
    "cv_engine": "MediaPipe FaceMesh + WhiteBalance + CLAHE + ResAdaptive Laplacian"
  }
}
```

### 2. Facial Skin Analysis Endpoint
```http
POST /api/analyze
Content-Type: application/json
```
**Payload:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
```

**Response (200 OK):**
```json
{
  "overall_score": 82,
  "primary_skin_type": "Combination",
  "type_confidences": {
    "Combination": 64.2,
    "Oily": 22.8,
    "Normal": 10.1,
    "Dry": 2.9
  },
  "metrics": {
    "hydration": 68,
    "oiliness": 42,
    "pores": 28,
    "redness": 18,
    "texture": 24,
    "dark_circles": 35
  },
  "concerns": ["Mild T-Zone Oiliness", "Periorbital Pigmentation"],
  "routines": {
    "am": [
      { "step": 1, "title": "Gentle Gel Cleanser", "desc": "Removes overnight sebum without stripping moisture barrier." },
      { "step": 2, "title": "Niacinamide 5% Serum", "desc": "Regulates sebum production and visibly refines pore appearance." },
      { "step": 3, "title": "Lightweight Gel-Cream", "desc": "Hydrates with hyaluronic acid while maintaining a matte finish." },
      { "step": 4, "title": "Broad Spectrum SPF 50", "desc": "Prevents UV-induced hyperpigmentation and premature collagen degradation." }
    ],
    "pm": [
      { "step": 1, "title": "Double Cleanse (Micellar Water / Oil)", "desc": "Dissolves SPF and airborne environmental pollutants." },
      { "step": 2, "title": "Low-pH Gentle Foam Cleanser", "desc": "Purifies skin surface while keeping mantle balanced." },
      { "step": 3, "title": "BHA 1% Salicylic Solution (2x/week)", "desc": "Gently penetrates pore linings to decongest sebum plugs." },
      { "step": 4, "title": "Ceramide Barrier Restorative Cream", "desc": "Reinforces stratum corneum lipids during sleep cycle." }
    ]
  },
  "recommended_ingredients": ["Niacinamide", "Hyaluronic Acid", "Salicylic Acid", "Ceramides"],
  "ingredients_to_avoid": ["Denatured Alcohol", "Heavy Comedogenic Oils", "Synthetic Fragrances"]
}
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js (LTS version)](https://nodejs.org) installed on your development machine.
- [Expo Go](https://expo.dev/go) installed on your physical mobile device (available on App Store and Google Play).
- The Python AI backend running locally or hosted on a reachable server.

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shameerburney/skin-ai-mobile.git
   cd skin-ai-mobile
   ```

2. **Install JavaScript dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro Bundler**:
   - **For direct local Wi-Fi connection**:
     ```bash
     npx expo start
     ```
   - **For Cloudflare/Ngrok Tunnel (bypasses local firewalls and router AP isolation)**:
     ```bash
     npx expo start --tunnel
     ```

4. **Launch on your device**:
   - **iOS**: Open the native Camera app and point it at the terminal QR code, then tap the prompt to open in Expo Go.
   - **Android**: Open the **Expo Go** app, tap **Scan QR code**, and scan the terminal QR code.

---

## 🌐 Network & Diagnostics Configuration

By default, the app targets the host machine on standard local IP:
```javascript
let currentServerUrl = 'http://192.168.18.8:8000';
```

If your network changes or you are hosting the backend on a remote domain:
1. Tap the **⚙️ Server Settings** icon located in the top-right header of the app.
2. Enter your new backend URL (e.g., `https://skin-api.yourdomain.com` or `http://192.168.x.x:8000`).
3. Tap **Test Connection** — the app will perform an automated HTTP ping and display real-time latency (in milliseconds) and model initialization state.
4. Tap **Save & Close**.

---

## 🔒 Privacy & Biometric Data Handling

- **Zero Third-Party Image Upload**: Images captured in the app are transmitted strictly to your configured backend endpoint via encrypted Base64 payloads.
- **Transient Processing**: The image is evaluated entirely in-memory by OpenCV and PyTorch. No facial frames or biometric meshes are persistently stored on disk or sold to third parties.
- **Hardware Sandboxing**: Camera and photo library permissions are managed explicitly through iOS and Android operating system permission dialogs and can be revoked at any time.

---

## 📄 License & Attribution Notice

Copyright (c) 2026 **Shameer Burney**. All Rights Reserved.

Use, reproduction, distribution, or adaptation of this software is **strictly prohibited without prominent and unaltered attribution to Shameer Burney**. Any unauthorized use without crediting Shameer Burney constitutes willful copyright infringement and will result in immediate DMCA takedown demands and legal consequences. See the [LICENSE](LICENSE) file for complete terms.

# 🕵️‍♂️ Imposter (الامبوستر)

> A sleek, mobile-first pass-and-play party game built with React, TypeScript, and Tailwind CSS.
> **Find the liar among your friends!**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)

## 📖 About The Game

**Imposter** is a local multiplayer game inspired by *Spyfall*. It is designed to be played on a single device passed around a group of friends.

* **The Goal:** Everyone receives a secret word except for one person (The Imposter).
* **The Twist:** The Imposter must blend in and pretend they know the word, while Civilians try to identify who the liar is without giving away the secret word.

This project is **Client-Side Only**. It requires no backend server, no database, and works perfectly offline once loaded.

## ✨ Features

* **📱 Mobile-First Design:** Optimized for all screen sizes with a responsive, app-like experience.
* **🔄 Pass-and-Play:** No need for multiple phones to connect. One device handles everything.
* **🃏 3D Card Animations:** Smooth, CSS-based 3D card flips with solid opacity handling (no ghosting).
* **🇪🇬 Arabic Localization:** Fully localized interface with a pre-loaded list of hilarious Egyptian slang words.
* **⚙️ Custom Game Setup:**
    * Input any number of players (3 to 50).
    * Type your own custom secret word or use the random generator.
* **🎨 Commercial UI:** Dark mode aesthetic, glassmorphism effects, and neon accents using Tailwind CSS.

## 🛠️ Tech Stack

* **Framework:** [React](https://react.dev/) (Vite)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (CDN / Utility classes)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animation:** Native CSS Transitions & 3D Transforms

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/imposter-game.git](https://github.com/your-username/imposter-game.git)
    cd imposter-game
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    *(Note: You will need `lucide-react`)*

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the link shown in your terminal).

## 🎮 How to Play

1.  **Setup:** Enter the number of players and hit "Start".
2.  **Pass the Phone:** Hand the device to Player 1.
3.  **Reveal:** Player 1 taps the card to see if they are a **Civilian (Green)** or the **Imposter (Red)**.
4.  **Hide:** Player 1 taps "Hide & Pass" and hands the phone to the next player.
5.  **Discuss:** Once everyone has seen their role, the game begins! Ask questions, accuse your friends, and find the Imposter.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests if you want to add:
* New word categories.
* Timer functionality.
* Multiple Imposter modes.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
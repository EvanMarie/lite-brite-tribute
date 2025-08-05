# Tribute to Lite-Brite 🌈✨

A nostalgic digital recreation of the beloved 1980s toy that let us create glowing artwork with colorful pegs and a light box. This project brings back those childhood memories with a modern, responsive web interface that works beautifully on both desktop and mobile devices.

## 🎨 What is Lite-Brite?

For those who might not remember, Lite-Brite was an iconic toy that consisted of a light box with a black pegboard surface. Children would push translucent colored pegs through black paper templates to create illuminated pictures. The magic happened when you turned on the light—your creation would glow with vibrant colors, making even simple designs look spectacular.

This digital version captures that same sense of wonder and creativity, allowing you to place virtual pegs on a dynamic grid that automatically adjusts to your screen size.

## ✨ Features

**Responsive Design**: The pegboard automatically calculates how many pegs can fit on your screen, whether you're on a phone, tablet, or desktop computer. The grid dynamically adjusts to give you the optimal creative canvas.

**Authentic Color Palette**: Eight carefully chosen colors that evoke the classic Lite-Brite experience—from bright white and hot pink to deep sky blue and medium purple. Each peg glows with a subtle drop shadow effect that mimics the original toy's illuminated appearance.

**Touch-Friendly Interface**: Designed with mobile users in mind, featuring larger touch targets on smaller screens and responsive controls that work seamlessly with both mouse clicks and finger taps.

**Instant Creation**: Click or tap any position to place a peg of your selected color. Click the same spot again to remove the peg, making it easy to experiment and refine your designs.

**Clear and Start Over**: A prominent "Clear Board" button lets you wipe the slate clean and begin a new masterpiece whenever inspiration strikes.

## 🛠️ Technical Implementation

This project exists in two versions, both implementing the same core functionality with different technical approaches:

**React Version (TypeScript)**: The original implementation built as a modern React component with full TypeScript support. This version demonstrates clean component architecture, proper state management, and responsive design patterns using Tailwind CSS. The code is thoroughly documented and follows React best practices for maintainability and performance.

**HTML Version**: A standalone HTML file that runs directly in any web browser without requiring a build process or framework dependencies. This version is perfect for GitHub Pages deployment and demonstrates how complex interactive applications can be built using vanilla JavaScript while maintaining the same user experience as the React version.

Both versions share the same mathematical approach to grid calculation, ensuring that the pegboard utilizes screen space efficiently while maintaining proper aspect ratios and touch targets across different device sizes.

## 🎯 Why This Project Exists

As an 80s kid, I have fond memories of spending hours with my Lite-Brite, carefully following the included templates or creating my own abstract designs. The satisfaction of seeing your creation come to life when you flipped that switch was pure magic.

This digital tribute aims to recapture that joy while showcasing modern web development techniques. It demonstrates how childhood nostalgia can inspire technical projects that are both meaningful and educational. The responsive design challenges, the mathematical grid calculations, and the smooth user interactions all came together to create something that feels both familiar and fresh.

## 🚀 Getting Started

### HTML Version (Recommended for Quick Start)
1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start creating! No build process required.

### React Version
1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open your browser to `http://localhost:3000`

## 🌐 Live Demo

You can try the HTML version live on GitHub Pages: [https://evanmarie.github.io/lite-brite-tribute/](https://evanmarie.github.io/lite-brite-tribute/)]

## 📱 Device Compatibility

This application works on virtually any device with a modern web browser. The responsive design automatically adapts to different screen sizes, from smartphones to large desktop monitors. The touch interface is optimized for mobile devices, while mouse users get hover effects and precise clicking on desktop computers.

## 🎨 Creating Your Art

Select a color from the palette at the top of the screen, then click or tap anywhere on the pegboard to place a peg. Each peg glows with its own colored light, just like the original toy. Experiment with patterns, try to recreate classic designs, or let your creativity run wild with abstract compositions.

The beauty of this digital version is that you have unlimited pegs and no risk of losing pieces under the couch! You can create, clear, and recreate as many times as you want.

## 🔧 Technical Deep Dive

The core challenge in recreating Lite-Brite digitally was making the pegboard responsive while maintaining the authentic grid-based interaction model. The solution involves real-time calculation of optimal peg sizes and spacing based on the available screen real estate.

The application uses SVG for crisp rendering at any scale, with radial gradients that give each peg a subtle three-dimensional appearance. The color selection system includes visual feedback to clearly indicate the active color, and the touch handling is carefully optimized to prevent common mobile web issues like accidental zooming or scrolling.

Both versions implement the same mathematical model for grid calculation, ensuring consistent behavior across different platforms and deployment scenarios.

## 🤝 Contributing

Feel free to fork this project and add your own enhancements! Some ideas for future features might include saving and loading designs, sharing creations with others, or adding animation effects. The codebase is well-documented and designed to be easily extensible.

## 📝 License

This project is open source and available under the MIT License. Feel free to use it as inspiration for your own nostalgic recreations or as a learning resource for responsive web design techniques.

---

*Made with ❤️ and childhood memories by Evan Marie Carr*

*Find more projects at: https://github.com/EvanMarie*

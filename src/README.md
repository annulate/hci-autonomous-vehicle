# Context-Aware Transition UI - Autonomous Vehicle Handover Prototype

A UX research experiment prototype for testing autonomous vehicle control handover scenarios. This application simulates a Tesla-style dashboard with realistic traffic scenarios to measure user trust and reaction times.

## 📋 Project Overview

This prototype tests two experimental conditions:
- **Group A**: Context-aware alerts with detailed information about hazards
- **Group B**: Generic alerts without contextual details

### Features
- ✅ Realistic 3-lane traffic simulation
- ✅ Multiple hazard scenarios (construction, weather, accidents, sensor failures)
- ✅ Three urgency levels (low, medium, high)
- ✅ Voice feedback with urgency-adapted speech patterns
- ✅ Immersive steering wheel control interface with LED indicators
- ✅ Reaction time tracking for research data
- ✅ Photorealistic animations with 3D depth and atmospheric effects

---

## 🚀 Quick Start Guide

### Prerequisites

Before running this application, you need to install **Node.js** on your computer.

#### Install Node.js
1. Visit https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the prompts
4. Verify installation by opening your terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers for both commands.

---

## 💻 Installation & Setup

### Step 1: Download the Project
- Extract the downloaded ZIP file to a folder on your computer
- Remember the location of this folder

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, and press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, and press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 3: Navigate to Project Folder
In the terminal, navigate to your project folder:
```bash
cd path/to/your/project/folder
```

**Example (Windows):**
```bash
cd C:\Users\YourName\Downloads\autonomous-vehicle-ui
```

**Example (Mac/Linux):**
```bash
cd ~/Downloads/autonomous-vehicle-ui
```

### Step 4: Install Dependencies
Run this command to install all required packages:
```bash
npm install
```

⏱️ This may take 2-5 minutes. Wait for it to complete.

---

## 🎮 Running the Application

### Start Development Server
Once installation is complete, run:
```bash
npm run dev
```

### Open in Browser
1. The terminal will display a message like:
   ```
   ➜  Local:   http://localhost:5173/
   ```
2. **Hold `Ctrl` (or `Cmd` on Mac) and click the URL**, OR
3. Open your web browser and navigate to: `http://localhost:5173`

🎉 **The application should now be running!**

### Stopping the Server
To stop the development server:
- Press `Ctrl + C` in the terminal
- Type `Y` if prompted to confirm

---

## 📖 How to Use the Application

### Main Menu
1. When the app loads, you'll see two buttons:
   - **Group A - Context-Aware Alerts**: Shows detailed contextual information
   - **Group B - Generic Alerts**: Shows basic warnings only

### Running a Test Session
1. Click either Group A or Group B to start
2. Click **"Start Scenario"** to begin the first hazard scenario
3. Watch the traffic simulation and dashboard alerts
4. When prompted, click **"Take Control"** on the steering wheel interface
5. After each scenario, click **"Resume Autopilot"** to continue
6. Complete all 4 scenarios to see results

### Scenarios Included
1. **Construction Zone** - Navigate through roadwork area
2. **Heavy Weather** - Handle sensor degradation in rain
3. **Accident Ahead** - Respond to traffic collision
4. **Sensor Failure** - Immediate system failure handover

### Features During Scenarios
- 🚗 **Real-time traffic simulation** with 3 lanes
- 📊 **Speed display**: 105 km/h constant speed
- 🔊 **Voice feedback**: Audio alerts with varying urgency
- 🎯 **Distance tracking**: Shows km to hazard
- ⏱️ **Reaction time measurement**: Tracks your response speed
- 💡 **LED indicators**: Steering wheel pulse animations

### Results Page
After completing all scenarios, you'll see:
- Reaction times for each scenario
- Average reaction time
- Summary statistics for research analysis

---

## 🛠️ Troubleshooting

### Problem: "npm: command not found"
**Solution**: Node.js is not installed. Follow the Prerequisites section above.

### Problem: Port already in use
**Solution**: The dev server will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the correct URL.

### Problem: Blank white page
**Solution**: 
1. Check the browser console (press `F12`) for error messages
2. Make sure you're accessing the URL from the terminal (e.g., `localhost:5173`)
3. Don't open `index.html` directly - use `npm run dev` instead

### Problem: Installation errors during `npm install`
**Solution**: 
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### Problem: Changes not appearing
**Solution**: 
1. The dev server has hot-reload, so changes should appear automatically
2. If not, try refreshing the browser (`Ctrl + R` or `Cmd + R`)
3. Or restart the dev server (`Ctrl + C`, then `npm run dev` again)

---

## 📁 Project Structure

```
autonomous-vehicle-ui/
├── src/
│   ├── App.tsx                 # Main application entry
│   ├── components/
│   │   ├── GroupAPrototype.tsx # Context-aware version
│   │   ├── GroupBPrototype.tsx # Generic alerts version
│   │   ├── TrafficScene.tsx    # 3-lane traffic simulation
│   │   ├── SteeringWheelControl.tsx # Steering wheel UI
│   │   ├── VoiceFeedback.tsx   # Audio alerts
│   │   └── ResultsPage.tsx     # Results display
│   └── styles/
│       └── globals.css         # Global styles
├── index.html                  # HTML template
├── package.json                # Project dependencies
└── README.md                   # This file
```

---

## 🔧 Advanced Commands

### Build for Production
Create optimized static files:
```bash
npm run build
```
Output will be in the `dist/` folder.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

---

## 📊 Research Data

### Measured Metrics
- **Reaction Time**: Time from alert to user taking control
- **Scenario Type**: Construction, Weather, Accident, Sensor Failure
- **Group Assignment**: A (Context-Aware) vs B (Generic)

### Exporting Results
Currently, results are displayed on-screen. To export data:
1. Take screenshots of the results page
2. Or note down the reaction times manually
3. (Future enhancement: CSV export functionality)

---

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer not supported

**Recommendation**: Use the latest version of Chrome or Edge for best performance.

---

## 📝 Notes for Researchers

### Experiment Setup
1. Ensure consistent testing environment (quiet room, good lighting)
2. Brief participants on the task before starting
3. Assign participants randomly to Group A or Group B
4. Do not explain the difference between groups before testing
5. Record reaction times from the results page
6. Note any technical issues or participant comments

### Data Collection Tips
- Have participants complete a pre-test questionnaire
- Observe but don't interrupt during scenarios
- Conduct post-test interviews about trust and experience
- Compare reaction times between Group A and Group B

---

## ⚠️ Important Notes

- **This is a prototype for research purposes only**
- Not intended for real autonomous vehicle systems
- All scenarios and data are simulated
- Requires active internet connection for some dependencies

---

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console (`F12`) for error messages
2. Ensure Node.js version is 16.x or higher
3. Try deleting `node_modules` folder and running `npm install` again
4. Make sure all files were extracted from the ZIP properly

---

## 📄 License & Credits

This prototype was created for UX research experiments on autonomous vehicle handover scenarios.

**Technologies Used:**
- React 18
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Vite
- shadcn/ui components
- Lucide icons

---

## 🎯 Version Information

- **Version**: 1.0.0
- **Last Updated**: November 2024
- **Units**: Metric (km/h, km)

---

**Happy Testing! 🚗💨**

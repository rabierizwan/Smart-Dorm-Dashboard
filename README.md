# Smart-Dorm-Dashboard

A comprehensive dashboard for monitoring and managing smart dormitory systems, integrating various IoT devices and sensors to enhance the living experience of residents.

## Features

- Real-time monitoring of environmental conditions (temperature, humidity, air quality)
- Integration with smart devices (lights, thermostats, security cameras)
- User-friendly interface for easy control and management
- Alerts and notifications for unusual activities or conditions

## Quick Tour

1. **Dashboard Overview (`/`)** – Scan the main cards to check live wattage, device status, and sustainability impact. Use the task list on the right to track recommended actions and mark progress.
2. **Energy Insights (`/insights`)** – Open the Insights page from the top navigation to explore detailed bill projections, savings calculators, and personalized tips. Adjust the daily goal input to see how progress and recommendations change in real time.
3. **Room View (`/room`)** – Switch to the Room View to toggle individual devices on or off and watch their wattage update immediately across the dashboard. This is helpful for quick experimentation with different appliance combinations.
4. **Sustainability Context** – Review the “Why This Matters” card to understand how your actions map to Sustainable Development Goals and how much CO₂ you’re avoiding.
5. **Share & Iterate** – Deploy on Vercel (or your preferred host) to share the live dashboard with other testers. Encourage them to tweak device states and goals so you can capture feedback on usability and clarity.

Most pages automatically persist device states using `localStorage`, so you can safely refresh without losing your current setup while testing. To reset everything, clear browser storage for the site or run in a private window.

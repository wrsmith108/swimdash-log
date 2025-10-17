# SwimDash

A lightweight swimming session logger and progress tracker for weekly swimmers. Log your swims in under 10 seconds and visualize your progress with charts and calendar heatmaps.

## Features

- ⚡ Quick session logging (distance, time, notes)
- 📊 Weekly progress charts
- 🗓️ Calendar heatmap visualization
- 💾 Local storage (no backend required)
- 📱 Responsive design
- 🔒 Privacy-focused (data stays on your device)

## Tech Stack

- **Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite 7.1
- **UI Components:** shadcn-ui + Radix UI
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

## Local Development

### Prerequisites
- Node.js 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd swimdash-log

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Build the project:
```bash
npm run build
```

Deploy the `dist/` directory to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Docker Deployment

```bash
# Build the app
npm run build

# Build Docker image
docker build -t swimdash .

# Run container
docker run -p 80:80 swimdash
```

## Project Structure

```
swimdash-log/
├── src/
│   ├── components/       # React components
│   │   ├── QuickLogForm.tsx
│   │   ├── RecentSessions.tsx
│   │   ├── WeeklyChart.tsx
│   │   ├── CalendarHeatmap.tsx
│   │   └── ui/          # shadcn-ui components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React Context providers
│   ├── types/           # TypeScript types
│   └── lib/             # Utility functions
├── public/              # Static assets
└── dist/                # Production build (generated)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

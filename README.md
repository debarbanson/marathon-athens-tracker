# My Journey to Marathon, Greece

A web application to track my running progress for training for the Athens Marathon. The site visualizes my virtual journey from Roelofarendsveen, Netherlands to Marathon, Greece.

## Features

- Interactive map visualization of the running route
- Real-time progress tracker showing distance completed
- Statistics panel with running metrics (total distance, pace, etc.)
- Upcoming runs schedule
- Motivational section with rotating quotes

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marathon-athens.git
   cd marathon-athens
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

- Add your actual running data in `src/data/runs.json`
- Customize quotes in `src/components/MotivationalSection.tsx`
- Update the map image in `public/images/`

## Deployment

This application can be easily deployed using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/marathon-athens) 
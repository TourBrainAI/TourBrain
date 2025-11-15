# TourBrain.AI

TourBrain is an AI-powered ops engine for concerts and live tours.

## Features

- 🗺️ **Smart routing and tour planning** – Optimize tour routes and schedules
- 🎫 **Ticketing intelligence and forecasts** – Predict sales and pricing trends
- 👕 **Merchandise intelligence and forecasts** – Predict sales and pricing trends
- 📊 **Unified workspace** – Manage tours, shows, and venues in one place

## Project Structure

```
TourBrain/
├── apps/
│   └── web/          # Next.js frontend application
├── prisma/
│   └── schema.prisma # Database schema (PostgreSQL)
├── .devcontainer/    # GitHub Codespaces configuration
└── docker-compose.dev.yml # Local dev services (Postgres + Redis)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- Or use GitHub Codespaces (recommended)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TourBrainAI/TourBrain.git
   cd TourBrain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development services** (Postgres + Redis)
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize the database**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### Using GitHub Codespaces

Simply open this repository in GitHub Codespaces. The devcontainer will automatically:
- Install all dependencies
- Start PostgreSQL and Redis
- Set up the database
- Launch the development server

## Available Scripts

- `npm run dev` – Start the Next.js development server
- `npm run build` – Build the application for production
- `npm run start` – Start the production server
- `npm run db:push` – Push Prisma schema to database
- `npm run db:studio` – Open Prisma Studio (database GUI)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Deployment**: Vercel (frontend), Supabase/Neon (database)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

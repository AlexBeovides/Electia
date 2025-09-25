# Electia

Electia is a digital system for managing university elective courses, built with a .NET 8 REST API and a React 18 + Vite SPA. Designed for the University of Havana’s context, it supports administrators, professors, and students across the full lifecycle—from course proposals to enrollment, academic monitoring, and official documentation. See docs/ for the full report; this README stays focused on setup.

## Tech stack at a glance
- **Backend:** ASP.NET Core, Entity Framework Core, Identity + JWT auth, FluentValidation
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, AG Grid
- **Data & tooling:** SQL Server, Docker Compose, npm, pnpm-compatible scripts

## What you can do
- Maintain faculties, majors, courses, and elective instances with role-based access control
- Handle student applications, approval rules, rosters, and grade publishing in one place
- Export and inspect enrollment metrics with ready-made dashboards and Excel downloads

## Quick start
### Option A: Docker (API + SPA + DB)
```bash
docker compose up --build
```
- Web client: http://localhost:3000
- Swagger UI: http://localhost:5000/swagger 

### Option B: Run services locally
1. **Backend**
   ```bash
   cd ElectiaCore
   dotnet restore
   dotnet ef database update --project ElectiaCore.Infrastructure
   dotnet run --project ElectiaCore.Web
   ```
   Adjust the `DefaultConnection` string in `ElectiaCore.Web/appsettings.json` or via environment variables to point at your SQL Server instance.
2. **Frontend**
   ```bash
   cd ElectiaApp
   npm install
   npm run dev
   ```
   Override the API URL by exporting `VITE_API_BASE_URL` if the backend is not on `http://localhost:5097/api`.

## Repository layout
```
Electia/
├── ElectiaCore/          # Domain, application, infrastructure, API, and tests
├── ElectiaApp/           # React SPA
├── docker-compose.yml    # Full stack definition
├── deploy-electia.*      # Helper scripts for remote deployments
└── docs/                 # Project report and presentation
```

## Quality checks
```bash
# .NET tests
cd ElectiaCore
dotnet test ElectiaCore.Tests
```

For architecture decisions, database diagrams, and role walkthroughs, read the project materials under `docs/`.
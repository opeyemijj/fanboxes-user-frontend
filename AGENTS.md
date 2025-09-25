# AGENTS.md - Fanboxes Frontend v3

## Commands
- **Build**: `npm run build` or `next build`
- **Dev**: `npm run dev` or `next dev`
- **Lint**: `npm run lint` or `next lint`
- **Start**: `npm run start` or `next start`
- **Type Check**: No explicit command, uses TypeScript strict mode

## Architecture
- **Framework**: Next.js 14 with App Router (`app/` directory)
- **State Management**: Redux Toolkit with persist (`redux/` slices)
- **Styling**: Tailwind CSS with shadcn/ui components, Material-UI integration
- **API**: Custom HTTP service (`services/http.js`) with axios, token-based auth
- **Components**: Organized in `components/` with `_main/`, `ui/`, feature-based folders

## Code Style
- **File Extensions**: `.jsx`, `.js`, `.tsx`, `.ts` - mix of JS and TypeScript
- **Imports**: Use `@/` path alias for root imports
- **Naming**: camelCase for variables/functions, PascalCase for components
- **State**: Redux slices with createSlice pattern, async thunks for API calls  
- **Styling**: Tailwind classes, CSS variables for theming (HSL color system)
- **API**: Token authentication via cookies and Redux state
- **Error Handling**: Try/catch blocks, Redux error states, toast notifications
- **Comments**: Minimal comments, some files have large commented code blocks

## Notes
- No test files found - consider adding Jest/Testing Library setup
- Built with v0.app, auto-synced to Vercel deployment

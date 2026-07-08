# Xllent Retailers React Frontend

Deployable React.js e-commerce frontend for Xllent Retailers FMCG products.

## Stack

- React.js with Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios service layer

## Project Structure

- `src/pages` - separate page files for Home, Products, Product Details, Cart, Checkout, and Not Found
- `src/models` - typed product, order, API models, and product catalog data
- `src/components` - reusable commerce and UI components
- `src/layouts` - shared application shell and navigation
- `src/store` - Redux Toolkit store and slices
- `src/services` - Axios client and API helpers
- `src/hooks` - typed React/Redux hooks
- `src/utils` - small shared utilities

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
```

The deployable static output is created in `dist/`.

## Deployment

This project is ready for GitHub and Vercel deployment.

- Build command: `npm run build`
- Publish directory: `dist`
- Optional API variable: `VITE_API_URL=https://your-api-domain.com/api`

Copy `.env.example` to `.env` only if you connect a backend API locally.

### Push to GitHub

```bash
git init
git add .
git commit -m "Prepare Xllent Retailers frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Deploy on Vercel

1. Import the GitHub repository in Vercel.
2. Keep the framework preset as Vite.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy, then share the live URL on WhatsApp.

The app uses normal production routes such as `/home`, `/products`, and `/admin`.
The included `vercel.json` rewrites all routes to `index.html`, so direct links work after deployment.

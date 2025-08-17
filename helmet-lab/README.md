# Helmet Lab

A Next.js + TypeScript web app to design realistic vector-style football helmets. Users can pick a username, customize shell and facemask colors, add stripes, upload decals, add text, export as PNG, and email the final image to alex.morin9@gmail.com.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Email sending

Set `RESEND_API_KEY` in your environment to enable emailing via the `/api/send-helmet` route. Without a key, the route returns success and skips sending.

## Deploy on Vercel

- Set project env var `RESEND_API_KEY`
- `vercel --prod`

## Notes

- Rendering uses inline SVG with paths tuned to a realistic side-view helmet.
- Decals and text are draggable. Use the Export button to save a PNG.

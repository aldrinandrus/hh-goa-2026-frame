# HH Goa 2026 Frame & Builder ID Generator

Production-ready web tool for the **HH Goa 2026** shortlisting task: upload a photo → generate an official **Profile Frame** or **Builder ID** → download PNG → share to X with `#FrameInGoa`.

Design system extracted from [hhgoa.com](https://hhgoa.com) (Imbue + Victor Mono, cream `#fffbe8`, yellow `#fee101`, green `#0b6839`, red `#e40014`).

## Stack

- Next.js 15 · React · TypeScript · Tailwind CSS 4
- Framer Motion · shadcn-style UI · Lucide
- react-easy-crop · html-to-image · sharp · heic2any
- Vercel-compatible (`@vercel/blob` optional)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Flow

1. Landing → **Create Mine**
2. Upload JPG / PNG / WEBP / HEIC (≤ 20 MB)
3. Auto face-aware crop (FaceDetector) or smart center crop
4. Switch **Profile Frame** ↔ **Builder ID**
5. Download 2048px+ PNG · Share to X (public card + OG)

## Public cards & OG

Each save creates `/app/card/HHG26-XXXXXX` with dynamic metadata and Open Graph image.

Set for production:

```env
NEXT_PUBLIC_APP_URL=https://your-deployment.vercel.app
BLOB_READ_WRITE_TOKEN=   # optional — enables Vercel Blob persistence
```

Without Blob, cards persist on local disk under `data/cards/` (fine for demos / Node hosting).

## Scripts

| Command       | Description        |
|---------------|--------------------|
| `npm run dev` | Turbopack dev server |
| `npm run build` | Production build |
| `npm start`   | Start production server |

## Project layout

```
app/           # routes, APIs, OG
components/    # UI, landing, create, templates
lib/           # design tokens, crop, IDs
server/        # sharp + card storage
utils/         # HEIC, download, share
public/brand/  # assets from hhgoa.com
```

## License

Built for HH Goa 2026 shortlisting · brand © HH-Goa.

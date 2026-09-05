# Arshad ID Studio

Create cleaner passport and ID photos without wrestling with image editors.

Arshad ID Studio is a focused web app for turning an ordinary portrait into a correctly sized ID photo. It helps with the small details that often take too much time: choosing the right country standard, preparing a white background, keeping the correct aspect ratio, and downloading a print-ready image.

The project is built with the hope that it makes an annoying task feel simple. Feedback, improvements, and new country standards are welcome.

## What It Does

- Upload a JPG, PNG, or WEBP image by click or drag and drop
- Validate file type and a 10 MB upload limit
- Remove the original background in the browser
- Place the person on a clean white background
- Upscale small source images before processing
- Prepare exact passport and ID photo proportions
- Support Japan and Malaysia photo requirements
- Show physical and pixel dimensions before download
- Download a correctly sized JPG
- Keep uploaded photos local to the browser during processing

## Supported Standards

### Japan

- Passport: 35 × 45 mm, 413 × 531 px
- Residence card: 35 × 45 mm, 413 × 531 px
- My Number card: 35 × 45 mm, 413 × 531 px

### Malaysia

- Passport: 35 × 50 mm, 413 × 591 px
- Visa photo: 35 × 50 mm, 413 × 591 px

The country and size definitions are centralized in `src/app/page.tsx`, making it straightforward to add another country or document type.

## How To Use

1. Upload a clear, front-facing portrait with the face and shoulders visible.
2. Choose the country or region.
3. Choose the document or photo type.
4. Select **Continue** to remove the background and prepare the image.
5. Review the white-background preview.
6. Select **Download photo**.

For the best result, use a well-lit image with the person facing the camera. The app can enlarge small images, but it cannot recover detail that was never captured by the original camera.

## Getting Started

### Requirements

- Node.js 20 or newer
- npm 10 or newer

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The first background-removal run may take longer because the browser downloads the processing model. Later runs are faster once the model is cached.

## Available Commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Start the production server
```

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- TypeScript
- Tailwind CSS v4
- [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) for browser-based background removal
- Canvas APIs for exact-size JPG generation

## Privacy

Photos are selected and processed in the browser. This project does not include a server-side photo storage system or an API-key-based upload service. Uploaded images are not intentionally saved to a database.

As with any browser application, users should still avoid uploading images to devices or browser sessions they do not trust. The background-removal model is downloaded from its configured public model source on first use.

## Project Structure

```text
src/
└── app/
	├── globals.css    # Visual system and responsive layout
	├── layout.tsx     # Application metadata and root layout
	└── page.tsx       # Photo workflow, country standards, and download logic
```

## Roadmap

The current version is a strong browser-first foundation. Useful next improvements include:

- Face detection and automatic head positioning
- Manual crop, zoom, rotate, brightness, and contrast controls
- Printable A4, Letter, and 4×6 sheets
- PDF export and direct printing
- More country and document standards
- A dedicated configuration module for photo requirements
- Automated browser tests for upload, processing, and download
- Optional FastAPI processing for teams that need server-side workflows

## Contributing

Suggestions and pull requests are welcome. When adding a new country or photo type:

1. Add the requirement to the centralized standards list.
2. Include both physical dimensions and target pixel dimensions.
3. Test the upload, preparation, preview, and download flow.
4. Update this README with the new standard.

Please do not commit personal photos, `.env` files, API keys, build output, or dependency folders. The repository `.gitignore` already excludes common local and generated files.

## License

A license has not been selected yet. Add a `LICENSE` file before accepting external contributions or distributing the project under specific reuse terms.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

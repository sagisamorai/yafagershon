import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const inputPath = path.join(root, "public", "yafa-profile.png");

async function generateFavicon() {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const size = Math.min(metadata.width || 512, metadata.height || 512);

  const circleRadius = size / 2;
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${circleRadius}" cy="${circleRadius}" r="${circleRadius}" fill="white"/>
    </svg>`
  );

  const cropped = await sharp(inputPath)
    .resize(size, size, { fit: "cover", position: "center" })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // favicon.ico (32x32)
  await sharp(cropped)
    .resize(32, 32)
    .png()
    .toFile(path.join(root, "app", "favicon.ico"));

  // apple-touch-icon (180x180)
  await sharp(cropped)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, "app", "apple-icon.png"));

  // og icon (192x192)
  await sharp(cropped)
    .resize(192, 192)
    .png()
    .toFile(path.join(root, "app", "icon.png"));

  console.log("Favicon files generated successfully!");
}

generateFavicon().catch(console.error);

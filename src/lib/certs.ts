import { getImage } from 'astro:assets';
import { isoCerts } from '../data/site';
import type { Cert } from '../components/react/CertGallery';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/iso/*.jpg', { eager: true });

export async function loadCerts(): Promise<Cert[]> {
  return Promise.all(
    isoCerts.map(async (c) => {
      const src = files[`../assets/iso/${c.file}.jpg`].default;
      const [thumb, full] = await Promise.all([
        getImage({ src, width: 640, format: 'webp', quality: 80 }),
        getImage({ src, width: 1400, format: 'webp', quality: 85 }),
      ]);
      return { code: c.code, year: c.year, area: c.area, title: c.title, thumb: thumb.src, full: full.src };
    }),
  );
}

import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/place/Toko+Toples+Laksana/@-6.9219723,107.5995147,823m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e68e623958f611b:0xb6da297f1c6b25f!8m2!3d-6.9219723!4d107.6020896!16s%2Fg%2F11cjj829nv?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D";

const CONTACT_EMAILS = [
  "Laksanacibdak51@gmail.com",
  "onlinelaksanacibadak@gmail.com",
];

export default function Footer() {
  return (
    <footer id="footer" className="relative mt-0 w-full overflow-hidden border-t border-border bg-white text-sm leading-relaxed">
      <div className="relative z-10 mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-6 py-6 md:grid-cols-12 lg:px-12 lg:py-12">
        <div className="pr-0 md:col-span-12 lg:col-span-6 lg:pr-12">
          <Link href="/" className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-primary-500">
            Toples Laksana
          </Link>
          <p className="mb-8 max-w-md text-base text-text-secondary">
            Distributor kemasan premium terpercaya di Bandung. Memberikan solusi kemasan berkualitas tinggi dan terjangkau untuk masa depan bisnis UMKM & Industri Nasional.
          </p>
        </div>

        <div className="md:col-span-5 lg:col-span-2">
          <h5 className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.15em] text-text-primary">Eksplor</h5>
          <ul className="space-y-4 font-semibold text-text-secondary">
            <li><Link className="transition-colors hover:text-primary-500" href="/catalog">Katalog Produk</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="/compare">Bandingkan</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="/tentang">Mengapa Kami?</Link></li>
          </ul>
        </div>

        <div className="md:col-span-7 lg:col-span-4">
          <h5 className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.15em] text-text-primary">Hubungi Kami</h5>
          <div className="space-y-4 text-text-secondary">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 transition-colors hover:text-primary-500"
            >
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary-500" />
              <span className="font-medium">Jl. Raya Kopo No.125, Situsaeur, Kec. Bojongloa Kidul, Kota Bandung, Jawa Barat 40232</span>
            </a>
            <a
              href="tel:+6282240923336"
              className="flex items-center gap-3 transition-colors hover:text-primary-500"
            >
              <PhoneIcon className="size-5 shrink-0 text-primary-500" />
              <span className="font-mono text-base font-medium">+62 822-4092-3336</span>
            </a>
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-5 shrink-0 text-primary-500" />
              <div className="flex min-w-0 flex-col gap-1.5">
                {CONTACT_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="break-all font-medium transition-colors hover:text-primary-500"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 lg:px-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center border-t border-border py-8 text-center">
          <p className="text-xs font-bold text-text-muted sm:text-sm">
            &copy; {new Date().getFullYear()} Toples Laksana Bandung.
          </p>
        </div>
      </div>
    </footer>
  );
}

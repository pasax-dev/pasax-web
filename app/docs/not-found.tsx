import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function DocsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 p-12 min-h-[50vh]">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-lp-line bg-lp-paper-2 text-lp-ink">
        <BookOpen className="size-6 text-lp-orange dark:text-lp-yellow" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-lp-ink">
        Halaman Dokumentasi Tidak Ditemukan
      </h1>
      <p className="max-w-md text-sm text-lp-ink/70">
        Panduan atau dokumen yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg bg-lp-ink text-lp-paper px-4 py-2 text-xs font-mono font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Katalog Dokumen</span>
        </Link>
      </div>
    </div>
  )
}

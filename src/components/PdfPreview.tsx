import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Spinner } from "@/components/ui/spinner";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPreviewProps {
  src: string;
  title: string;
  className?: string;
}

/**
 * Renders every page of a PDF onto <canvas> elements via pdf.js instead of
 * embedding it with <iframe>. Mobile browsers frequently refuse to render an
 * iframe'd PDF inline and show a native "Open" plugin prompt instead —
 * canvas rendering has no plugin involved, so it always auto-displays.
 */
export default function PdfPreview({ src, title, className }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    setStatus("loading");
    container.innerHTML = "";

    const loadingTask = pdfjsLib.getDocument(src);

    loadingTask.promise
      .then(async (pdf) => {
        const width = container.clientWidth || 600;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = width / unscaledViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.className = "w-full h-auto block";
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          if (pageNum > 1) canvas.style.marginTop = "8px";
          const context = canvas.getContext("2d");
          if (!context || cancelled) return;

          container.appendChild(canvas);
          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }

        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [src]);

  return (
    <div className={`relative overflow-y-auto bg-gray-50 ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Spinner /> Loading preview…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm text-gray-400">
          <p>This preview couldn't load.</p>
          <a href={src} download className="font-medium underline" style={{ color: "#1F3A5F" }}>
            Download {title} instead
          </a>
        </div>
      )}
      <div ref={containerRef} aria-label={`Preview of ${title}`} />
    </div>
  );
}

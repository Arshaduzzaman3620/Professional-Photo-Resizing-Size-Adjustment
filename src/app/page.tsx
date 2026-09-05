"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

type PhotoSize = {
  id: string;
  label: string;
  dimensions: string;
  detail: string;
  pixels: string;
};

const countries = [
  {
    id: "japan",
    name: "Japan",
    flag: "JP",
    color: "coral",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "International travel document",
      },
      {
        id: "residence",
        label: "Residence card",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Zairyu card application",
      },
      {
        id: "my-number",
        label: "My Number card",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Personal identification",
      },
    ],
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "MY",
    color: "gold",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 50 mm",
        pixels: "413 × 591 px",
        detail: "Malaysian passport",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 50 mm",
        pixels: "413 × 591 px",
        detail: "Visa and official forms",
      },
    ],
  },
  {
    id: "south-korea",
    name: "South Korea",
    flag: "KR",
    color: "blue",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Republic of Korea passport",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Visa and official forms",
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    flag: "AU",
    color: "navy",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Australian passport",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Visa and official forms",
      },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    flag: "CA",
    color: "red",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "50 × 70 mm",
        pixels: "591 × 827 px",
        detail: "Canadian passport",
      },
      {
        id: "permanent-resident",
        label: "Permanent resident card",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Canadian PR card application",
      },
    ],
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    flag: "BD",
    color: "green",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Bangladeshi passport",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Visa and official forms",
      },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    flag: "DE",
    color: "black",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Biometrischer Reisepass",
      },
      {
        id: "id-card",
        label: "ID card",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Personalausweis application",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Visa and official forms",
      },
    ],
  },
  {
    id: "ireland",
    name: "Ireland",
    flag: "IE",
    color: "orange",
    sizes: [
      {
        id: "passport",
        label: "Passport",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Irish passport",
      },
      {
        id: "visa",
        label: "Visa photo",
        dimensions: "35 × 45 mm",
        pixels: "413 × 531 px",
        detail: "Visa and official forms",
      },
    ],
  },
];

const workflow = ["Upload", "Prepare", "Choose size", "Download"];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("japan");
  const [selectedSize, setSelectedSize] = useState("passport");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeKind, setNoticeKind] = useState<"error" | "success" | "info">(
    "info",
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const country =
    countries.find((item) => item.id === selectedCountry) ?? countries[0];
  const size =
    country.sizes.find((item) => item.id === selectedSize) ?? country.sizes[0];
  const activeStep = isPrepared ? 4 : imageUrl ? 2 : 1;

  const fileDetails = useMemo(() => {
    if (!fileName) return "JPG, PNG or WEBP · Up to 10 MB";
    return `${fileName} · Ready to prepare`;
  }, [fileName]);

  function acceptFile(file?: File) {
    if (!file) return;
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!supportedTypes.includes(file.type)) {
      setNotice("Please choose a JPG, PNG, or WEBP image.");
      setNoticeKind("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice(
        "That file is larger than 10 MB. Please choose a smaller image.",
      );
      setNoticeKind("error");
      return;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setNotice(null);
    setFileName(file.name);
    setSourceFile(file);
    setImageUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
    setIsPrepared(false);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  function resetUpload() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setFileName(null);
    setSourceFile(null);
    setImageUrl(null);
    setProcessedUrl(null);
    setIsPrepared(false);
    setNotice(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function chooseCountry(countryId: string) {
    setSelectedCountry(countryId);
    setSelectedSize("passport");
  }

  async function loadSourceImage(file: File) {
    const sourceUrl = URL.createObjectURL(file);
    const source = new window.Image();
    source.src = sourceUrl;
    await new Promise<void>((resolve, reject) => {
      source.onload = () => resolve();
      source.onerror = () => reject(new Error("Unable to read image"));
    });
    URL.revokeObjectURL(sourceUrl);

    const shortestSide = Math.min(source.naturalWidth, source.naturalHeight);
    if (shortestSide >= 900) return file;

    const scale = Math.max(2, 900 / shortestSide);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(source.naturalWidth * scale);
    canvas.height = Math.round(source.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const enlargedBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!enlargedBlob) return file;
    return new File([enlargedBlob], "upscaled-source.png", {
      type: "image/png",
    });
  }

  async function preparePhoto() {
    if (!sourceFile || isPreparing) return;
    setIsPreparing(true);
    setNotice("Removing the background and preparing your photo...");
    setNoticeKind("info");
    try {
      const processingFile = await loadSourceImage(sourceFile);
      const transparentBlob = await removeBackground(processingFile);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      setProcessedUrl(URL.createObjectURL(transparentBlob));
      setIsPreparing(false);
      setIsPrepared(true);
      setNotice("Background removed. Your white-background photo is ready.");
      setNoticeKind("success");
    } catch {
      setIsPreparing(false);
      setNotice(
        "We could not remove the background. Please try a clear, front-facing photo.",
      );
      setNoticeKind("error");
    }
  }

  async function downloadPhoto() {
    if (!imageUrl) return;
    try {
      const source = new window.Image();
      const load = new Promise<void>((resolve, reject) => {
        source.onload = () => resolve();
        source.onerror = () => reject(new Error("Unable to read image"));
      });
      source.src = processedUrl ?? imageUrl;
      await load;
      const [widthPx, heightPx] = size.pixels
        .split(" × ")
        .map((value) => Number(value.replace(" px", "")));
      const canvas = document.createElement("canvas");
      canvas.width = widthPx;
      canvas.height = heightPx;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not supported");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.max(
        canvas.width / source.width,
        canvas.height / source.height,
      );
      const drawWidth = source.width * scale;
      const drawHeight = source.height * scale;
      context.drawImage(
        source,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      const photoBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95),
      );
      if (!photoBlob) throw new Error("Unable to create download");
      const downloadUrl = URL.createObjectURL(photoBlob);
      const link = document.createElement("a");
      link.download = `arshad-${selectedCountry}-${selectedSize}-${widthPx}x${heightPx}px.jpg`;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setNotice(`Downloaded ${widthPx} × ${heightPx} px JPG.`);
      setNoticeKind("success");
    } catch {
      setNotice("We could not prepare your download. Please try again.");
      setNoticeKind("error");
    }
  }

  function primaryAction() {
    if (isPrepared) {
      void downloadPhoto();
      return;
    }
    void preparePhoto();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Arshad ID Studio home">
          <span className="brand-mark">A</span>
          <span>
            <strong>Arshad</strong>
            <small>ID studio</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="active" href="#create">
            Create photo
          </a>
          <a href="#sizes">Photo sizes</a>
          <a href="#help">Help</a>
        </nav>
        <button className="avatar-button" aria-label="Open settings">
          AS
        </button>
      </header>

      <main id="top" className="workspace">
        <div className="intro-row">
          <div>
            <p className="eyebrow">
              <span className="live-dot" /> Studio workspace
            </p>
            <h1>
              Make a photo
              <br />
              <em>that fits.</em>
            </h1>
            <p className="intro-copy">
              Passport and ID photos, prepared with care.
              <br className="desktop-only" /> Upload once and we&apos;ll handle
              the details.
            </p>
          </div>
          <div className="session-note">
            <span>01</span>
            <p>
              New creation
              <br />
              <small>Private by design</small>
            </p>
          </div>
        </div>

        <section className="workflow-bar" aria-label="Photo workflow">
          {workflow.map((step, index) => (
            <div
              className={`workflow-step ${index + 1 <= activeStep ? "complete" : ""}`}
              key={step}
            >
              <span className="step-number">
                {index + 1 < activeStep ? "✓" : `0${index + 1}`}
              </span>
              <span>{step}</span>
              {index < workflow.length - 1 && <span className="step-line" />}
            </div>
          ))}
        </section>

        <section id="create" className="creation-grid">
          <div className="upload-panel panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">01 / Your photo</span>
                <h2>Start with a clear portrait</h2>
              </div>
              <span className="status-pill">
                {isPreparing ? "Preparing..." : "Local processing"}
              </span>
            </div>
            <div
              className={`drop-zone ${imageUrl ? "has-image" : ""} ${isDragging ? "is-dragging" : ""}`}
              onClick={() => fileInput.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(event) =>
                event.key === "Enter" && fileInput.current?.click()
              }
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded portrait preview" />
              ) : (
                <>
                  <div className="upload-orbit">
                    <span>↑</span>
                  </div>
                  <p className="drop-title">Drop your portrait here</p>
                  <p className="drop-subtitle">
                    or <span>browse from your device</span>
                  </p>
                </>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                hidden
              />
            </div>
            {notice && (
              <p
                className={`notice ${noticeKind === "success" ? "success-notice" : ""}`}
                role="status"
              >
                {notice}
              </p>
            )}
            <div className="file-row">
              <div className="file-icon">{imageUrl ? "✓" : "＋"}</div>
              <div>
                <strong>
                  {imageUrl ? "Portrait uploaded" : "No photo selected"}
                </strong>
                <span>{fileDetails}</span>
              </div>
              {imageUrl && (
                <button onClick={resetUpload} className="text-button">
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="settings-panel panel" id="sizes">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">02 / Requirements</span>
                <h2>Choose your format</h2>
              </div>
              <span className="settings-glyph">⌘</span>
            </div>
            <div className="field-group">
              <label>Country or region</label>
              <div className="country-grid">
                {countries.map((item) => (
                  <button
                    key={item.id}
                    className={`country-chip ${selectedCountry === item.id ? "selected" : ""}`}
                    onClick={() => chooseCountry(item.id)}
                  >
                    <span className={`flag flag-${item.id}`}>{item.flag}</span>
                    <span>{item.name}</span>
                    <span className="radio-dot" />
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label>Photo type</label>
              <div className="size-select-wrap">
                <select
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                  aria-label="Photo type"
                >
                  {country.sizes.map((item: PhotoSize) => (
                    <option key={item.id} value={item.id}>
                      {item.label} · {item.dimensions}
                    </option>
                  ))}
                </select>
                <span>⌄</span>
              </div>
            </div>
            <div className="requirement-preview">
              <div>
                <span className="mini-label">Selected standard</span>
                <strong>
                  {country.name} · {size.label}
                </strong>
                <small className="pixel-note">
                  {size.pixels} at print quality
                </small>
              </div>
              <div className="requirement-dimension">
                {size.dimensions}
                <small>print size</small>
              </div>
            </div>
          </div>

          <div className="preview-panel panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">03 / Preview</span>
                <h2>Your finished photo</h2>
              </div>
              <button className="more-button" aria-label="More preview options">
                •••
              </button>
            </div>
            <div className="photo-preview">
              <div
                className={`preview-frame ${isPreparing ? "is-preparing" : ""}`}
              >
                {imageUrl ? (
                  <img
                    src={processedUrl ?? imageUrl}
                    alt="Final photo preview"
                  />
                ) : (
                  <div className="placeholder-person">
                    <div className="placeholder-head" />
                    <div className="placeholder-body" />
                  </div>
                )}
                <span className="guide guide-top" />
                <span className="guide guide-bottom" />
                {isPreparing && (
                  <span className="processing-label">
                    Preparing your photo<span>...</span>
                  </span>
                )}
              </div>
              <div className="preview-caption">
                <span>
                  {isPrepared
                    ? "Prepared photo"
                    : imageUrl
                      ? "Ready to prepare"
                      : "Preview appears here"}
                </span>
                <span className="preview-dots">● ● ●</span>
              </div>
            </div>
            <div className="preview-footer">
              <div>
                <span className="mini-label">Output</span>
                <strong>{size.dimensions} · White background</strong>
              </div>
              <button
                className="primary-button"
                disabled={!imageUrl || isPreparing}
                onClick={primaryAction}
              >
                {isPreparing
                  ? "Preparing..."
                  : isPrepared
                    ? "Download photo"
                    : "Continue"}{" "}
                <span>{isPrepared ? "↓" : "→"}</span>
              </button>
            </div>
          </div>
        </section>

        <footer className="privacy-footer">
          <span className="lock-icon">⌁</span>
          <span>
            Your photos stay yours. Files are processed securely and never
            stored permanently.
          </span>
          <span className="footer-rule" />
          <span>Built for better first impressions.</span>
        </footer>
      </main>
    </div>
  );
}

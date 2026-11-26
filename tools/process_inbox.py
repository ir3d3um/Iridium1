"""Reads every photo in inbox/ (with an optional same-named .txt file), makes a
display copy, a small gallery copy and a full copy, adds it to artworks.json, and
removes the originals from inbox/. Runs automatically on GitHub Actions."""
import json, os, re, glob, shutil
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INBOX = os.path.join(ROOT, "inbox")
IMG = os.path.join(ROOT, "images")
DATA = os.path.join(ROOT, "artworks.json")
EXT = (".jpg", ".jpeg", ".png", ".webp", ".heic")
KEYS = {"title": "title", "size": "size", "dimensions": "size", "dimension": "size",
        "medium": "medium", "price": "price", "status": "status",
        "description": "description", "caption": "description"}

def read_info(path):
    info = {}
    if not os.path.exists(path):
        return info
    last = None
    for line in open(path, encoding="utf-8", errors="ignore").read().splitlines():
        m = re.match(r"\s*([A-Za-z]+)\s*:\s*(.*)$", line)
        if m and m.group(1).lower() in KEYS:
            last = KEYS[m.group(1).lower()]
            info[last] = m.group(2).strip()
        elif last == "description" and line.strip():
            info[last] += " " + line.strip()
    if info.get("status", "").lower() not in ("sold", "available", ""):
        info["status"] = "available"
    info["status"] = (info.get("status") or "available").lower()
    return info

def save(im, name, longest, q):
    k = min(1, longest / max(im.size))
    out = im if k == 1 else im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    out.save(os.path.join(IMG, name), "JPEG", quality=q, optimize=True, progressive=True)
    return out.size

def main():
    os.makedirs(IMG, exist_ok=True)
    items = json.load(open(DATA, encoding="utf-8")) if os.path.exists(DATA) else []
    added = 0
    for p in sorted(glob.glob(os.path.join(INBOX, "*"))):
        base, ext = os.path.splitext(p)
        if ext.lower() not in EXT:
            continue
        stem = re.sub(r"[^a-z0-9]+", "-", os.path.basename(base).lower()).strip("-") or "art"
        info = read_info(base + ".txt")
        try:
            im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        except Exception as e:
            print("Skipping", p, e)
            continue
        n = 1
        while os.path.exists(os.path.join(IMG, f"{stem}-{n}.jpg")) or os.path.exists(os.path.join(IMG, f"{stem}.jpg")) and n == 1 and False:
            n += 1
        uid = f"{stem}-{n}"
        w, h = save(im, f"{uid}-thumb.jpg", 700, 72)     # gallery: small, lower quality
        save(im, f"{uid}-view.jpg", 1100, 74)            # enlarged view: capped, not the original
        save(im, f"{uid}.jpg", 1100, 74)
        title = info.get("title", "")
        items.insert(0, {
            "file": f"images/{uid}.jpg", "thumb": f"images/{uid}-thumb.jpg", "view": f"images/{uid}-view.jpg",
            "w": w, "h": h, "title": title,
            "alt": f"Artwork: {title}" if title else "Artwork by ir3d3um",
            "size": info.get("size", ""), "medium": info.get("medium", ""),
            "price": info.get("price", ""), "status": info.get("status", "available"),
            "description": info.get("description", "")})
        os.remove(p)
        if os.path.exists(base + ".txt"):
            os.remove(base + ".txt")
        added += 1
        print("Added", uid)
    json.dump(items, open(DATA, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"{added} artwork(s) published")

main()

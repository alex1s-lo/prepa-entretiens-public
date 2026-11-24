"""Génère les icônes PNG de l'application (bibliothèque standard uniquement) : app/icone-192.png, app/icone-512.png.

Un carré arrondi bleu avec un « σ » blanc dessiné géométriquement (anneau + barre). Usage : python icones.py
"""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

RACINE = Path(__file__).resolve().parent
FOND = (47, 93, 138)
BLANC = (255, 255, 255)


def couverture(x: float, y: float, n: int) -> float:
    """Fraction de blanc au point (x, y) du carré [0, n]² (forme du sigma), suréchantillonnée 4×4."""
    total = 0
    for i in range(4):
        for j in range(4):
            px = x + (i + 0.5) / 4
            py = y + (j + 0.5) / 4
            u, v = px / n, py / n
            # anneau centré en (0.45, 0.58)
            d = math.hypot(u - 0.45, v - 0.58)
            anneau = 0.13 <= d <= 0.215
            # barre horizontale en haut, du centre de l'anneau vers la droite
            barre = 0.45 <= u <= 0.78 and 0.335 <= v <= 0.405
            total += 1 if (anneau or barre) else 0
    return total / 16


def dans_carre_arrondi(x: float, y: float, n: int, rayon: float) -> float:
    total = 0
    for i in range(2):
        for j in range(2):
            px, py = x + (i + 0.5) / 2, y + (j + 0.5) / 2
            cx = min(max(px, rayon), n - rayon)
            cy = min(max(py, rayon), n - rayon)
            total += 1 if math.hypot(px - cx, py - cy) <= rayon else 0
    return total / 4


def png(n: int, masquable: bool = False) -> bytes:
    lignes = []
    rayon = 0 if masquable else n * 0.22
    for y in range(n):
        ligne = bytearray([0])
        for x in range(n):
            a = 1.0 if masquable else dans_carre_arrondi(x, y, n, rayon)
            c = couverture(x, y, n)
            rgb = [round(FOND[k] * (1 - c) + BLANC[k] * c) for k in range(3)]
            ligne += bytes(rgb + [round(255 * a)])
        lignes.append(bytes(ligne))
    brut = zlib.compress(b"".join(lignes), 9)

    def bloc(type_, donnees):
        return struct.pack(">I", len(donnees)) + type_ + donnees + struct.pack(">I", zlib.crc32(type_ + donnees) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + bloc(b"IHDR", struct.pack(">IIBBBBB", n, n, 8, 6, 0, 0, 0)) +
            bloc(b"IDAT", brut) + bloc(b"IEND", b""))


def main() -> None:
    for n in (192, 512):
        (RACINE / "app" / f"icone-{n}.png").write_bytes(png(n))
    (RACINE / "app" / "icone-masquable-512.png").write_bytes(png(512, masquable=True))
    print("icônes écrites dans app/")


if __name__ == "__main__":
    main()

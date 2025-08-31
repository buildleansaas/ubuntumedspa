#!/usr/bin/env python3
"""
Generate a locations dataset of ZIP codes within a given radius of a center point.

By default, centers on Williamsburg, VA and a 20-mile radius as a proxy for ~60 minutes.
This uses the uszipcode offline database (downloaded on first run) and a simple
Haversine distance to filter ZIP centroids. You can refine later with drive-time
isochrones if desired.

Usage:
  python3 scripts/generate_locations.py \
    --name "Williamsburg, VA" --lat 37.2707 --lng -76.7075 --radius 20 \
    --out src/data/locations.json

Requirements:
  pip install uszipcode
"""

from __future__ import annotations

import argparse
import json
import math
from datetime import datetime, timezone
from typing import Dict, Any

try:
    from uszipcode import SearchEngine
except Exception as e:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: uszipcode. Install with: python3 -m pip install uszipcode"
    )


def haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 3958.8  # Earth radius in miles
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def build_dataset(
    name: str, lat: float, lng: float, radius_miles: float
) -> Dict[str, Any]:
    search = SearchEngine()  # downloads small SQLite DB on first run
    results = search.by_coordinates(lat, lng, radius=radius_miles, returns=None)

    rows = []
    for z in results:
        # Skip ZCTA without coordinates
        if z.lat is None or z.lng is None:
            continue
        dist = haversine_miles(lat, lng, z.lat, z.lng)
        if dist <= radius_miles + 1e-6:
            est_minutes_45 = round((dist / 45.0) * 60.0, 1)
            rows.append(
                {
                    "zip": z.zipcode,
                    "city": z.major_city,
                    "state": z.state,
                    "county": z.county,
                    "lat": z.lat,
                    "lng": z.lng,
                    "distance_miles": round(dist, 2),
                    "est_drive_minutes_45mph": est_minutes_45,
                    "within_60min_45mph": est_minutes_45 <= 60.0,
                }
            )

    rows.sort(key=lambda r: (r["distance_miles"], r["zip"]))

    # Build city summary
    city_index: Dict[str, Dict[str, Any]] = {}
    for r in rows:
        key = f"{r['city']}, {r['state']}"
        ent = city_index.setdefault(
            key, {"city": r["city"], "state": r["state"], "zips": []}
        )
        ent["zips"].append(r["zip"])
    cities = [
        {**v, "count": len(v["zips"])}
        for v in sorted(city_index.values(), key=lambda x: (x["city"], x["state"]))
    ]

    return {
        "center": {"name": name, "lat": lat, "lng": lng},
        "radius_miles": radius_miles,
        "method": "as-the-crow-flies using ZIP centroids (seed set)",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "zipcodes": rows,
        "cities": cities,
        "summary": {
            "total_zipcodes": len(rows),
            "within_60min_45mph_count": sum(1 for r in rows if r["within_60min_45mph"]),
        },
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="Williamsburg, VA")
    ap.add_argument("--lat", type=float, default=37.2707)
    ap.add_argument("--lng", type=float, default=-76.7075)
    ap.add_argument("--radius", type=float, default=20.0, help="Radius in miles")
    ap.add_argument("--out", default="src/data/locations.json")
    args = ap.parse_args()

    ds = build_dataset(args.name, args.lat, args.lng, args.radius)
    # Ensure stable formatting for diffs
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(ds, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Wrote {len(ds['zipcodes'])} ZIPs to {args.out}")


if __name__ == "__main__":
    main()

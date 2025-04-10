import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
from sklearn.cluster import DBSCAN
import json

print("🔄 Starting corridor analysis...")

try:
    with open("chargers_with_highways.json", "r") as f:
        data = json.load(f)
except FileNotFoundError:
    print("❌ File not found: chargers_with_highways.json")
    exit()
except json.JSONDecodeError:
    print("❌ Failed to parse JSON. Check file format.")
    exit()

if not data:
    print("❌ JSON file is empty.")
    exit()

print(f"✅ Loaded {len(data)} chargers from JSON.")

# Check for lat/lon keys
first_item = data[0]
if "lat" not in first_item or "lon" not in first_item:
    print("❌ Missing 'latitude' or 'longitude' in JSON data.")
    exit()

# Convert to DataFrame
df = pd.DataFrame(data)
print("✅ Converted to DataFrame.")

# Create GeoDataFrame
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df["lon"], df["lat"]),
    crs="EPSG:4326"
)

gdf = gdf.to_crs(epsg=3857)  # Convert to meters
coords = gdf.geometry.apply(lambda p: (p.x, p.y)).to_list()

print(f"🔍 Running DBSCAN on {len(coords)} points...")

# Run DBSCAN clustering
db = DBSCAN(eps=30000, min_samples=3).fit(coords)
gdf["corridor"] = db.labels_

print("✅ Clustering complete.")
print("📊 Corridor labels:", gdf["corridor"].unique())

# Back to lat/lon
gdf = gdf.to_crs(epsg=4326)

# Export
output_file = "chargers_with_corridors.geojson"
gdf.to_file(output_file, driver="GeoJSON")
print(f"✅ Corridor analysis complete. Output saved as {output_file}")


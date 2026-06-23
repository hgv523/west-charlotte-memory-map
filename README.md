# Freedom & Wilkinson Memory Atlas

An interactive 3D satellite memory map for West Charlotte, centered around Freedom Drive and Wilkinson Boulevard.

## Current Prototype

- 3D satellite/hybrid map
- Enderly Park IFC model shown as 3D contextual building extrusions
- Highlighted Freedom Drive and Wilkinson Boulevard anchors
- Search for Charlotte-area locations and fly the map to a result
- Click the map to add a memory at that location
- Upload a memory image
- Open memory detail panels
- Shared memory storage through Supabase
- Delete memories from the same browser session that created them
- Rotate, pan, and zoom the map

## Publishing

This version is a static GitHub Pages app. Community memories use Supabase when `config.js` contains the project URL and public anon key.

For a public community version where everyone sees the same submissions, connect Supabase for:

- shared memory records
- uploaded image storage
- moderation/approval status
- optional submitter name/contact fields

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the SQL in `supabase-schema.sql`.
4. Copy `config.example.js` values into `config.js`.
5. Set `supabaseUrl` to your project URL.
6. Set `supabaseAnonKey` to your public anon key.

Do not use a Supabase service role key in this browser app. The anon key is expected to be public, and safety comes from Row Level Security policies.

The delete button uses the `delete_memory` database function. It allows a visitor to delete a shared memory only from the same browser session that created it.

## Enderly Park IFC Model

The source IFC file is stored at `assets/Enderly.ifc`. The web map loads generated GeoJSON layers for the building extrusions at `data/enderly-buildings.geojson` and the green triangulated terrain mesh at `data/enderly-terrain.geojson`.

To regenerate the browser-ready layers after replacing the IFC file, run:

```powershell
node .\tools\ifc-to-geojson.mjs .\assets\Enderly.ifc .\data\enderly-buildings.geojson .\data\enderly-terrain.geojson
```

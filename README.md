# Freedom & Wilkinson Memory Atlas

An interactive 3D satellite memory map for West Charlotte, centered around Freedom Drive and Wilkinson Boulevard.

## Current Prototype

- 3D satellite/hybrid map
- Highlighted Freedom Drive and Wilkinson Boulevard anchors
- Click the map to add a memory at that location
- Upload a memory image
- Open memory detail panels
- Delete memories from the current browser session
- Rotate, pan, and zoom the map

## Publishing

This version is a static GitHub Pages app. Community memories added in the browser are temporary until a shared database is connected.

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

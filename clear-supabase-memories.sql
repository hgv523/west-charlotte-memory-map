-- Run this in Supabase SQL Editor to clear all existing public memories.
-- This removes memory rows and uploaded memory images.

delete from storage.objects
where bucket_id = 'memory-images';

delete from public.memories;


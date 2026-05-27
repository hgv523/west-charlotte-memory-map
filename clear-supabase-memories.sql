-- Run this in Supabase SQL Editor to clear all existing public memories.
-- Supabase blocks direct deletion from storage.objects in SQL Editor.
-- Uploaded images can be removed separately from Storage > memory-images.

delete from public.memories;

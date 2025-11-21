-- Add image URL columns for facilities and hostel facilities
ALTER TABLE public.colleges 
ADD COLUMN facilities_image_url TEXT,
ADD COLUMN hostel_facilities_image_url TEXT;
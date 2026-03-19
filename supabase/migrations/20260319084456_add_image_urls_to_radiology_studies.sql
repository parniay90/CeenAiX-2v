/*
  # Add Image URLs to Radiology Studies
  
  Adds image_url column to store medical image paths
  Updates existing studies with actual medical images
*/

-- Add image_url column to radiology_studies
ALTER TABLE radiology_studies 
ADD COLUMN IF NOT EXISTS image_url text;

-- Update studies with actual medical image URLs
UPDATE radiology_studies 
SET image_url = '/WhatsApp_Image_2026-03-12_at_18.32.02.jpeg'
WHERE accession_number = 'XR20260318001';

UPDATE radiology_studies 
SET image_url = '/WhatsApp_Image_2026-03-12_at_18.32.03_(1).jpeg'
WHERE accession_number = 'XR20260318002';

UPDATE radiology_studies 
SET image_url = '/WhatsApp_Image_2026-03-12_at_18.32.03.jpeg'
WHERE accession_number = 'XR20260313001';

UPDATE radiology_studies 
SET image_url = '/download.jpeg'
WHERE accession_number = 'MR20260311001';

UPDATE radiology_studies 
SET image_url = '/GettyImages-146920188.webp'
WHERE accession_number = 'MR20260314001';

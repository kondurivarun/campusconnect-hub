-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view colleges" ON public.colleges;

-- Create a new policy that allows both authenticated and anonymous users to view colleges
CREATE POLICY "Public can view colleges"
ON public.colleges
FOR SELECT
TO public
USING (true);
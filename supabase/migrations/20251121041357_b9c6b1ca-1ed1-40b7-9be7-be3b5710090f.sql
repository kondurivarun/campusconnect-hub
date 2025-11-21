-- Prevent the main admin account from being changed to student role
CREATE OR REPLACE FUNCTION public.prevent_admin_demotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if trying to change the main admin (admin@campusverse.com) to student
  IF OLD.role = 'admin' AND NEW.role = 'student' THEN
    -- Get the email of this user
    IF EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = OLD.user_id 
      AND email = 'admin@campusverse.com'
    ) THEN
      RAISE EXCEPTION 'Cannot demote the primary admin account to student role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to prevent admin demotion
DROP TRIGGER IF EXISTS prevent_admin_demotion_trigger ON public.user_roles;
CREATE TRIGGER prevent_admin_demotion_trigger
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_admin_demotion();
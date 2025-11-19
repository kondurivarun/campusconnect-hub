-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  courses TEXT NOT NULL,
  facilities TEXT,
  placements TEXT,
  hostel_facilities TEXT,
  sports_achievements TEXT,
  faculty_details TEXT,
  contact TEXT,
  website TEXT,
  map_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for colleges (everyone can view, only admins can modify)
CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert colleges"
  ON public.colleges FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update colleges"
  ON public.colleges FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete colleges"
  ON public.colleges FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for feedback
CREATE POLICY "Students can insert feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup (creates profile and assigns student role by default)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Assign student role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for colleges updated_at
CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Seed data: Create admin user role (admin@campusverse.com will need to sign up first)
-- Note: The actual user must sign up through the app first, then we'll manually assign admin role

-- Seed colleges data with Telangana districts
INSERT INTO public.colleges (name, district, courses, facilities, placements, hostel_facilities, sports_achievements, faculty_details, contact, website, map_link, image_url) VALUES
('Government Degree College, Nalgonda', 'Nalgonda', 'B.Sc, B.Com, B.A, M.Sc, M.Com', 'Library with 15000+ books, Computer Lab, Science Labs, Auditorium', '85% placement rate, Top recruiters: TCS, Infosys, Wipro', 'Separate hostels for boys and girls, Capacity: 200 students each', 'District level cricket champions 2023, State level athletics participation', 'Highly qualified faculty with PhD holders, Regular workshops and seminars', '+91-8682-244123, principal@gdcnalgonda.edu.in', 'https://gdcnalgonda.edu.in', 'https://maps.google.com/?q=17.0534,79.2678', null),

('CMR Engineering College, Kodad', 'Suryapet', 'B.Tech (CSE, ECE, Mech, Civil), M.Tech', 'Modern labs, WiFi campus, Central library, Cafeteria, Transportation', '92% placement record, Companies: Amazon, Microsoft, Accenture', 'AC hostels with modern amenities, Mess facility, 24/7 security', 'University level volleyball champions, Cricket and football teams', 'Experienced faculty from IITs and NITs, Industry experts as guest lecturers', '+91-8683-242424, info@cmrengg.edu.in', 'https://cmrengg.edu.in', 'https://maps.google.com/?q=16.9952,79.9644', null),

('SR Degree College, Narketpally', 'Nalgonda', 'B.Sc (Maths, Physics, Chemistry), B.Com, BBA', 'Well-equipped laboratories, Digital library, Smart classrooms', '75% placement in regional companies, Banking sector placements', 'Girls hostel available, Capacity: 100 students', 'Badminton and table tennis facilities, Annual sports meet', 'Dedicated faculty with 10+ years experience', '+91-8685-222333, contact@srcollege.edu.in', 'https://srcollege.edu.in', 'https://maps.google.com/?q=17.0667,79.2333', null),

('Kakatiya Institute of Technology, Warangal', 'Warangal', 'B.Tech (All branches), M.Tech, MBA', 'State-of-art infrastructure, Innovation lab, Incubation center', '95% placement rate, Top packages: 12 LPA, Average: 4.5 LPA', 'Twin sharing AC rooms, Gymnasium, Indoor games', 'Inter-collegiate basketball champions, Swimming pool available', 'Faculty from premier institutions, Research publications in international journals', '+91-870-2459999, admissions@kit.ac.in', 'https://kit.ac.in', 'https://maps.google.com/?q=17.9689,79.5941', null),

('Aurora Degree College, Hyderabad', 'Hyderabad', 'B.Com, BBA, B.Sc (CS, Data Science), MBA', 'AC classrooms, Advanced computer labs, Entrepreneurship cell', '90% placement, Companies: Deloitte, KPMG, EY, Capgemini', 'Premium hostel facilities, Food court, Recreation room', 'Multiple state level sports awards, Gym and yoga center', 'Industry-experienced faculty, Regular corporate interactions', '+91-40-66889999, info@aurora.edu.in', 'https://aurora.edu.in', 'https://maps.google.com/?q=17.4239,78.4738', null);
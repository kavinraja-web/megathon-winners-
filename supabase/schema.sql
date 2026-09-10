-- =====================================================================
-- Pharma Trace Supabase Database Schema
-- Run this script in the Supabase SQL Editor
-- =====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. USERS TABLE (Supply Chain Roles)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'Pharmacy' CHECK (role IN ('Manufacturer', 'Distributor', 'Pharmacy', 'Destruction Facility', 'Regulator')),
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 2. BATCHES TABLE (Medicine Traceability)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity >= 0),
    location TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Near Expiry', 'Expired', 'Return Requested', 'In Transit', 'Verified', 'Awaiting Destruction', 'Destroyed')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 3. NOTIFICATIONS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('alert', 'logistics', 'success', 'fraud')),
    message TEXT NOT NULL,
    time_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 4. AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'batches' THEN
        NEW.last_updated = timezone('utc'::text, now());
    ELSE
        NEW.updated_at = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_users_updated ON public.users;
CREATE TRIGGER on_users_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_batches_updated ON public.batches;
CREATE TRIGGER on_batches_updated
    BEFORE UPDATE ON public.batches
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================================
-- 5. AUTOMATIC PROFILE CREATION ON USER SIGNUP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        full_name,
        email,
        phone,
        role,
        location
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Pharmacy'),
        COALESCE(NEW.raw_user_meta_data->>'location', 'Unknown')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users: Anyone can view profiles; only owners can update their own profile
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Batches: Viewable by all authenticated users
CREATE POLICY "Batches are viewable by everyone."
    ON public.batches FOR SELECT
    USING (true);

-- Batches: Only Manufacturers can create batches
CREATE POLICY "Manufacturers can create batches."
    ON public.batches FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'Manufacturer'
        )
    );

-- Batches: Users can update batches
CREATE POLICY "Users can update batches."
    ON public.batches FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Notifications: Viewable by all
CREATE POLICY "Notifications are viewable by everyone."
    ON public.notifications FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create notifications."
    ON public.notifications FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

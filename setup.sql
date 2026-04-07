-- Run these in your Supabase SQL Editor

-- 1. Create follow_ups table
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    source TEXT,
    priority TEXT,
    last_contacted TIMESTAMPTZ,
    project TEXT,
    notes TEXT,
    needs TEXT, -- New column for Follow Ups
    created_by TEXT,
    created_by_name TEXT,
    updated_by TEXT,
    updated_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users on follow_ups" ON public.follow_ups;
CREATE POLICY "Enable all for authenticated users on follow_ups" ON public.follow_ups
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    source TEXT,
    priority TEXT,
    last_contacted TIMESTAMPTZ,
    project TEXT,
    notes TEXT,
    needs TEXT,
    created_by TEXT,
    created_by_name TEXT,
    updated_by TEXT,
    updated_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users on proposals" ON public.proposals;
CREATE POLICY "Enable all for authenticated users on proposals" ON public.proposals
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Create proposal_pdfs table
CREATE TABLE IF NOT EXISTS public.proposal_pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_by TEXT,
    uploaded_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.proposal_pdfs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users on proposal_pdfs" ON public.proposal_pdfs;
CREATE POLICY "Enable all for authenticated users on proposal_pdfs" ON public.proposal_pdfs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Create storage bucket for Proposal PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proposals_pdfs', 'proposals_pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to proposals_pdfs" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to proposals_pdfs"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'proposals_pdfs');

DROP POLICY IF EXISTS "Allow public read access to proposals_pdfs" ON storage.objects;
CREATE POLICY "Allow public read access to proposals_pdfs"
ON storage.objects FOR SELECT TO public USING (bucket_id = 'proposals_pdfs');

DROP POLICY IF EXISTS "Allow authenticated deletes from proposals_pdfs" ON storage.objects;
CREATE POLICY "Allow authenticated deletes from proposals_pdfs"
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'proposals_pdfs');

-- 5. Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price_label TEXT, -- e.g. "₹ 1.25 Cr"
    price_value NUMERIC, -- for sorting
    type TEXT, -- Apartment, Villa, Plot, Commercial
    status TEXT, -- For Sale, For Rent
    beds INTEGER,
    baths INTEGER,
    area_sqft NUMERIC,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    slug TEXT UNIQUE,
    description TEXT,
    features TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for everyone on properties" ON public.properties;
CREATE POLICY "Enable read for everyone on properties" ON public.properties
    FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Enable all for authenticated users on properties" ON public.properties;
CREATE POLICY "Enable all for authenticated users on properties" ON public.properties
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property images
DROP POLICY IF EXISTS "Allow authenticated uploads to property_images" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to property_images"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property_images');

DROP POLICY IF EXISTS "Allow public read access to property_images" ON storage.objects;
CREATE POLICY "Allow public read access to property_images"
ON storage.objects FOR SELECT TO public USING (bucket_id = 'property_images');

DROP POLICY IF EXISTS "Allow authenticated deletes from property_images" ON storage.objects;
CREATE POLICY "Allow authenticated deletes from property_images"
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property_images');

// src/services/supabaseClient.ts
// Supabase Cloud Backend Connector & Cloud Sync for Genowl Studio

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
}

const SUPABASE_URL_KEY = 'genowl_supabase_url';
const SUPABASE_ANON_KEY = 'genowl_supabase_anon_key';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
    const url = localStorage.getItem(SUPABASE_URL_KEY) || envUrl;
    const anonKey = localStorage.getItem(SUPABASE_ANON_KEY) || envKey;
    return {
      url: url.trim(),
      anonKey: anonKey.trim(),
      connected: Boolean(url.trim() && anonKey.trim()),
    };
  } catch {
    return { url: '', anonKey: '', connected: false };
  }
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  try {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Failed to save Supabase credentials:', err);
  }
}

/**
 * Universal SQL Schema to set up tables in Supabase with 1 click
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. GENOWL REGISTERED USERS TABLE
CREATE TABLE IF NOT EXISTS public.genowl_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ DEFAULT now()
);

-- 2. GENOWL CLIENT ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.genowl_orders (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  details TEXT,
  reference_url TEXT,
  speed TEXT DEFAULT 'standard',
  amount TEXT NOT NULL,
  status TEXT DEFAULT 'pending_slot_call',
  payment_id TEXT,
  payment_method TEXT DEFAULT 'Direct Slot Booking',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure phone column exists if table was already created
ALTER TABLE public.genowl_orders ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. GENOWL CLIENT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.genowl_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure phone column exists if table was already created
ALTER TABLE public.genowl_inquiries ADD COLUMN IF NOT EXISTS phone TEXT;

-- Enable Row Level Security (RLS) & Public Policies
ALTER TABLE public.genowl_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genowl_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genowl_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read/write" ON public.genowl_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read/write" ON public.genowl_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read/write" ON public.genowl_inquiries FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Syncs a new or updated client order to Supabase cloud PostgreSQL
 */
export async function syncOrderToSupabase(order: {
  id: string;
  service: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
  referenceUrl?: string;
  speed?: string;
  amount: string;
  status?: string;
  paymentId?: string;
  paymentMethod?: string;
}): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.connected) {
    console.warn(
      '[Supabase Sync] Skipped: Supabase credentials are not configured yet. Please open the Studio Admin panel (Footer > Studio Admin > Supabase) and enter your Supabase Project URL & Anon Public Key, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
    return false;
  }

  try {
    const endpoint = `${config.url.replace(/\/$/, '')}/rest/v1/genowl_orders`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: order.id,
        service: order.service,
        name: order.name,
        email: order.email,
        phone: order.phone || null,
        details: order.details,
        reference_url: order.referenceUrl || null,
        speed: order.speed || 'standard',
        amount: order.amount,
        status: order.status || 'pending_slot_call',
        payment_id: order.paymentId || null,
        payment_method: order.paymentMethod || 'Direct Slot Booking',
        created_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Supabase Error ${res.status}] Failed to sync order ${order.id}:`, errText);
      return false;
    }

    console.log(`[Supabase Success] Order ${order.id} synced successfully to genowl_orders!`);
    return true;
  } catch (err) {
    console.error('[Supabase Network Exception] Failed to sync order:', err);
    return false;
  }
}

/**
 * Syncs an inquiry or problem report to Supabase cloud PostgreSQL
 */
export async function syncInquiryToSupabase(inquiry: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.connected) {
    console.warn('[Supabase Sync] Skipped inquiry sync: Credentials not configured.');
    return false;
  }

  try {
    const endpoint = `${config.url.replace(/\/$/, '')}/rest/v1/genowl_inquiries`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        service: inquiry.service,
        message: inquiry.message,
        created_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Supabase Error ${res.status}] Failed to sync inquiry ${inquiry.id}:`, errText);
      return false;
    }

    console.log(`[Supabase Success] Inquiry ${inquiry.id} synced successfully to genowl_inquiries!`);
    return true;
  } catch (err) {
    console.error('[Supabase Network Exception] Failed to sync inquiry:', err);
    return false;
  }
}

/**
 * Tests live connection to Supabase instance
 */
export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanKey) {
      return { success: false, message: 'Both Supabase URL and Anon Key are required.' };
    }

    const endpoint = `${cleanUrl}/rest/v1/`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: cleanKey,
        Authorization: `Bearer ${cleanKey}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return { success: true, message: 'Successfully connected to your Supabase Cloud Database!' };
    } else {
      return { success: false, message: `Connection failed with status ${res.status}. Please check your credentials.` };
    }
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error connecting to Supabase.' };
  }
}

/**
 * Syncs a registered or logged-in user profile to Supabase cloud PostgreSQL
 */
export async function syncUserToSupabase(user: {
  id: string;
  name: string;
  email: string;
  verified?: boolean;
}): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config.connected) {
    console.warn('[Supabase Sync] Skipped user sync: Supabase credentials not configured.');
    return false;
  }

  try {
    const endpoint = `${config.url.replace(/\/$/, '')}/rest/v1/genowl_users`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified ?? true,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Supabase Error ${res.status}] Failed to sync user ${user.email}:`, errText);
      return false;
    }

    console.log(`[Supabase Success] User ${user.email} synced successfully to genowl_users!`);
    return true;
  } catch (err) {
    console.error('[Supabase Network Exception] Failed to sync user:', err);
    return false;
  }
}

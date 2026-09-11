// src/services/hostingerDbService.ts
// Direct Hostinger LiteSpeed MySQL Database Client for Genowl Studio

export interface BookingPayload {
  name: string;
  email: string;
  service_type: string;
  budget?: string;
  project_scope?: string;
  preferred_time?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ProjectLeadPayload {
  receipt_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  service_style?: string;
  turnaround_speed?: 'standard' | 'priority' | 'urgent';
  quoted_price?: string;
  payment_status?: 'pending' | 'deposit_paid' | 'fully_paid' | 'refunded';
  meeting_date?: string;
  meeting_time_slot?: string;
  meeting_platform?: string;
  reference_url?: string;
  project_scope: string;
  extracted_keywords?: string | string[];
  voice_transcript?: string;
  lead_source?: string;
  project_metadata?: Record<string, any>;
  status?: 'new' | 'meeting_scheduled' | 'in_progress' | 'client_review' | 'completed' | 'cancelled';
  assigned_founder?: 'Antriksh' | 'Bilal' | 'Maulik' | 'Jaywardhan' | 'Ritesh' | 'Unassigned';
  founder_notes?: string;
}

/**
 * Intelligent Keyword & Tech Tag Extractor
 * Extracts crucial client intent tags from briefs, transcripts, or notes
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const dictionary = [
    '3d', 'webgl', 'three.js', 'glsl', 'shader', '60fps', 'retina', 'canvas', 'pbr',
    'gltf', 'glb', 'scroll', 'animation', 'gsap', 'lenis', '2d', 'saas', 'landing page',
    'react', 'next.js', 'vite', 'tailwind', 'dark mode', 'luxury', 'linear',
    'ai agent', 'yzer', 'voice', 'speech', 'webrtc', 'chat', 'llm', 'rag', 'knowledge base',
    'video', 'commercial', '4k', '9:16', '16:9', 'reels', 'tiktok', 'motion graphics',
    'content', 'copywriting', 'seo', 'articles',
    'stripe', 'payment', 'ecommerce', 'shop', 'auth', 'supabase', 'database', 'hostinger',
    'urgent', 'asap', 'fast-track', 'consultation', 'google meet', 'zoom'
  ];

  const matched = new Set<string>();
  dictionary.forEach((tag) => {
    if (lower.includes(tag)) {
      matched.add(tag);
    }
  });

  return Array.from(matched);
}

/**
 * Submit a comprehensive project lead with all minor details to genowl_project_leads
 */
export async function submitProjectLeadToHostinger(payload: ProjectLeadPayload): Promise<{
  success: boolean;
  lead_id?: number;
  receipt_id?: string;
  message?: string;
  error?: string;
}> {
  try {
    // If keywords not provided, auto-extract them
    if (!payload.extracted_keywords) {
      const combined = `${payload.service_type} ${payload.service_style || ''} ${payload.project_scope} ${payload.voice_transcript || ''}`;
      payload.extracted_keywords = extractKeywordsFromText(combined);
    }

    const res = await fetch('/api/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to record project lead in Hostinger Database');
    }
    return {
      success: true,
      lead_id: data.lead_id,
      receipt_id: data.receipt_id,
      message: data.message,
    };
  } catch (err: any) {
    console.warn('[Hostinger DB] Project lead sync warning:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all project leads and intelligence from Hostinger MySQL
 */
export async function fetchProjectLeadsFromHostinger(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const res = await fetch('/api/leads.php?limit=100');
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch leads from Hostinger');
    }
    return { success: true, data: data.data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Submit a project booking directly to Hostinger MySQL Database
 */
export async function submitBookingToHostinger(payload: BookingPayload): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/bookings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to record booking in Hostinger Database');
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    console.warn('[Hostinger DB] Booking sync warning:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Submit a contact inquiry directly to Hostinger MySQL Database
 */
export async function submitContactToHostinger(payload: ContactPayload): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/contacts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to record inquiry in Hostinger Database');
    }
    return { success: true, message: data.message };
  } catch (err: any) {
    console.warn('[Hostinger DB] Contact sync warning:', err.message);
    return { success: false, error: err.message };
  }
}


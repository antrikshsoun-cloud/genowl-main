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

export interface ServiceBookingPayload {
  service_type: string;
  customizations: string;
  booked_slot: string;
  customer_email: string;
  customer_phone?: string;
  receipt_id?: string;
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
  customizations?: string;
  extracted_keywords?: string | string[];
  voice_transcript?: string;
  lead_source?: string;
  project_metadata?: Record<string, any>;
  status?: 'new' | 'meeting_scheduled' | 'in_progress' | 'client_review' | 'completed' | 'cancelled';
  assigned_founder?: 'Antriksh' | 'Bilal' | 'Maulik' | 'Jaywardhan' | 'Ritesh' | 'Unassigned';
  founder_notes?: string;
}

/**
 * Intelligent Spelled & Phonetic Email Parser
 * Handles letter-by-letter spelling, spoken phonetic separators (at, dot), and digit words.
 * Example inputs handled:
 * - "a n t r i k s h at g m a i l dot com" -> "antriksh@gmail.com"
 * - "b-i-l-a-l at g e n o w l dot t e c h" -> "bilal@genowl.tech"
 * - "john dot doe at gmail dot com" -> "john.doe@gmail.com"
 */
export function parseSpelledEmail(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // 1. Check for standard email address already formatted
  const directMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  if (directMatch) {
    const directEmail = directMatch[0].toLowerCase().trim();
    if (!directEmail.includes('@client.genowl.tech') && !directEmail.includes('voice_caller')) {
      return directEmail;
    }
  }

  // 2. Normalize spoken separators and words
  let text = raw.toLowerCase();

  // Strip common introductory noise (both word format and letter-spaced format)
  text = text.replace(/^(?:m\s*y\s*e\s*m\s*a\s*i\s*l\s*(?:i\s*s\s*)?|i\s*t\s*s\s*|e\s*m\s*a\s*i\s*l\s*i\s*s\s*|s\s*p\s*e\s*l\s*l\s*(?:e\s*d|t)?\s*)/i, '');
  text = text.replace(/^(my email is|it's|its|email is|email address is|my email id is|spelled|spelt)\s+/i, '');

  // Convert digit words to numbers
  const numberWords: Record<string, string> = {
    zero: '0', one: '1', two: '2', three: '3', four: '4',
    five: '5', six: '6', seven: '7', eight: '8', nine: '9',
  };
  Object.keys(numberWords).forEach((word) => {
    text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), numberWords[word]);
  });

  // Convert spoken symbols
  text = text.replace(/\s*(?:at the rate|at sign|\bat\b|@)\s*/gi, '@');
  text = text.replace(/\s*(?:dot|period|\.)\s*/gi, '.');
  text = text.replace(/\s*(?:underscore)\s*/gi, '_');
  text = text.replace(/\s*(?:dash|hyphen|minus)\s*/gi, '-');

  // Must have an '@' and a '.' to be an email candidate
  if (!text.includes('@') || !text.includes('.')) {
    return null;
  }

  // Split into user and domain parts
  const atParts = text.split('@');
  if (atParts.length < 2) return null;

  const userRaw = atParts[0].trim();
  const domainRaw = atParts.slice(1).join('@').trim();

  // Collapse spaces between spelled letters in username (e.g., "a n t r i k s h" -> "antriksh")
  const cleanUser = userRaw.replace(/\s+/g, '').replace(/[^a-zA-Z0-9._%-]/g, '');

  // For domain: split by dot to handle domain name and TLD
  const dotParts = domainRaw.split('.');
  if (dotParts.length < 2) return null;

  const domainName = dotParts[0].replace(/\s+/g, '').replace(/[^a-zA-Z0-9-]/g, '');
  const tld = dotParts.slice(1).join('').replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');

  if (!cleanUser || !domainName || !tld || tld.length < 2) {
    return null;
  }

  const assembled = `${cleanUser}@${domainName}.${tld}`.toLowerCase();

  // Validate standard RFC format
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (validRegex.test(assembled)) {
    return assembled;
  }

  return null;
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

/**
 * Submit verified AI Voice / Phone Service Booking strictly recording:
 * 1. Which Service (service_type)
 * 2. Extra Details / Customizations (customizations)
 * 3. Booked Slot (booked_slot / meeting_time_slot)
 * 4. Verified Spelled Email (customer_email)
 * Nothing extraneous is recorded.
 */
export async function submitServiceBookingToHostinger(payload: ServiceBookingPayload): Promise<{
  success: boolean;
  lead_id?: number;
  receipt_id?: string;
  message?: string;
  error?: string;
}> {
  const cleanEmail = (payload.customer_email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.includes('@client.genowl.tech') || cleanEmail.includes('voice_caller')) {
    return { success: false, error: 'A valid spelled customer email is required to record a service booking.' };
  }

  const receiptId = payload.receipt_id || `GENOWL-BOOK-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const res = await fetch('/api/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receipt_id: receiptId,
        customer_name: cleanEmail.split('@')[0],
        customer_email: cleanEmail,
        customer_phone: payload.customer_phone || 'Captured via AI Voice Booking',
        service_type: payload.service_type || '2D Website',
        customizations: payload.customizations || 'Standard client specifications',
        meeting_time_slot: payload.booked_slot || 'Consultation Slot Requested',
        project_scope: payload.customizations || 'Custom service specifications',
        lead_source: 'YZER AI Voice Agent Service Booking',
        status: 'meeting_scheduled',
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to record service booking in Hostinger Database');
    }

    // Save into Local Client Hub so it's instantly visible in the website profile
    try {
      const rawExisting = localStorage.getItem('genowl_client_orders');
      const orders = rawExisting ? JSON.parse(rawExisting) : [];
      const newOrder = {
        id: receiptId,
        service: payload.service_type,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: payload.customer_phone || '',
        details: payload.customizations,
        customizations: payload.customizations,
        preferredTime: payload.booked_slot,
        amount: payload.service_type.includes('2,500') || payload.service_type.includes('3D') ? '$1,000' : (payload.service_type.includes('200') ? '$200' : '$500'),
        status: 'meeting_scheduled',
        createdAt: new Date().toISOString(),
      };
      orders.unshift(newOrder);
      localStorage.setItem('genowl_client_orders', JSON.stringify(orders));
      window.dispatchEvent(new Event('storage'));
    } catch (storageErr) {
      console.warn('Local client orders sync warning:', storageErr);
    }

    return {
      success: true,
      lead_id: data.lead_id,
      receipt_id: receiptId,
      message: 'Service booking successfully recorded in Hostinger Database!',
    };
  } catch (err: any) {
    console.warn('[Hostinger DB] Service booking sync warning:', err.message);
    return { success: false, error: err.message };
  }
}



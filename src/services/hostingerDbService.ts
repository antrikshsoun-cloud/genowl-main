// src/services/hostingerDbService.ts
// Direct Hostinger LiteSpeed MySQL Database Client for Genowl Studio

export interface BookingPayload {
  name: string;
  email: string;
  service_type: string;
  budget?: string;
  project_scope?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
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

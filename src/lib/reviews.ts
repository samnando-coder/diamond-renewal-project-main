export type GoogleReviewsSummary = {
  source: 'trustindex';
  rating: number | null;
  count: number | null;
  fetchedAt: string;
};

export type SalonizedReviewsSummary = {
  source: 'salonized';
  rating: number | null;
  count: number | null;
  fetchedAt: string;
};

import { apiUrl } from './api';

export async function fetchGoogleReviewsSummary(): Promise<GoogleReviewsSummary | null> {
  try {
    const res = await fetch(apiUrl('/api/reviews/google'));
    if (!res.ok) return null;
    return (await res.json()) as GoogleReviewsSummary;
  } catch {
    return null;
  }
}

export async function fetchSalonizedReviewsSummary(): Promise<SalonizedReviewsSummary | null> {
  try {
    const res = await fetch(apiUrl('/api/reviews/salonized'));
    if (!res.ok) return null;
    return (await res.json()) as SalonizedReviewsSummary;
  } catch {
    return null;
  }
}


/**
 * Share Token Generation Utilities
 *
 * Generates secure, random tokens for shareable links that provide
 * external access to shows without requiring user accounts.
 */

import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure random token for sharing
 * Format: 32 character hex string (128 bits of entropy)
 */
export function generateShareToken(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Generate a shorter, more user-friendly share code
 * Format: 8 character alphanumeric (case insensitive)
 * Good for temporary access or verbal sharing
 */
export function generateShareCode(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  const bytes = randomBytes(8);

  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

/**
 * Validate that a token has the correct format
 */
export function isValidShareToken(token: string): boolean {
  return /^[a-f0-9]{32}$/.test(token);
}

/**
 * Validate that a share code has the correct format
 */
export function isValidShareCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
}

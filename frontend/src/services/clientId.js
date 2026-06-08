// ─── Session-Scoped Client Identity ───────────────────────────────────────────
// Generates a unique random ID per browser tab session using sessionStorage.
// sessionStorage is automatically cleared when the tab or browser is closed,
// so all project history is tied to the current session only.
// No login required — the ID is created fresh on every new session.

const CLIENT_ID_KEY = 'syntaxout_client_id';

/**
 * Returns the session clientId for this browser tab.
 * Creates and saves a new one if this is a fresh session.
 */
export function getClientId() {
  let id = sessionStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    // Generate a random unique ID: "so_" + 16 random hex chars
    id = 'so_' + Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

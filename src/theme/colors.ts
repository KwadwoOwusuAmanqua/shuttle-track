/**
 * Kinetic Canvas — Design Tokens
 *
 * A light, editorial palette anchored in crisp white surfaces and
 * energized by Forest Lime (#006b0a / #59ee50), with Deep Teal as accent.
 */

const Colors: Record<string, string> = {
  /* ── Surface Hierarchy (light → slightly tinted) ──── */
  50:   "#ffffff",   // surface_container_lowest — pure white cards
  100:  "#f1f8f1",   // surface / base background
  200:  "#ebf3eb",   // surface_container_low — sidebar, sectioning
  300:  "#e4eee4",   // surface_container — interactive cards
  400:  "#dce8dc",   // surface_container_high — elevated modals
  500:  "#d4e2d4",   // surface_container_highest — secondary buttons
  600:  "#a8afa9",   // outline_variant — ghost borders (use at 15% opacity)
  700:  "#717971",   // outline
  800:  "#565d58",   // on-surface-variant / text secondary
  900:  "#29302c",   // on-surface / text primary
  950:  "#002204",   // on-primary-container, deepest

  /* ── Semantic Aliases ────────────────────────────────── */

  // Surfaces
  surface:                  "#f1f8f1",
  surface_container_lowest: "#ffffff",
  surface_container_low:    "#ebf3eb",
  surface_container:        "#e4eee4",
  surface_container_high:   "#dce8dc",
  surface_container_highest:"#d4e2d4",
  background:               "#f1f8f1",

  // Primary — Forest Lime
  primary:              "#006b0a",
  on_primary:           "#ffffff",
  primary_container:    "#59ee50",
  on_primary_container: "#002204",
  primary_dim:          "#00530d",

  // Secondary — Error/Warning Red
  secondary:            "#ba1a1a",
  on_secondary:         "#ffffff",
  secondary_container:  "#ffdad6",
  on_secondary_container:"#410002",

  // Tertiary — Deep Teal
  tertiary:             "#00666d",

  // On-Surface Text
  on_surface:           "#29302c",
  on_surface_variant:   "#565d58",

  // Outline
  outline:              "#717971",
  outline_variant:      "#a8afa9",

  // Legacy semantic aliases (used by existing components)
  textPrimary:          "#29302c",
  textSecondary:        "#565d58",
  textMuted:            "#8b9389",
  buttonPrimary:        "#006b0a",
  buttonPressed:        "#004b07",
  buttonText:           "#ffffff",
  cardBackground:       "#e4eee4",
  inputBackground:      "#ffffff",
  borderColor:          "#a8afa9",
  navBackground:        "#ffffff",
  navIcon:              "#8b9389",
  navIconActive:        "#006b0a",
  tabBarActive:         "#006b0a",
  tabBarInactive:       "#8b9389",
  shadow:               "#29302c",
  heroBackground:       "#f1f8f1",
  deepBackground:       "#ebf3eb",
  success:              "#006b0a",
};

export default Colors;

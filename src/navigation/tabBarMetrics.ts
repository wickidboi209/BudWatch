import { Spacing } from "../theme/spacing";

export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_BOTTOM_OFFSET = 12;

// Floating tab bar overlays scrollable content; screens under it should
// pad their scroll content by at least this much to avoid obscuring it.
export const TAB_BAR_CLEARANCE = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + Spacing.md;

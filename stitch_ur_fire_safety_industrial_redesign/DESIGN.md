---
name: Industrial Safety Protocol
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5a403e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8e706d'
  outline-variant: '#e2beba'
  surface-tint: '#b52424'
  primary: '#8f000d'
  on-primary: '#ffffff'
  primary-container: '#b22222'
  on-primary-container: '#ffc8c2'
  inverse-primary: '#ffb4ac'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#444545'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c5c5c'
  on-tertiary-container: '#d6d4d4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#92030f'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered for an industrial context, prioritizing clarity, authority, and safety compliance. It adopts a **Modern Industrial** aesthetic—a refinement of functionalism that values precision over decoration. The target audience includes facility managers, safety engineers, and regulatory bodies who require high-density information delivered with zero ambiguity.

The emotional response is one of "Engineering-Grade Reliability." The UI should feel like a piece of industrial equipment: sturdy, efficient, and built for purpose. Visual noise is eliminated to ensure that critical safety information and technical specifications remain the primary focus.

## Colors
The palette is rooted in the physical reality of industrial environments. 

- **Primary (Safety Red):** Used exclusively for call-to-actions, critical alerts, and branding accents. It is desaturated to maintain professional gravity while ensuring high visibility.
- **Secondary & Tertiary (Charcoal/Graphite):** These serve as the foundation for the interface, providing a high-contrast environment for technical data.
- **Background (Off-White):** A warm neutral that reduces eye strain during long periods of reading technical documentation or spec sheets, distinguishing the interface from generic white-label software.
- **Semantic Colors:** Success (Dark Green), Warning (Amber), and Info (Dark Blue) must be used sparingly and always in a muted, professional tone to avoid a "toy-like" appearance.

## Typography
The typography system uses **IBM Plex Sans** for its dual nature: it is a technical, systematic typeface that reflects engineering heritage. 

- **Headlines:** Utilize the Condensed variant of IBM Plex Sans to maximize information density and evoke the feel of technical manuals and blueprints.
- **Body:** Standard IBM Plex Sans provides exceptional legibility for long-form compliance text and service descriptions.
- **Technical Labels:** JetBrains Mono (monospaced) is used for serial numbers, technical specs, and data points to emphasize the precision-focused nature of fire safety engineering.
- **Hierarchy:** Maintain strict vertical rhythm. Large headlines should be reserved for section starts, while body text remains the workhorse of the interface.

## Layout & Spacing
The layout follows a **Rigid Grid System** based on a 4px baseline. This ensures all elements align with mathematical precision, reinforcing the engineering brand feel.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. Elements should snap to the grid lines without soft offsets.
- **Density:** Information density should be high. Use tight padding (8px or 12px) within technical components like data tables and spec cards to allow for maximum data visibility.
- **Breakpoints:**
  - **Desktop (1024px+):** 12 columns, wide margins.
  - **Tablet (768px - 1023px):** 8 columns, 24px margins.
  - **Mobile (Below 768px):** 4 columns, 16px margins, stack all sidebars.

## Elevation & Depth
In alignment with the industrial-utilitarian aesthetic, this design system rejects most shadows and blurs.

- **Flat Architecture:** Depth is communicated through **Tonal Layering** (e.g., a #EEEEEE container on a #F5F5F5 background).
- **Outlines:** Use 1px solid borders in #2D2D2D or #CCCCCC to define component boundaries. 
- **Active States:** Instead of a shadow, an active card or button is indicated by a thicker border (2px) or a background color shift.
- **Exception:** High-priority modals may use a subtle, sharp 4px shadow with 20% opacity to denote a temporary overlay without breaking the flat visual language.

## Shapes
The shape language is defined by **Sharp Corners (0px)**. 

Every UI element—from buttons to cards to input fields—must use right angles. This communicates a "no-nonsense," durable aesthetic suitable for industrial fire safety. Rounded corners are strictly prohibited as they introduce a softness that contradicts the engineering-led narrative. Horizontal and vertical lines are the primary separators, never diagonals or curves.

## Components
- **Buttons:** Rectangular, sharp edges. Primary buttons use the desaturated Red (#B22222) with white uppercase text. Secondary buttons use a Graphite (#4A4A4A) outline. No hover "glow"; use a simple 10% brightness shift.
- **Service Cards:** Styled as "Technical Spec Sheets." Include a small monospaced ID tag in the top right, a bold condensed heading, and a structured list of capabilities using hairline dividers.
- **Data Tables:** Highly dense with 1px borders. Header cells use Graphite background with white monospaced labels. Alternate row striping is permitted in light grey for readability.
- **Compliance Badges:** Rectangular containers with a thin border and a small industrial icon. Use high-contrast monochrome icons.
- **Emergency Banner:** A persistent, high-visibility block using a thick Red left-border and bold black text for immediate contact numbers.
- **Input Fields:** Bottom-border only or full 1px Graphite border. Use monospaced font for data entry to ensure character clarity.
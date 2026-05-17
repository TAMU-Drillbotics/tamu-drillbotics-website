# Document Editing

_Started 2026-05-17 00:11 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Tamu Drillbotics Website"
User is viewing file: Sponsors.html
Current date is now May 16, 2026
</system-info>

<default aesthetic>
If no references, art direction or design systems were provided, use this default professional modern, minimal aesthetic as a base. Declare your choice out loud so you stick to it. Guidance:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic>

<pasted_text name="Pasted text (160 lines)">
Create a new HTML file for The Rig page (TheRig.html). This is the most technical page on the TAMU Drillbotics website. It should feel like an engineering documentation portal — professional, clean, visually stunning, and dense with structured information. Pull the design language, typography, color system, grid elements, and aesthetic directly from the existing Hero.html, About.html, and Sponsors.html. This page should feel like the natural deepest layer of the site.
Design system (same as all pages):

Background: #FAFAFA
Text: #1A1A1A
Primary accent: #500000 (maroon)
Secondary accent: #C8963E (amber)
Headings: Chakra Petch
Body: Barlow
Monospaced labels, corner crosses, grid lines, section metadata bars

Include the same nav bar as Hero.html at the top.
Page structure (9 sections + footer):

1. 3D Rig Visualizer (Hero)
This is the page's centerpiece. Full viewport height, sets the tone for everything below.

Section metadata bar at top: "§ 01 RIG" left, "RIG-02 · BUILD CYCLE 1" center, "ISO VIEW · INTERACTIVE" right
Large dark bordered viewport (#0A0A0A or #1A1A1A background) occupying most of the section, taking ~70% of the available width on the left
Inside the viewport: placeholder text "3D MODEL · TBD" with crosshair, treated like the visual element placeholder on the landing page CTA but larger and more prominent
Below the viewport: a row of interaction hints in monospaced text ("DRAG TO ROTATE · SCROLL TO ZOOM · CLICK COMPONENT FOR DETAIL")
Right side (~30% width): a "Rig Overview" panel styled like the spec sheet from the landing page hero. Include:

"TAMU DRILLBOTICS / RIG-02" header
A few quick stats in label/value pairs: HEIGHT, WIDTH, WEIGHT, BIT TYPE, DRIVE SYSTEM, SENSOR COUNT, CONTROL SYSTEM, ESTIMATED COMPLETION (use realistic placeholder values like "1.2 M", "0.6 M × 0.6 M", "85 KG", "PDC · 12.5 MM", etc.)
A small "build phase" indicator (similar to the landing page spec sheet but condensed)


Generous corner crosses and grid lines, more pronounced on this hero section than elsewhere

2. System Architecture Diagram (interactive)

Section metadata bar: "§ 02 ARCHITECTURE" left, "SYSTEM TOPOLOGY" center, "INTERACTIVE" right
Heading (Chakra Petch): "How it all connects."
Brief intro (Barlow): "Every subsystem communicates through a unified data and power architecture. Hover any node to see its role."
Centerpiece: a large interactive system architecture diagram rendered as an SVG schematic

Show 4-5 major subsystem nodes (POWER, SENSORS, COMPUTE, ACTUATORS, SAFETY) connected by labeled lines indicating data flow direction and protocol (I2C, SPI, CAN, GPIO, etc.)
Each node is a labeled box with monospaced text
Connection lines are thin, with small arrows showing flow direction
Style it like a technical schematic, not a flowchart. Should feel like something you'd find in a real engineering document.
Hover states on nodes that would reveal more detail (placeholder tooltips for now)


Below the diagram: a legend in monospaced text explaining the connection types and color coding

3. Mechanical Section

Section metadata bar: "§ 03 MECHANICAL" left, "STRUCTURE · DRILLSTRING · HYDRAULICS" center
Heading (Chakra Petch): "Materials, design, physics."
Two-column layout:

Left column: narrative paragraph explaining the mechanical engineering involved. Frame construction (8020 aluminum extrusion, structural analysis), drillstring design (bit selection, hydraulic flow, weight-on-bit considerations), safety systems (plexiglass enclosure, E-stop, activation interlocks).
Right column: a structured data panel listing key mechanical specs and design considerations in label/value pairs. Style it like a materials/components reference sheet.


Below the two columns: a horizontal strip of subsystem callouts (DRILLSTRING / FRAME / SAFETY), each with a monospaced label, one-line summary, and a small status indicator
Subtle technical diagram or wireframe illustration placeholder somewhere in the section

4. Electronics Section

Section metadata bar: "§ 04 ELECTRONICS" left, "HARDWARE · SENSORS · POWER" center
Heading (Chakra Petch): "From signal to actuator."
Two-column layout similar to Mechanical:

Left column: narrative about the electronics subsystem. Sensor selection and integration (pressure, torque, RPM, depth, vibration), motor drivers, power distribution, the central electronics enclosure that houses the STM32 and supporting circuitry.
Right column: a sensor stack table styled like a spec reference sheet. Columns: SENSOR / TYPE / INTERFACE / SAMPLING RATE / PURPOSE. Include 6-10 placeholder rows with realistic values.


Bottom of section: a small PCB or schematic-style illustration placeholder

5. Software Section (with interactive control loop)

Section metadata bar: "§ 05 SOFTWARE" left, "FIRMWARE · CONTROL · INTEGRATION" center
Heading (Chakra Petch): "Code that controls steel."
This section gets more visual weight than the others because it contains the interactive control loop
Left side: narrative about the software stack. Embedded C firmware on STM32 microcontroller, real-time control loop, PID algorithms for drill speed/torque/feed rate, ML interfacing layer that pipes sensor data to inference and receives control adjustments.
Right side: Interactive Control Loop Diagram

A circular or oblong flow diagram showing the control loop: SENSORS → SIGNAL CONDITIONING → PID CONTROLLER → ML INFERENCE → ACTUATOR COMMANDS → DRILL → (back to SENSORS)
Each stage rendered as a labeled node with monospaced text
Connecting arrows between stages with subtle directional indicators
Hover states on each node revealing what happens at that stage (placeholder tooltips)
Animation hint: small particles or dashed line segments traveling along the loop to suggest active data flow (purely placeholder for now, design intent only)


Below the control loop: a stats strip showing sampling rate, control loop frequency, response latency in monospaced label/value pairs

6. Data Section

Section metadata bar: "§ 06 DATA" left, "ML · INFERENCE · SENSOR FUSION" center
Heading (Chakra Petch): "Sensor fusion meets machine learning."
Three-column layout for this section (more structured, less prose-heavy):

Column 1 — SENSOR FUSION: brief paragraph about combining multi-modal sensor inputs into unified state estimates. Below the paragraph: a small visualization placeholder (think Kalman filter conceptual diagram).
Column 2 — MODEL TRAINING: brief paragraph about offline ML training pipeline. Stack: PyTorch/TensorFlow, training datasets, model checkpointing. Below: small training pipeline diagram placeholder.
Column 3 — REAL-TIME INFERENCE: brief paragraph about deploying models for on-rig inference. Hardware: dedicated GPU compute, CUDA acceleration. Below: small inference pipeline diagram placeholder.


Bottom of section: a model performance metrics panel in monospaced format (accuracy, latency, throughput placeholders)

7. Specs / Summary Card

Section metadata bar: "§ 07 SPECIFICATIONS" left, "FULL SYSTEM SPEC SHEET" center
Heading (Chakra Petch): "At a glance."
A large, structured spec sheet panel taking up most of the section, styled like a full technical datasheet:

Multiple columns of label/value pairs grouped by category (MECHANICAL, ELECTRICAL, SOFTWARE, DATA, PERFORMANCE)
Each category has its own monospaced header
Values are placeholder but should look realistic (dimensions, weights, voltages, RPMs, sampling rates, model accuracy, etc.)
Thin dividers between categories
This should look like something you'd hand to an industry partner or pin to a lab wall



8. Roadmap

Section metadata bar: "§ 08 ROADMAP" left, "BUILD TIMELINE · 2025-26 CYCLE" center
Heading (Chakra Petch): "What's next."
A horizontal or vertical timeline showing build milestones:

Phase 1 — STRUCTURAL ASSEMBLY (status: COMPLETE)
Phase 2 — HOIST/ELEVATOR INTEGRATION (status: COMPLETE)
Phase 3 — DRIVETRAIN BRING-UP (status: IN PROGRESS)
Phase 4 — SENSOR ARRAY INSTALLATION (status: NEXT)
Phase 5 — CONTROL SOFTWARE INTEGRATION (status: PLANNED)
Phase 6 — ML PIPELINE DEPLOYMENT (status: PLANNED)
Phase 7 — AUTONOMOUS TESTING (status: PLANNED)
Phase 8 — COMPETITION READINESS (status: PLANNED)


Each phase has: phase number, name, target date placeholder, status indicator (color-coded: maroon for complete, amber for in progress, grey for planned)
The active/in-progress phase should be visually emphasized
Subtle progress bar across the entire timeline showing overall build completion percentage

9. CTA Section

Full-width #1A1A1A black background with generous padding
Compact CTA inviting visitors to join the team after seeing the technical depth
Two CTA cards side by side, same style as About page:

Card 1 (maroon): "01" / "THE TEAM" / "Want to build this?" / "Open roles across mechanical, electrical, software, and ML. Find where you fit." / "APPLY NOW →" → /apply
Card 2 (dark): "02" / "THE PARTNERS" / "Support the work." / "Sponsor a year of engineering, R&D, and student development." / "BECOME A SPONSOR →" → /sponsors



10. Footer

Same footer as all other pages. Identical layout, content, and styling.


Overall direction:

This page is the credibility heavyweight. It should feel like a technical product page from a company like SpaceX, Boston Dynamics, or Anduril — dense with information, visually disciplined, no fluff.
Every section should reinforce the engineering depth and rigor of the team
Heavy use of monospaced metadata, structured data panels, and technical diagrams
The narrative paragraphs should be confident and direct, not academic
Generous use of grid lines, corner crosses, and document-style notation to create a "blueprint" feel
Visual hierarchy should guide the reader: hero → architecture → discipline-specific deep dives → specs → roadmap → CTA
Desktop viewport only
</pasted_text>

<!-- The user attached a local folder named "tamu-drillbotics". It may contain a codebase, design components, or other files. Explore it with local_ls("tamu-drillbotics") — all paths into this folder must start with "tamu-drillbotics/". -->


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: list_files]_

_[tool: local_ls]_

_[tool: read_file]_

_[tool: update_todos]_

I've got the design language locked in from Hero.html. Building TheRig.html now — same nav/footer, same color tokens, same monospaced metadata bars, corner registration marks, and grid system. I'll keep the design original (not mimicking specific branded UIs).

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built **TheRig.html** — a 9-section technical deep-dive that picks up the exact design language from Hero.html (Chakra Petch/Barlow/JetBrains Mono, maroon + amber accents, monospaced metadata bars, corner registration marks, dashed dividers, 80px grid background).

Highlights:
- **§01 Visualizer** — full-height dark viewport with placeholder + ISO axis indicators, right-side RIG-02 spec sheet, interaction hints below
- **§02 Architecture** — labeled SVG schematic with 5 subsystem nodes connected by I2C/SPI/CAN/GPIO buses (color-coded), hover tooltips on each node, legend strip below
- **§03 Mechanical / §04 Electronics** — two-column narrative + reference sheet (mechanical components panel, 10-row sensor stack table), subsystem callouts strip, wireframe placeholder
- **§05 Software** — interactive 6-stage control loop SVG with animated dashed flow lines (`@keyframes flow`), ML advisory branch in amber, sampling/control/latency/jitter stats strip
- **§06 Data** — 3-column SENSOR FUSION / TRAINING / INFERENCE with mini SVG diagrams, 5-metric performance bar
- **§07 Specs** — 5-column datasheet card (Mechanical / Electrical / Software / Data / Performance)
- **§08 Roadmap** — 8 phases in a single row with progress bar, color-coded statuses (maroon=done, amber=active, grey=planned), active phase visually elevated
- **§09 CTA + Footer** — black slab with maroon + dark cards matching the About page pattern

Tooltip script binds to both arch and loop nodes for the hover-detail interaction.

## User

remove the "how it all connects" section, change the "from signal to actuator" section table to have tbd after the fourth sensor and remove the carrier board layout box underneath. remove the "at a glance" section as well

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now I have what I need. Making the three edits:

_[tool: str_replace_edit]_

_[tool: run_script]_

Let me actually remove the section entirely instead of hiding it:Now let me style the TBD rows subtly so they read as placeholders, and verify:

_[tool: str_replace_edit]_

_[tool: done]_

Done. Three edits applied:

- Removed **§ 02 — How it all connects** (architecture diagram section)
- In **§ 04 — From signal to actuator**: kept the first 4 sensor rows (PT-01 / TQ-01 / RPM-01 / DPT-01) and replaced rows 5–10 with greyed-out `TBD` placeholders
- Removed the **PCB-WF-01 carrier board** wire-strip below the table
- Removed **§ 07 — At a glance** (full system spec sheet section)

Section numbering in the page bars (§ 03, § 05, § 06, § 08, § 09) and slice numbers in the corners are kept as-is — let me know if you want me to renumber them sequentially.


# TAMU Drillbotics — Website Structure

## Design System (Locked)

- **Background:** `#0A0A0A` (near-black)
- **Accent:** `#500000` (maroon)
- **Text:** `#E0E0E0` (silver)
- **Display Font:** Outfit 700
- **UI/Subheadings:** Space Grotesk
- **Body:** DM Sans 400
- **Hero Effect:** Interactive particle network (70 particles, speed 1, range 120) + subtle radial maroon glow
- **Label Treatment:** "TEXAS A&M UNIVERSITY" — Space Grotesk 300, wide letter-spacing, small-caps

---

## Route Map

| Route | Page | Nav Label | Priority |
|---|---|---|---|
| `/` | Landing / Home | Home | MVP |
| `/about` | About + Team (anchor-linked) | About | MVP |
| `/project` | Rig Technical Deep-Dive | The Rig | Post-MVP |
| `/apply` | Recruitment / Outreach | Apply | MVP |
| `/sponsors` | Sponsor Showcase + Tier Info | Sponsors | MVP |

**Aliases (Next.js redirects in `next.config.js`):**

- `/join` → `/apply`
- `/recruit` → `/apply`
- `/team` → `/about#team`

---

## Page Breakdowns

### `/` — Landing / Home

The front door. Immediately communicates what this team is and why it matters. Should feel polished and technically credible.

**Sections (scroll order):**

1. **Hero**
   - Particle network animation (full viewport background)
   - Team name lockup + "TEXAS A&M UNIVERSITY" label
   - One-line elevator pitch (e.g., "Designing and programming autonomous drilling rigs.")
   - Primary CTA: "Join the Team" → `/apply`
   - Secondary CTA: "See the Rig" → `/project`

2. **Mission / Goals**
   - 2–3 concise value statements about what the org aims to achieve
   - Can be rendered as a minimal grid or staggered text blocks — avoid bullet lists

3. **Sponsor Strip**
   - Horizontal logo bar, grayscale logos with hover-to-color effect
   - "Become a Sponsor" link → `/sponsors`
   - If sponsor count is small, use a subtle treatment so it doesn't look empty

4. **Footer**
   - Social links (Instagram, LinkedIn, Discord)
   - Quick nav links
   - University/org affiliation line

---

### `/about` — About + Team

Single scrollable page covering the competition, the team's role in it, and the people. Anchor-linked sections for direct navigation.

**Sections (scroll order):**

1. **`#competition` — The Competition**
   - What SPE Drillbotics / DSATS actually is — brief explainer
   - General project scope: design, build, and autonomously operate a miniature drilling rig
   - Competition timeline placeholder (TBD until fall semester — render as an empty/coming-soon state, not a broken section)

2. **`#what-we-do` — What We Do**
   - What TAMU Drillbotics specifically does within the competition framework
   - Highlight the interdisciplinary nature: mechanical, electrical, software, ML
   - Optional: short embedded video or photo carousel of the team working

3. **`#team` — The Team**
   - Subteam taxonomy, displayed as an interactive org-chart, card grid, or accordion

   **Subteam Structure:**

   - **Mechanical**
     - *Drillstring* — hydraulics, bit manufacturing
     - *Safety* — plexiglass enclosure, annual safety report, activation light, hydraulic systems, E-stop
     - *Frame* — dolly frame, structural assembly
   - **Electrical**
     - *Electronics* — sensors, motors/drivers, electronics box
     - *Software* — embedded C firmware (STM32), ML interfacing, PID control algorithms
   - **Algorithm**
     - *GPU* — dedicated ML compute hardware, CUDA pipeline
     - *Data* — sensor fusion, analytics
     - *ML* — model development (PyTorch, TensorFlow, etc.)
   - **Marketing**
     - TBD — define scope (social media, sponsor relations, recruitment content)

4. **`#benefits` — Why Students Join**
   - Tangible benefits: hands-on engineering, resume material, competition travel, industry exposure
   - Consider embedding short video clips or quotes from current members (post-MVP)

---

### `/project` — Rig Technical Deep-Dive

The credibility page. This is where technically-minded recruits and sponsors see the engineering substance behind the team.

**Sections (scroll order):**

1. **3D Rig Visualizer (Hero/Background)**
   - Interactive 3D model of the current year's rig, hovering and slowly rotating
   - Source: export teammate's AutoCAD model → `.glTF`/`.glb` format
   - Render via Three.js (`@react-three/fiber` + `@react-three/drei` in Next.js)
   - User interaction: click-drag to rotate, scroll to zoom, hover subcomponents for labels
   - Fallback: static rendered image for mobile or low-performance devices

2. **System Architecture Diagram**
   - High-level block diagram showing how mechanical, electrical, and algorithm subsystems interconnect
   - Could be an SVG with hover states revealing details per subsystem

3. **Sensor Stack**
   - Table or spec-sheet-style layout: sensor name, type, interface (I2C/SPI/analog), role in control loop
   - Keep it dense and technical — this page is for people who care about the details

4. **Control Loop**
   - Flowchart: sensor input → data processing → ML inference → PID output → actuator response
   - Annotate with communication protocols and sampling rates where known

5. **Specs Sidebar / Summary Card**
   - Key numbers at a glance: rig dimensions, motor specs, compute platform, sensor count, etc.

6. **Future Features / Roadmap** *(optional, post-MVP)*
   - What's planned for next competition cycle

---

### `/apply` — Recruitment / Outreach

Convert interested students into applicants. Should feel professional but not corporate — it's a student org, not a job board.

**Sections (scroll order):**

1. **Hero / Hook**
   - "Build something real." or similar — short, punchy
   - Brief value proposition (1–2 sentences)

2. **Why Join**
   - Expand on benefits: technical skill development, team-based engineering, competition experience, networking
   - Keep it scannable but not a bullet dump

3. **Who We're Looking For**
   - Target majors: mechanical engineering, petroleum engineering, computer engineering, computer science, electrical engineering, data science
   - Target skills/interests by subteam (doesn't need to be exhaustive — "if you're interested, apply")
   - Explicitly state: no prior experience required for most roles

4. **Application Timeline & Process**
   - Timeline: when applications open, review period, interviews (if any), decisions
   - Placeholder state if timeline isn't set yet
   - Process overview: apply → review → [interview?] → offer

5. **Application Form**
   - **Embedded Tally form** — professional-looking, supports conditional logic and file uploads
   - Styled to match the site's design system (Tally supports custom CSS on paid plan; otherwise iframe with wrapper styling)
   - No Google Forms — agreed, it undercuts the site's credibility
   - Post-MVP: Tally webhook → n8n → AI-assisted scoring/summarization → output to Notion or Airtable

6. **FAQ**
   - Accordion component
   - Cover: time commitment, meeting schedule, can I join mid-semester, do I need experience, what subteam should I pick

---

### `/sponsors` — Sponsor Showcase

Dedicated linkable route for sponsor visibility. Sponsors can point internally to this URL.

**Sections (scroll order):**

1. **Sponsor Tier Display**
   - Tiered layout (e.g., Platinum / Gold / Silver or custom naming)
   - Larger logos and more prominence for higher tiers
   - Even if tiers aren't finalized, build the structure — placeholder with one or two logos is fine for MVP

2. **Why Sponsor Us**
   - Brief pitch: what sponsors get (logo placement, event access, recruiting pipeline, tax-deductible contribution if applicable)

3. **Sponsorship Packet / Contact CTA**
   - "Interested in sponsoring?" with a contact email or simple form
   - Optional: link to downloadable sponsorship packet (PDF)

---

## MVP vs. Post-MVP

### MVP — Ship First

Core pages and content that must exist for the site to be functional and credible.

| Item | Page | Notes |
|---|---|---|
| Hero section with particle animation | `/` | Animation already spec'd |
| Mission/goals content | `/` | Copywriting needed |
| Sponsor logo strip | `/` | Even with 1–2 logos |
| Competition explainer | `/about#competition` | Static content |
| What we do section | `/about#what-we-do` | Static content |
| Subteam taxonomy display | `/about#team` | Card grid or accordion |
| Recruitment value prop + who we're looking for | `/apply` | Static content |
| Embedded Tally form | `/apply` | Tally free tier works |
| FAQ accordion | `/apply` | 5–8 questions |
| Sponsor tier layout | `/sponsors` | Placeholder-ready |
| Sponsor contact CTA | `/sponsors` | Email link minimum |
| Responsive nav + footer | Global | Mobile-first |
| `/join` and `/recruit` aliases | Config | `next.config.js` redirects |

### Post-MVP — Iterate After Launch

Features that add significant value but aren't blockers for having a live, credible site.

| Item | Page | Notes |
|---|---|---|
| 3D rig visualizer (Three.js) | `/project` | Requires AutoCAD → glTF export pipeline |
| System architecture diagram | `/project` | SVG with hover states |
| Sensor stack + control loop docs | `/project` | Needs technical input from subteams |
| Specs sidebar | `/project` | Data collection required |
| Member video/photo content | `/about#benefits` | Content production dependency |
| Competition timeline (populated) | `/about#competition` | Blocked until fall semester |
| Application timeline (populated) | `/apply` | Blocked until recruitment cycle |
| Tally → n8n → AI scoring pipeline | `/apply` backend | Wire after form is live and collecting data |
| AI-assisted application summarization | Backend | Notion/Airtable output |
| Custom Tally form styling | `/apply` | Tally paid plan or CSS override |
| Sponsorship packet PDF | `/sponsors` | Design + content dependency |
| Testimonials / "what to expect" section | `/about` or standalone | Content production dependency |
| Blog/updates | N/A | Handled via Discord — not on website |

---

## Technical Notes

- **Framework:** Next.js + Tailwind CSS
- **Deployment:** Vercel
- **Forms:** Tally (embedded), Formspree as fallback
- **3D Rendering (post-MVP):** Three.js via `@react-three/fiber`, model in `.glTF`/`.glb`
- **Security:** Cloudflare (DDoS proxy), Vercel SSL, hCaptcha or Cloudflare Turnstile on forms, env vars for secrets
- **CMS (if needed later):** Sanity or Contentful for dynamic content (team bios, sponsor logos, project specs)

## Open Questions

- [ ] Marketing subteam scope — what falls under their umbrella on the site?
- [ ] Sponsor tier naming and structure — finalize before building the layout
- [ ] Application process details — interviews? Rolling or batch review?
- [ ] Who writes the copy for About/Competition/Mission sections?
- [ ] AutoCAD model export feasibility — can teammate produce a web-ready `.glb`?
- [ ] Tally free tier limitations — does it cover file uploads and conditional logic at no cost?

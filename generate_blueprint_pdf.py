import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_OUTPUT_PATH = r"c:\Users\Antriksh\Downloads\genowlbygooglestudio\Genowl_Studio_Architectural_Blueprint.pdf"

class NumberedCanvas(canvas.Canvas):
    """Canvas that enables multi-pass 'Page X of Y' footers and running headers."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Don't draw headers/footers on cover page
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#71717a"))
            self.drawString(40, 810, "GENOWL STUDIO — ARCHITECTURAL BLUEPRINT & METHODOLOGY")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#a1a1aa"))
            self.drawRightString(555, 810, "CONFIDENTIAL & PROPRIETARY")
            
            # Header Line
            self.setStrokeColor(colors.HexColor("#e4e4e7"))
            self.setLineWidth(0.75)
            self.line(40, 802, 555, 802)
            
            # Footer Line
            self.line(40, 45, 555, 45)
            
            # Footer
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#71717a"))
            self.drawString(40, 32, "Genowl Studio © 2026 • genowlai@gmail.com • Instagram: @genowl_tech")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(555, 32, page_text)

        self.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_DARK = colors.HexColor("#0d140f")
    C_GOLD = colors.HexColor("#b8860b")
    C_GREEN = colors.HexColor("#1b5e20")
    C_BG_LIGHT = colors.HexColor("#f8fafc")
    C_BORDER = colors.HexColor("#cbd5e1")
    C_TEXT = colors.HexColor("#1e293b")
    C_MUTED = colors.HexColor("#64748b")
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=C_DARK,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=C_GOLD,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=C_DARK,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_GREEN,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=C_TEXT,
        spaceAfter=6
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14.5,
        textColor=C_DARK
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=C_TEXT,
        leftIndent=14,
        spaceAfter=3
    )

    story = []

    # --- COVER / TITLE BLOCK ---
    story.append(Paragraph("GENOWL STUDIO", title_style))
    story.append(Paragraph("System Blueprint, Product Insights & The 3D WebGL Production Roadmap", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_GOLD, spaceBefore=2, spaceAfter=12))

    # Meta Overview Box
    meta_data = [
        [
            Paragraph("<b>Executive Lead:</b> Antriksh Soun (Genowl)", body_style),
            Paragraph("<b>Project Version:</b> Genowl 2.0 (Production)", body_style)
        ],
        [
            Paragraph("<b>Official Channel:</b> genowlai@gmail.com", body_style),
            Paragraph("<b>Production Staging:</b> Hostinger Cloud", body_style)
        ],
        [
            Paragraph("<b>Architecture:</b> React 18 + Express + Supabase + WebGL", body_style),
            Paragraph("<b>Target Turnaround:</b> 48 - 72 Hours (100% IP Transfer)", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[255, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # --- SECTION 1: CORE PHILOSOPHY & BUSINESS MODEL ---
    story.append(Paragraph("1. Executive Vision & Core Philosophy", h1_style))
    
    # Philosophy Quote Box
    quote_data = [[
        Paragraph(
            '<b>Our Foundational Principle:</b><br/>'
            '<i>"In today\'s world, everybody knows that for almost every service possible there is an AI tool. '
            'But of course people don\'t have the time to use and master every tool. '
            'That is exactly why you choose Genowl: all you have to do is buy our service and tell us what to build — '
            'the rest is on us."</i>',
            callout_style
        )
    ]]
    quote_table = Table(quote_data, colWidths=[515])
    quote_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('LINELEFT', (0,0), (0,0), 3.5, C_GREEN),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#bbf7d0")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(quote_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Transparent Service Structure & Pricing Tiers", h2_style))
    
    pricing_data = [
        [
            Paragraph("<b>Tier / Service</b>", body_style),
            Paragraph("<b>Price</b>", body_style),
            Paragraph("<b>Turnaround</b>", body_style),
            Paragraph("<b>Core Deliverables & Specifications</b>", body_style)
        ],
        [
            Paragraph("<b>2D Responsive Website</b>", body_style),
            Paragraph("<b>$500</b> Flat", body_style),
            Paragraph("48 - 72h", body_style),
            Paragraph("High-converting, mobile-first responsive architecture, semantic React/Vite code, SEO 95+, 100% full IP ownership.", body_style)
        ],
        [
            Paragraph("<b>3D Interactive WebGL</b>", body_style),
            Paragraph("<b>$2,500</b> Flat", body_style),
            Paragraph("48 - 72h", body_style),
            Paragraph("Cinema-grade 3D digital worlds, Three.js canvas, scroll-driven camera choreography, GLTF Draco compression, 60 FPS mobile/desktop GPU optimization.", body_style)
        ],
        [
            Paragraph("<b>Video Generation Sprint</b>", body_style),
            Paragraph("<b>$99</b> Flat", body_style),
            Paragraph("24 - 48h", body_style),
            Paragraph("High-impact commercials, promotional reels, and brand visual narratives rendered via cutting-edge diffusion engines.", body_style)
        ],
        [
            Paragraph("<b>Personalized AI Automation</b>", body_style),
            Paragraph("<b>$99</b> Flat", body_style),
            Paragraph("24 - 48h", body_style),
            Paragraph("Custom customer service chatbots, intelligent context engineering, operational workflow automation.", body_style)
        ],
        [
            Paragraph("<b>Content Creation Package</b>", body_style),
            Paragraph("<b>$99</b> Flat", body_style),
            Paragraph("24 - 48h", body_style),
            Paragraph("Conversion sales copywriting, branded social media asset suites, editorial calendars, launch articles.", body_style)
        ],
    ]
    pricing_table = Table(pricing_data, colWidths=[120, 65, 65, 265])
    pricing_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0d140f")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(pricing_table)
    story.append(Spacer(1, 14))

    # --- SECTION 2: SYSTEM ARCHITECTURE & ENGINEERING DECISIONS ---
    story.append(Paragraph("2. Technical Architecture & Engineering Decisions", h1_style))
    story.append(Paragraph(
        "Over our development cycle, every component was meticulously engineered to provide enterprise security, "
        "flawless cross-device ergonomics, and frictionless customer conversions:",
        body_style
    ))
    
    story.append(Paragraph("<b>A. Fortified Master Admin Security:</b>", h2_style))
    story.append(Paragraph("• <b>Permanently Locked Master Password:</b> Standardized across the entire platform to <code>CristianoMessi@2005</code>.", bullet_style))
    story.append(Paragraph("• <b>Zero Setup Vulnerability:</b> The initial 'Setup Master Password' UI was permanently deleted. Any session on any domain, mobile phone, or desktop immediately requires master credentials.", bullet_style))
    story.append(Paragraph("• <b>Web Modification Disabled:</b> Password updating forms were removed from the client interface to guarantee no unauthorized browser overwrites.", bullet_style))
    story.append(Paragraph("• <b>Universal Access:</b> Accessible directly from both Desktop Navbar, Mobile Drawer, and persistent Footers.", bullet_style))

    story.append(Paragraph("<b>B. Mandatory Account Authentication for Inquiries & Orders:</b>", h2_style))
    story.append(Paragraph("• <b>Spam & Impersonation Prevention:</b> Visitors must be logged into a verified account before submitting project briefs or problem tickets.", bullet_style))
    story.append(Paragraph("• <b>Identity Binding:</b> Submissions automatically lock to the client's verified name and email, presenting personalized confirmations (<i>'Thank you, [Name]!'</i>).", bullet_style))

    story.append(Paragraph("<b>C. Validated Phone / WhatsApp Capture:</b>", h2_style))
    story.append(Paragraph("• <b>Glitch-Free Input:</b> Engineered to accept international numbers (e.g. <code>+91 98765 43210</code>) without cursor jumping or formatting bugs.", bullet_style))
    story.append(Paragraph("• <b>Direct Lead Stream:</b> Validated phone numbers are sent directly to the database and email forwarding desk for immediate WhatsApp/phone outreach.", bullet_style))

    story.append(Paragraph("<b>D. Central Cloud Database (Supabase PostgreSQL):</b>", h2_style))
    story.append(Paragraph("• <b>Global Real-Time Sync:</b> Orders and inquiries stream live to Supabase tables (<code>genowl_orders</code>, <code>genowl_inquiries</code>, <code>genowl_users</code>).", bullet_style))
    story.append(Paragraph("• <b>Permanent Lead Vault:</b> Client inquiries and phone numbers are safely stored in cloud PostgreSQL, protected from browser cache wipes.", bullet_style))

    story.append(Paragraph("<b>E. Bulletproof Lead Forwarding to Official Gmail:</b>", h2_style))
    story.append(Paragraph("• <b>Dual-Channel Architecture:</b> Employs zero-config direct webhook dispatch via FormSubmit directly to <code>genowlai@gmail.com</code> combined with Resend API fallback.", bullet_style))
    story.append(Paragraph("• <b>Branded Client Confirmation:</b> Clients receive automated HTML receipts embedded with the official Golden Owl insignia.", bullet_style))

    story.append(PageBreak())

    # --- SECTION 3: THE 3D WEBSITE PRODUCTION ROADMAP ("OUR WAY") ---
    story.append(Paragraph("3. The Proprietary 3D WebGL Production Roadmap (\"Our Way\")", h1_style))
    story.append(Paragraph(
        "At Genowl Studio, our <b>$2,500 3D Website tier</b> is engineered to position brands in the top 1% of the internet. "
        "Rather than relying on generic page builders or heavy, laggy assets, we employ a battle-tested, cinema-grade WebGL architecture. "
        "Here is our complete step-by-step roadmap for building 3D interactive experiences:",
        body_style
    ))
    story.append(Spacer(1, 4))

    stages = [
        ("Phase 1: Creative Concept & Camera Storyboarding", [
            "<b>Scroll Narrative Definition:</b> Mapping the brand's core pitch to an interactive journey.",
            "<b>Virtual Spline Design:</b> Defining 3D camera translation (X, Y, Z) and rotation vectors parameterized between scroll values 0.0 (entry) to 1.0 (conclusion).",
            "<b>Focal Keyframes:</b> Aligning 3D object angles with high-converting copy and CTA buttons."
        ]),
        ("Phase 2: 3D Asset Modeling & Texture Baking Pipeline", [
            "<b>Precision Hard-Surface & Organic Modeling:</b> Sculpted in Blender / Cinema4D with strict polygon budgets (< 50,000 tris).",
            "<b>PBR Texture Baking:</b> Consolidating Diffuse, Normal, Roughness, Metallic, and Ambient Occlusion into unified 2K atlases.",
            "<b>Draco & Meshopt Compression:</b> Compressing raw 80MB 3D meshes down to 1.5MB - 3.5MB GLTF/GLB containers for instantaneous web loading."
        ]),
        ("Phase 3: Three.js & WebGL Canvas Engine", [
            "<b>Non-Blocking Background Rendering:</b> Isolated Three.js WebGLRenderer mounted on a fixed, pointer-transparent canvas.",
            "<b>Custom GLSL Shaders:</b> Atmospheric fog, particle dust dynamics, refractive glass, and glowing energy fields.",
            "<b>Cinematic Post-Processing:</b> Tone mapping (ACESFilmic), selective bloom on emissive elements, and subtle depth-of-field blur."
        ]),
        ("Phase 4: Hybrid Canvas + DOM Layering (The Secret Sauce)", [
            "<b>Zero-Jank Lerp Physics:</b> Smooth linear interpolation (lerp factor: 0.05 - 0.08) tying mouse wheel and touch drags to camera translation.",
            "<b>Decoupled HTML Overlay:</b> All headings, prices ($500 / $2,500), and forms live in semantic React DOM layers above the canvas, ensuring 100% SEO indexing and accessibility.",
            "<b>Scroll-Triggered Section Gates:</b> Kinetic text reveals synchronize precisely as 3D models orbit into focal position."
        ]),
        ("Phase 5: Mobile GPU Ergonomics & 60 FPS Performance Budget", [
            "<b>DPR Clamping:</b> Clamping device pixel ratio to <code>Math.min(window.devicePixelRatio, 2)</code> to prevent thermal throttling on 4K mobile displays.",
            "<b>Dynamic LOD & Shader Downsampling:</b> Automatically simplifying complex geometry and disabling heavy post-processing on mobile GPUs.",
            "<b>Touch Gesture Normalization:</b> Fluid vertical touch scrolling with <code>-webkit-overflow-scrolling: touch</code> and zero horizontal viewport drift."
        ]),
        ("Phase 6: Cloud Deployment & Client Handover", [
            "<b>CDN Edge Caching:</b> GLB assets and frame sequences cached globally via HTTP <code>stale-while-revalidate</code> headers.",
            "<b>100% Full IP Transfer:</b> Client receives full React/Vite source code, Blender 3D master files, textures, and deployment documentation within 48 to 72 hours."
        ])
    ]

    for title, points in stages:
        story.append(Paragraph(title, h2_style))
        for p in points:
            story.append(Paragraph(f"• {p}", bullet_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # --- SECTION 4: ARCHITECTURAL SUMMARY TABLE ---
    story.append(Paragraph("4. System Specification Summary", h1_style))
    
    spec_data = [
        [Paragraph("<b>Component Layer</b>", body_style), Paragraph("<b>Technology / Implementation</b>", body_style), Paragraph("<b>Function & Benefit</b>", body_style)],
        [
            Paragraph("<b>Frontend Framework</b>", body_style),
            Paragraph("React 18 + Vite + TypeScript", body_style),
            Paragraph("Instant HMR, typed component boundaries, sub-4s production builds.", body_style)
        ],
        [
            Paragraph("<b>Styling Engine</b>", body_style),
            Paragraph("Tailwind CSS + Custom Obsidian Tokens", body_style),
            Paragraph("Bespoke glassmorphism, responsive touch ergonomics, zero runtime overhead.", body_style)
        ],
        [
            Paragraph("<b>Interactive 3D Engine</b>", body_style),
            Paragraph("Canvas 240-Frame Lerp + Three.js WebGL", body_style),
            Paragraph("Cinema-grade visual fidelity running at 60 FPS across mobile and desktop.", body_style)
        ],
        [
            Paragraph("<b>Cloud PostgreSQL</b>", body_style),
            Paragraph("Supabase Cloud Database (RLS Secured)", body_style),
            Paragraph("Real-time persistent lead storage for inquiries, phone numbers, and orders.", body_style)
        ],
        [
            Paragraph("<b>Lead Dispatch Desk</b>", body_style),
            Paragraph("FormSubmit Webhook + Resend REST API", body_style),
            Paragraph("Guaranteed inbox arrival to genowlai@gmail.com with zero configuration.", body_style)
        ],
        [
            Paragraph("<b>Payment Processing</b>", body_style),
            Paragraph("Razorpay Indian & International Gateway", body_style),
            Paragraph("Instant UPI (GPay, PhonePe), RuPay/Visa/MasterCard, and Net Banking.", body_style)
        ],
        [
            Paragraph("<b>Hosting & Deployment</b>", body_style),
            Paragraph("Hostinger Cloud + Express Server Bridge", body_style),
            Paragraph("Automatic Git CI/CD deployments directly from GitHub main repository.", body_style)
        ],
    ]
    spec_table = Table(spec_data, colWidths=[110, 160, 245])
    spec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_DARK),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 14))

    # Concluding Sign-off Box
    signoff_data = [[
        Paragraph(
            "<b>Genowl Studio Engineering Commitment:</b><br/>"
            "This document establishes the official architectural baseline and operational standard for Genowl Studio. "
            "Every client website, 3D experience, and AI integration produced follows these guidelines strictly to ensure "
            "unmatched speed, cinema-grade aesthetics, and sustainable client growth.",
            body_style
        )
    ]]
    signoff_table = Table(signoff_data, colWidths=[515])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fefce8")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fef08a")),
        ('LINELEFT', (0,0), (0,0), 3.5, C_GOLD),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(signoff_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated executive PDF at: {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()

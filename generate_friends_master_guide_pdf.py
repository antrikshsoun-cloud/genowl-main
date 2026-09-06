import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

BASE_DIR = r"c:\Users\Antriksh\Downloads\genowlbygooglestudio"
OUTPUT_PDF = os.path.join(BASE_DIR, "Genowl_Master_3D_Website_and_Voice_Guide.pdf")

class NumberedCanvas(canvas.Canvas):
    """Multi-pass canvas for dynamic 'Page X of Y' headers and footers."""
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
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#334155"))
            self.drawString(40, 810, "THE DEFINITIVE 3D WEB & AI VOICE MASTERCLASS — GENOWL BLUEPRINT")

            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#94a3b8"))
            self.drawRightString(555, 810, "STEP-BY-STEP COMPLETE HANDBOOK")

            # Header Rule
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.75)
            self.line(40, 802, 555, 802)

            # Footer Rule
            self.line(40, 45, 555, 45)

            # Footer
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(40, 32, "Engineered by Antriksh & Antigravity IDE • genowl.tech • Free Educational Edition")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(555, 32, page_text)
        self.restoreState()


def get_styles():
    base = getSampleStyleSheet()
    styles = {}

    styles['CoverPre'] = ParagraphStyle(
        'CoverPre',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#16a34a'),
        textTransform='uppercase',
        spaceAfter=6
    )
    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle',
        parent=base['Title'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        alignment=0,
        spaceAfter=10
    )
    styles['CoverSub'] = ParagraphStyle(
        'CoverSub',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14
    )
    styles['H1'] = ParagraphStyle(
        'H1',
        parent=base['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    styles['H2'] = ParagraphStyle(
        'H2',
        parent=base['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    styles['Body'] = ParagraphStyle(
        'Body',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    styles['BodyBold'] = ParagraphStyle(
        'BodyBold',
        parent=styles['Body'],
        fontName='Helvetica-Bold'
    )
    styles['Callout'] = ParagraphStyle(
        'Callout',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=13,
        textColor=colors.HexColor('#14532d')
    )
    styles['PromptBox'] = ParagraphStyle(
        'PromptBox',
        parent=base['Normal'],
        fontName='Courier',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )
    styles['CodeBox'] = ParagraphStyle(
        'CodeBox',
        parent=base['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor('#38bdf8')
    )
    return styles


def format_prompt(text, styles):
    p = Paragraph(text.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['PromptBox'])
    t = Table([[p]], colWidths=[515])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t


def format_code(text, styles):
    p = Paragraph(text.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['CodeBox'])
    t = Table([[p]], colWidths=[515])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#090d16')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#1e293b')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t


def format_callout(text, styles):
    p = Paragraph(text, styles['Callout'])
    t = Table([[p]], colWidths=[515])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t


def build_master_guide(filepath):
    styles = get_styles()
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )
    story = []

    # Title & Metadata
    story.append(Paragraph("From Pinterest Screenshot to Live 3D Experience", styles['CoverPre']))
    story.append(Paragraph("The Master Engineering Guide: Building an Award-Winning 3D Website with AI Voice in Antigravity", styles['CoverTitle']))
    story.append(Paragraph("A Complete Step-by-Step Blueprint with Exact Workflows, Mathematical Formulas, Production Code, and Copy-Paste Prompts for Builders.", styles['CoverSub']))

    # Metadata Table
    meta_data = [
        [Paragraph("<b>Target Audience:</b> Aspiring 3D Web Developers & Friends", styles['Body']), Paragraph("<b>Prerequisites:</b> Node.js, Git, Antigravity IDE", styles['Body'])],
        [Paragraph("<b>Live Reference Site:</b> https://genowl.tech", styles['Body']), Paragraph("<b>Core Technologies:</b> React, TypeScript, Canvas, Web Speech API", styles['Body'])],
        [Paragraph("<b>Author / Creator:</b> Antriksh Soun (Genowl Studio)", styles['Body']), Paragraph("<b>Architecture:</b> 240-Frame Scroll Canvas + YZER Voice", styles['Body'])]
    ]
    meta_table = Table(meta_data, colWidths=[255, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # CHAPTER 1
    story.append(Paragraph("Chapter 1: The Creative Genesis (Pinterest to Google AI Studio)", styles['H1']))
    story.append(Paragraph(
        "Every great digital product starts with visual inspiration. Instead of staring at an empty code editor, our workflow begins visually:",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>1. Curating the Visual Benchmark:</b> We searched Pinterest for luxury dark-mode web designs featuring layered glassmorphism, bold typographic hierarchy, and neon lime/gold accents (#c6f554 and #f7cc46). We captured a high-resolution screenshot of the best layout.<br/>"
        "<b>2. Reverse-Engineering in Google AI Studio:</b> We uploaded the Pinterest screenshot into Google AI Studio (Gemini 1.5 Pro / Flash) with an image prompt: <i>'Analyze this UI layout. Break it down into semantic React components, extract the color palette tokens, and outline the typography sizing scale.'</i><br/>"
        "<b>3. Output Extraction:</b> Google AI Studio generated the initial JSX layout skeleton and Tailwind color tokens, giving us the raw structural DNA for the project.",
        styles['Body']
    ))
    story.append(Spacer(1, 6))

    # CHAPTER 2
    story.append(Paragraph("Chapter 2: The 3D Animation Pipeline (10s Video to 240 Frames)", styles['H1']))
    story.append(Paragraph(
        "Why did we use a frame sequence instead of a heavy 3D `.glb` file? Heavy 3D models require 40MB+ of downloads and cause mobile GPUs to stutter. A 240-frame sequence rendered in lightweight WebP gives <b>photorealistic raytraced quality locked at 60 FPS</b> on any mobile phone.",
        styles['Body']
    ))
    story.append(Paragraph("<b>The Exact FFmpeg Extraction Command:</b>", styles['BodyBold']))
    ffmpeg_cmd = "ffmpeg -i your_3d_render.mp4 -vf \"fps=24,scale=1920:1080:force_original_aspect_ratio=decrease\" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 85 frames/frame_%03d.webp"
    story.append(format_code(ffmpeg_cmd, styles))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "This creates 240 files named <code>frame_001.webp</code> to <code>frame_240.webp</code> (total size ~7MB). Put this folder at the root: <code>/frames</code>.",
        styles['Body']
    ))
    story.append(Spacer(1, 6))

    # CHAPTER 3
    story.append(Paragraph("Chapter 3: Setting Up Antigravity & The Master Kickoff Prompt", styles['H1']))
    story.append(Paragraph(
        "Open Antigravity IDE, create a new Vite + React + TypeScript project, and paste the following master prompt into the chat window:",
        styles['Body']
    ))
    story.append(format_prompt(
"""I am building an award-winning 3D web experience with a background scroll animation and native AI voice guide.
Here are the project requirements:
1. DESIGN SYSTEM: Dark luxury palette (#080d09 base, #0e1610 cards, #c6f554 lime accents, #f7cc46 amber). Use modern typography (Outfit/Inter) and backdrop-blur glassmorphism.
2. 3D SCROLL CANVAS: I have 240 frames inside /frames (frame_001.webp to frame_240.webp). Build a component that smoothly binds window scroll to the frame index at 60 FPS.
3. PRELOADING: Preload frames concurrently into memory, and immediately render Frame 0 on mount so the user NEVER sees a black background.
4. RESPONSIVE MATH: Implement 2x DPR retina scaling and aspect-ratio 'cover' math so the canvas fills any screen without distortion.

Review my workspace and begin by creating BackgroundScrollCanvas.tsx.""",
        styles
    ))
    story.append(Spacer(1, 8))

    # CHAPTER 4
    story.append(Paragraph("Chapter 4: The 3D Scroll Canvas Engine Explained", styles['H1']))
    story.append(Paragraph(
        "The core innovation is in <code>BackgroundScrollCanvas.tsx</code>. It maps window scroll progress ($0.0 \\to 1.0$) to frame indices ($0 \\to 239$). Here is the production math and code:",
        styles['Body']
    ))
    canvas_code = """// Aspect-Ratio 'Cover' Math (Prevents Stretching or Letterboxing)
const renderFrame = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let drawW = width, drawH = height, offsetX = 0, offsetY = 0;

  if (canvasAspect > imgAspect) {
    drawH = width / imgAspect;
    offsetY = (height - drawH) / 2;
  } else {
    drawW = height * imgAspect;
    offsetX = (width - drawW) / 2;
  }
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  ctx.restore();
};"""
    story.append(format_code(canvas_code, styles))
    story.append(Spacer(1, 4))
    story.append(format_callout(
        "<b>CRITICAL BUG FIX: The Black Screen Prevention:</b> Always load and render <code>frame_001.webp</code> immediately on component mount! Never wait for all 240 frames to finish downloading before drawing. Preload the remaining frames in the background while the user begins scrolling.",
        styles
    ))
    story.append(Spacer(1, 8))

    # CHAPTER 5
    story.append(Paragraph("Chapter 5: Assembling the Full Website Sections", styles['H1']))
    story.append(Paragraph(
        "With the 3D scroll canvas locked in the background (using <code>position: fixed; z-index: -1;</code>), assemble the foreground sections:",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>1. Hero Banner:</b> Headline (<i>'WE BUILD FOR YOU'</i>), high-contrast call-to-action buttons, and the interactive pill highlighting the voice assistant: <i>'Meet YZER — Tap mic or ask Navigate me for a tour'</i>.<br/>"
        "<b>2. Services Catalog & Transparent Pricing:</b> Three crystal-clear cards with full IP transfer:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>2D Web Architecture ($500)</b> — High-speed, conversion-focused business sites.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>3D WebGL Experiences ($2,500)</b> — Custom interactive 3D flagships.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>AI Video & Ads ($99)</b> — High-impact marketing video spots.<br/>"
        "<b>3. Studio Philosophy (About):</b> <i>'Genowl is a platform that provides you multiple services according to your requirements, basically we build for you...'</i><br/>"
        "<b>4. Interactive Consultation Desk:</b> Live consultation booking modal and direct contact email (<code>support@genowl.tech</code>).",
        styles['Body']
    ))
    story.append(Spacer(1, 8))

    # CHAPTER 6
    story.append(Paragraph("Chapter 6: Engineering YZER — The Native AI Voice Guide", styles['H1']))
    story.append(Paragraph(
        "YZER (pronounced <i>'Wiser'</i>) runs on <b>100% native Web Speech API</b> with <b>zero API costs and zero server latency</b>. During development, we solved four critical engineering hurdles:",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>1. The Hardware Lockout Bug:</b> Calling <code>navigator.mediaDevices.getUserMedia</code> locks the microphone in Chrome, which starves <code>SpeechRecognition</code> and results in silent input failure. <b>The Fix:</b> Never create an AudioContext while SpeechRecognition is running; let SpeechRecognition handle mic capture exclusively.<br/>"
        "<b>2. Vocal Profile Tuning:</b> Set <code>pitch = 0.88</code> and <code>rate = 1.10</code> to create a deep, authoritative masculine timbre without sounding artificial. Prioritize <i>Microsoft Guy Online (Natural)</i> and <i>Google UK English Male</i>.<br/>"
        "<b>3. Event-Driven Tour Sequencing (No Cut-Offs):</b> Never use arbitrary fixed timers (e.g. 14s). Chain steps using the browser's native <code>utterance.onend</code> event:",
        styles['Body']
    ))
    tour_code = """// Event-driven tour chaining so sentences never cut off
speak(step1Text, () => {
  // Step 2 triggers ONLY after Step 1 has 100% finished speaking!
  setTimeout(() => {
    onNavigate('services');
    speak(step2Text, () => {
      setTimeout(() => {
        onNavigate('about');
        speak(step3Text, () => { ... });
      }, 1000); // 1.0s natural breathing pause
    });
  }, 1000);
});"""
    story.append(format_code(tour_code, styles))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>4. Intent Training:</b> Added natural language classification for queries like <i>'navigate me for a tour'</i>, <i>'what should I do after signing up'</i>, and <i>'pricing'</i>.",
        styles['Body']
    ))
    story.append(Spacer(1, 8))

    # CHAPTER 7
    story.append(Paragraph("Chapter 7: Zero-Fail Production Deployment (Hostinger / cPanel)", styles['H1']))
    story.append(Paragraph(
        "Standard Vite builds split JavaScript into dozens of small chunk files. On Hostinger LiteSpeed or shared cPanel hosting, this often throws MIME-type 404 errors and white screens. Here is how we achieved 100% reliability:",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>1. Standalone Compilation (<code>build_standalone.js</code>):</b> A custom node script that inlines the CSS and JavaScript bundles directly into a single 554 KB <code>index.html</code> file.<br/>"
        "<b>2. Asset Root Placement:</b> Keep the <code>frames/</code> folder at the public root of the domain so all URLs resolve cleanly.<br/>"
        "<b>3. Apache / LiteSpeed <code>.htaccess</code> Rule:</b>",
        styles['Body']
    ))
    htaccess_code = """<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>"""
    story.append(format_code(htaccess_code, styles))
    story.append(Spacer(1, 8))

    # CHAPTER 8
    story.append(Paragraph("Chapter 8: The Step-by-Step Prompt Book (For Your Friends)", styles['H1']))
    story.append(Paragraph(
        "Your friends can literally copy and paste these exact prompts in sequence into Antigravity to build their own site:",
        styles['Body']
    ))
    
    prompts = [
        ("Prompt 1: Kickoff & Aesthetic System",
         "Create a luxury dark-mode React application using Tailwind CSS. Set up an obsidian palette (#080d09, #0e1610) with neon lime (#c6f554) and amber (#f7cc46) accents. Configure glassmorphic card styles with backdrop blur and subtle glowing borders."),
        
        ("Prompt 2: 3D Scroll Canvas Engine",
         "Create BackgroundScrollCanvas.tsx. Load 240 WebP frames from /frames/frame_%03d.webp. Bind the normalized scroll progress to frame indexes. Implement DPR 2x retina scaling, aspect-ratio cover math, concurrent preloading, and immediate Frame 0 rendering."),
        
        ("Prompt 3: Core UI & Pricing Structure",
         "Build the Hero banner, 3-tier Services Catalog ($500, $2500, $99), Studio Philosophy section, and Consultation Booking modal. Include the highlight banner for the AI voice guide on the home page."),
        
        ("Prompt 4: YZER AI Voice Agent",
         "Build VoiceAssistant.tsx using native Web Speech API. Set pitch to 0.88 and rate to 1.10 for a deep, clear male voice. Implement event-driven tour navigation chained via utterance.onend so sentences never cut off. Add intent matching for 'navigate me for a tour'."),
        
        ("Prompt 5: Standalone Packaging & Deployment",
         "Create build_standalone.js to bundle all JavaScript and CSS into a self-contained index.html for Hostinger LiteSpeed hosting. Generate an .htaccess file with SPA rewrite rules to ensure zero 404s.")
    ]

    for p_title, p_body in prompts:
        story.append(Paragraph(p_title, styles['H2']))
        story.append(format_prompt(p_body, styles))
        story.append(Spacer(1, 4))

    def canvas_maker(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        return c

    doc.build(story, canvasmaker=canvas_maker)
    print(f"Master Guide generated successfully at: {filepath}")


if __name__ == '__main__':
    build_master_guide(OUTPUT_PDF)

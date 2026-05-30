"""Morrison & Associates — AI Intake Performance Dashboard (xAI DESIGN.md)."""

from __future__ import annotations

import plotly.graph_objects as go
import streamlit as st

from data import (
    AVG_CASE_VALUE,
    FIRM_NAME,
    FIRM_TAGLINE,
    estimated_pipeline,
    format_currency,
    get_call_heatmap,
    get_decline_reasons,
    get_funnel,
    get_today,
    get_week,
)

# ── xAI DESIGN.md tokens ─────────────────────────────────────────────────────
PRIMARY = "#ffffff"
ON_PRIMARY = "#0a0a0a"
INK = "#ffffff"
BODY = "#dadbdf"
MUTE = "#7d8187"
HAIRLINE = "#212327"
CANVAS = "#0a0a0a"
CANVAS_SOFT = "#1a1c20"
CANVAS_CARD = "#191919"
CANVAS_MID = "#363a3f"
ACCENT = "#8a8278"
ACCENT_WARM = "#9a8f82"
ACCENT_COOL = "#6e7680"
ACCENT_MUTED = "#5c636a"

FONT = "Inter, system-ui, -apple-system, sans-serif"
FONT_MONO = "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"

PLOT_CONFIG = {"displayModeBar": False, "staticPlot": False}

# Chart data labels — match donut center "67" style
CHART_NUM_SIZE = 28
CHART_NUM_FONT = dict(size=CHART_NUM_SIZE, color=INK, family=FONT)
CHART_AXIS_FONT = dict(color=MUTE, family=FONT_MONO, size=10)

st.set_page_config(
    page_title=f"{FIRM_NAME} · Intake Analytics",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');

:root {{
  --canvas: {CANVAS};
  --card: {CANVAS_CARD};
  --hairline: {HAIRLINE};
  --ink: {INK};
  --body: {BODY};
  --mute: {MUTE};
}}

header[data-testid="stHeader"],
[data-testid="stToolbar"],
[data-testid="stDecoration"],
#MainMenu,
footer {{
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  visibility: hidden !important;
}}

.stApp {{
  background: {CANVAS};
  color: {INK};
  font-family: {FONT};
  -webkit-font-smoothing: antialiased;
  position: relative;
}}

.stApp::before {{
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}}

.stApp > [data-testid="stAppViewContainer"] {{
  position: relative;
  z-index: 1;
}}

@media (prefers-reduced-motion: reduce) {{
  *, *::before, *::after {{
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }}
}}

@keyframes fadeSlideDown {{
  from {{ opacity: 0; transform: translateY(-12px); }}
  to {{ opacity: 1; transform: translateY(0); }}
}}

@keyframes fadeSlideUp {{
  from {{ opacity: 0; transform: translateY(20px); }}
  to {{ opacity: 1; transform: translateY(0); }}
}}

@keyframes fadeIn {{
  from {{ opacity: 0; }}
  to {{ opacity: 1; }}
}}

@keyframes scaleIn {{
  from {{ opacity: 0; transform: scale(0.96); }}
  to {{ opacity: 1; transform: scale(1); }}
}}

@keyframes pulseDot {{
  0%, 100% {{ opacity: 1; transform: scale(1); }}
  50% {{ opacity: 0.45; transform: scale(0.85); }}
}}

@keyframes shimmerLine {{
  from {{ transform: scaleX(0); }}
  to {{ transform: scaleX(1); }}
}}

@keyframes countGlow {{
  0%, 100% {{ opacity: 0.85; }}
  50% {{ opacity: 1; }}
}}

.animate-nav {{
  animation: fadeSlideDown 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.animate-hero {{
  animation: fadeSlideUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.animate-block {{
  animation: fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.animate-card {{
  animation: scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.animate-chart {{
  animation: fadeSlideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.delay-1 {{ animation-delay: 0.06s; }}
.delay-2 {{ animation-delay: 0.12s; }}
.delay-3 {{ animation-delay: 0.18s; }}
.delay-4 {{ animation-delay: 0.24s; }}
.delay-5 {{ animation-delay: 0.30s; }}
.delay-6 {{ animation-delay: 0.36s; }}
.delay-7 {{ animation-delay: 0.42s; }}
.delay-8 {{ animation-delay: 0.48s; }}
.delay-9 {{ animation-delay: 0.54s; }}
.delay-10 {{ animation-delay: 0.60s; }}

[data-testid="stAppViewContainer"] {{
  padding-top: 0 !important;
  top: 0 !important;
}}

[data-testid="stAppViewContainer"],
[data-testid="stAppViewContainer"] > section.main,
[data-testid="stAppViewContainer"] > section.main > div,
.stMainBlockContainer,
[data-testid="stAppViewBlockContainer"] {{
  padding-top: 0 !important;
  margin-top: 0 !important;
}}

.block-container {{
  padding: 0 !important;
  padding-top: 0 !important;
  max-width: 100% !important;
}}

[data-testid="stVerticalBlock"] {{
  gap: 0 !important;
}}

[data-testid="stVerticalBlock"] > div {{
  margin-bottom: 0 !important;
}}

.stMarkdown {{
  margin-bottom: 0 !important;
}}

div[data-testid="column"] {{
  padding-top: 0 !important;
}}

[data-testid="stPlotlyChart"] {{
  background: transparent;
  animation: fadeIn 0.5s ease 0.2s both;
}}

iframe {{
  border: none;
}}

/* nav */
.nav {{
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: rgba(10, 10, 10, 0.88);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-bottom: 1px solid {HAIRLINE};
  transition: border-color 0.3s ease, background 0.3s ease;
}}

.nav-brand {{
  font-size: 14px;
  letter-spacing: -0.02em;
  color: {INK};
  transition: opacity 0.2s ease;
}}

.nav-brand:hover {{
  opacity: 0.8;
}}

.nav-links {{
  display: flex;
  gap: 10px;
  align-items: center;
}}

.pill {{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: {INK};
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
  cursor: default;
}}

.pill:hover {{
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
}}

.pill:active {{
  transform: translateY(0) scale(0.98);
}}

.pill-filled {{
  background: {CANVAS_SOFT};
  color: {BODY};
  border-color: {ACCENT_MUTED};
}}

.pill-filled:hover {{
  background: #222428;
  border-color: rgba(154, 143, 130, 0.55);
  box-shadow: 0 0 0 1px rgba(154, 143, 130, 0.12);
}}

.pill-live {{
  border-color: rgba(154, 143, 130, 0.45);
}}

.status-dot {{
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6b9e7a;
  box-shadow: 0 0 8px rgba(107, 158, 122, 0.55);
  animation: pulseDot 2s ease-in-out infinite;
  flex-shrink: 0;
}}

.pill-sm {{
  padding: 4px 12px;
  font-size: 12px;
}}

/* hero */
.hero {{
  padding: 32px 32px 48px;
  max-width: 1200px;
  margin: 0 auto;
}}

.eyebrow {{
  font-family: {FONT_MONO};
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: {MUTE};
  margin-bottom: 16px;
}}

.hero .eyebrow,
.hero .hero-lead {{
  animation: fadeSlideUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.hero h1 {{
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 20px;
  max-width: 900px;
}}

.hero-line {{
  display: inline-block;
  animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}}

.hero-line-2 {{
  animation-delay: 0.1s;
}}

.hero-lead {{
  font-size: 18px;
  line-height: 28px;
  color: {BODY};
  max-width: 560px;
  margin-bottom: 28px;
}}

/* after-hours band */
.after-hours {{
  max-width: 1200px;
  margin: 0 auto 48px;
  padding: 0 32px;
}}

.after-hours-inner {{
  background: {CANVAS_CARD};
  border: 1px solid {HAIRLINE};
  border-radius: 10px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}}

.after-hours-inner:hover {{
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}}

.after-hours-inner::after {{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: {ACCENT_WARM};
  transform-origin: left;
  animation: shimmerLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
  opacity: 0.6;
}}

.after-hours h2 {{
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.125;
  margin: 0 0 8px;
}}

.after-hours .sub {{
  font-size: 16px;
  line-height: 24px;
  color: {BODY};
  margin-bottom: 28px;
  max-width: 480px;
}}

.stat-row {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}}

@media (max-width: 768px) {{
  .stat-row {{ grid-template-columns: 1fr; }}
}}

.stat-block {{
  padding: 20px;
  background: {CANVAS_SOFT};
  border: 1px solid {HAIRLINE};
  border-radius: 10px;
  transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
}}

.stat-block:hover {{
  border-color: rgba(255, 255, 255, 0.28);
  background: #1e2024;
  transform: translateY(-3px);
}}

.stat-block .val {{
  font-size: 48px;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
  color: {BODY};
  transition: color 0.25s ease;
}}

.stat-block:hover .val {{
  color: {INK};
  animation: countGlow 2s ease-in-out infinite;
}}

.stat-block .lbl {{
  font-family: {FONT_MONO};
  font-size: 11px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: {MUTE};
  margin-top: 8px;
}}

/* sections */
.section {{
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 48px;
}}

.section-head {{
  margin-bottom: 24px;
}}

.section-head h2 {{
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.02em;
  margin: 8px 0 0;
  animation: fadeSlideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}}

/* kpi grid */
.kpi-grid {{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}}

@media (max-width: 1100px) {{
  .kpi-grid {{ grid-template-columns: repeat(3, 1fr); }}
}}

@media (max-width: 640px) {{
  .kpi-grid {{ grid-template-columns: 1fr 1fr; }}
  .kpi-featured {{ grid-column: 1 / -1; }}
}}

.kpi-card {{
  background: {CANVAS_CARD};
  border: 1px solid {HAIRLINE};
  border-radius: 10px;
  padding: 24px;
  height: 100%;
  transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, background 0.3s ease;
}}

.kpi-card:hover {{
  border-color: rgba(255, 255, 255, 0.32);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  background: #1c1c1c;
}}

.kpi-card .value {{
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
  color: {INK};
  font-variant-numeric: tabular-nums;
  transition: color 0.25s ease, transform 0.25s ease;
}}

.kpi-card:hover .value {{
  transform: scale(1.02);
  transform-origin: left center;
}}

.kpi-card .label {{
  font-family: {FONT_MONO};
  font-size: 11px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: {MUTE};
  margin-bottom: 12px;
}}

.kpi-card .value.accent {{
  color: {ACCENT_WARM};
}}

.kpi-card:hover .value.accent {{
  color: #b5a899;
}}

.kpi-card .sub {{
  font-size: 14px;
  line-height: 20px;
  color: {MUTE};
  margin-top: 10px;
}}

.kpi-featured {{
  background: {CANVAS_SOFT};
  border-color: {ACCENT_MUTED};
  position: relative;
}}

.kpi-featured::before {{
  content: "";
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 2px;
  background: {ACCENT_WARM};
  border-radius: 2px;
  opacity: 0.7;
}}

.kpi-featured:hover {{
  border-color: rgba(154, 143, 130, 0.5);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.04);
}}

.kpi-featured .label {{
  color: {MUTE};
}}

.kpi-featured .value {{
  color: {INK};
}}

.kpi-featured .sub {{
  color: {MUTE};
}}

/* chart cards */
.chart-wrap {{
  background: {CANVAS_CARD};
  border: 1px solid {HAIRLINE};
  border-radius: 10px;
  padding: 24px;
  height: 100%;
  transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
}}

.chart-wrap:hover {{
  border-color: rgba(255, 255, 255, 0.24);
  transform: translateY(-2px);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.32);
}}

.chart-wrap h3 {{
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
  transition: color 0.2s ease;
}}

.chart-wrap:hover h3 {{
  color: {BODY};
}}

.chart-wrap .caption {{
  font-size: 14px;
  color: {MUTE};
  margin-bottom: 8px;
}}

.divider {{
  height: 1px;
  background: {HAIRLINE};
  max-width: 1200px;
  margin: 0 auto 48px;
  transform-origin: left;
  animation: shimmerLine 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
}}

.footer {{
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 64px;
  border-top: 1px solid {HAIRLINE};
  animation: fadeIn 0.6s ease 0.7s both;
}}

.footer p {{
  font-size: 14px;
  color: {MUTE};
  margin: 0;
  line-height: 20px;
}}

.footer .mono {{
  font-family: {FONT_MONO};
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
}}
</style>
""",
    unsafe_allow_html=True,
)

# ── Data ─────────────────────────────────────────────────────────────────────
today = get_today()
week = get_week()
funnel = get_funnel()
declines = get_decline_reasons()
hours, days, heat_values = get_call_heatmap()
pipeline = estimated_pipeline(week.qualified_leads)
qual_rate = today.qualified / today.total_calls * 100 if today.total_calls else 0
after_hours_pct = today.after_hours_calls / today.total_calls * 100 if today.total_calls else 0


def chart_number_annotation(value: int | str, label: str = "") -> dict:
    """Center label style matching donut '67 DECLINED' treatment."""
    label_html = ""
    if label:
        label_html = (
            f"<br><span style='font-size:10px;font-family:JetBrains Mono,monospace;"
            f"letter-spacing:1px;color:{MUTE}'>{label.upper()}</span>"
        )
    return dict(
        text=(
            f"<span style='font-size:28px;letter-spacing:-0.03em;font-family:Inter,"
            f"system-ui,sans-serif;color:{INK}'>{value}</span>{label_html}"
        ),
        font=dict(size=CHART_NUM_SIZE, color=INK, family=FONT),
        showarrow=False,
    )


def dark_layout(**overrides) -> dict:
    base = dict(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family=FONT, color=BODY, size=13),
        margin=dict(l=8, r=8, t=8, b=8),
        hoverlabel=dict(
            bgcolor=CANVAS_CARD,
            bordercolor=HAIRLINE,
            font=dict(family=FONT, size=13, color=INK),
        ),
        transition=dict(duration=600, easing="cubic-in-out"),
    )
    base.update(overrides)
    return base


def mono_axis(**extra) -> dict:
    return dict(
        gridcolor=HAIRLINE,
        zeroline=False,
        tickfont=dict(**CHART_AXIS_FONT),
        **extra,
    )


st.markdown(
    f"""
<div class="nav animate-nav">
  <span class="nav-brand">{FIRM_NAME}</span>
  <div class="nav-links">
    <span class="pill pill-sm delay-1">Intake</span>
    <span class="pill pill-sm delay-2">Reports</span>
    <span class="pill pill-filled pill-sm pill-live delay-3"><span class="status-dot"></span>Live</span>
  </div>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown(
    f"""
<div class="hero animate-hero">
  <div class="eyebrow delay-1">AI intake · {FIRM_TAGLINE}</div>
  <h1><span class="hero-line">Every call captured.</span><br><span class="hero-line hero-line-2">Every lead qualified.</span></h1>
  <p class="hero-lead delay-3">
    Real-time performance for your after-hours voice intake agent — calls, qualification,
    and revenue pipeline at a glance.
  </p>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown(
    f"""
<div class="after-hours animate-block delay-2">
  <div class="after-hours-inner">
    <div class="eyebrow">After-hours capture</div>
    <h2>Leads that would have gone to voicemail</h2>
    <p class="sub">Calls handled when your office is closed — evenings, nights, and weekends.</p>
    <div class="stat-row">
      <div class="stat-block animate-card delay-3">
        <div class="val">{today.after_hours_calls}</div>
        <div class="lbl">Calls today</div>
      </div>
      <div class="stat-block animate-card delay-4">
        <div class="val">{today.after_hours_qualified}</div>
        <div class="lbl">Qualified after-hours</div>
      </div>
      <div class="stat-block animate-card delay-5">
        <div class="val">{after_hours_pct:.0f}%</div>
        <div class="lbl">Of today's volume</div>
      </div>
    </div>
  </div>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown(
    f"""
<div class="section animate-block delay-3">
  <div class="section-head">
    <div class="eyebrow">Overview</div>
    <h2>Today's performance</h2>
  </div>
  <div class="kpi-grid">
    <div class="kpi-card animate-card delay-4">
      <div class="label">Today's calls</div>
      <div class="value">{today.total_calls}</div>
      <div class="sub">{today.business_hours_calls} business · {today.after_hours_calls} after-hours</div>
    </div>
    <div class="kpi-card animate-card delay-5">
      <div class="label">Qualified</div>
      <div class="value accent">{today.qualified}</div>
      <div class="sub">{qual_rate:.0f}% qualification rate</div>
    </div>
    <div class="kpi-card animate-card delay-6">
      <div class="label">Declined</div>
      <div class="value">{today.declined}</div>
      <div class="sub">Out of scope or incomplete</div>
    </div>
    <div class="kpi-card animate-card delay-7">
      <div class="label">Weekly qualified</div>
      <div class="value accent">{week.qualified_leads}</div>
      <div class="sub">+12% vs last week</div>
    </div>
    <div class="kpi-card kpi-featured animate-card delay-8">
      <div class="label">Est. pipeline</div>
      <div class="value">{format_currency(pipeline)}</div>
      <div class="sub">{week.qualified_leads} leads × {format_currency(AVG_CASE_VALUE)} avg</div>
    </div>
  </div>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

# ── Charts row 1 ─────────────────────────────────────────────────────────────
col_l, col_r = st.columns([1, 1.15])

with col_l:
    st.markdown(
        """
<div class="section animate-chart delay-5" style="padding-bottom:24px;">
  <div class="chart-wrap">
    <div class="eyebrow">Today</div>
    <h3>Qualified vs declined</h3>
    <p class="caption">Call disposition breakdown</p>
""",
        unsafe_allow_html=True,
    )
    fig_today = go.Figure()
    fig_today.add_trace(
        go.Bar(
            x=["Qualified", "Declined"],
            y=[today.qualified, today.declined],
            marker=dict(
                color=[ACCENT_WARM, CANVAS_MID],
                line=dict(width=0),
                cornerradius=6,
            ),
            text=[str(today.qualified), str(today.declined)],
            textposition="outside",
            textfont=CHART_NUM_FONT,
            width=0.45,
        )
    )
    fig_today.update_layout(
        **dark_layout(height=300),
        yaxis=mono_axis(title=""),
        xaxis=dict(showgrid=False, tickfont=dict(**CHART_AXIS_FONT)),
        showlegend=False,
        bargap=0.4,
    )
    st.plotly_chart(fig_today, use_container_width=True, config=PLOT_CONFIG)
    st.markdown("</div></div>", unsafe_allow_html=True)

with col_r:
    st.markdown(
        """
<div class="section animate-chart delay-6" style="padding-bottom:24px;">
  <div class="chart-wrap">
    <div class="eyebrow">This week</div>
    <h3>Conversion funnel</h3>
    <p class="caption">Call → qualified → consultation → retainer</p>
""",
        unsafe_allow_html=True,
    )
    funnel_labels = [s.label for s in funnel]
    funnel_values = [s.count for s in funnel]
    fig_funnel = go.Figure(
        go.Funnel(
            y=funnel_labels,
            x=funnel_values,
            textinfo="value",
            textposition="inside",
            textfont=CHART_NUM_FONT,
            marker=dict(
                color=[CANVAS_MID, ACCENT_MUTED, ACCENT_COOL, ACCENT_WARM],
                line=dict(width=1, color=HAIRLINE),
            ),
        )
    )
    fig_funnel.update_layout(**dark_layout(height=300), funnelmode="stack")
    st.plotly_chart(fig_funnel, use_container_width=True, config=PLOT_CONFIG)
    st.markdown("</div></div>", unsafe_allow_html=True)

# ── Charts row 2 ─────────────────────────────────────────────────────────────
col_l2, col_r2 = st.columns([1, 1.35])

with col_l2:
    st.markdown(
        """
<div class="section animate-chart delay-7" style="padding-bottom:24px;">
  <div class="chart-wrap">
    <div class="eyebrow">30 days</div>
    <h3>Top decline reasons</h3>
    <p class="caption">Why callers didn't qualify</p>
""",
        unsafe_allow_html=True,
    )
    labels = list(declines.keys())
    values = list(declines.values())
    donut_colors = [ACCENT_WARM, ACCENT_COOL, ACCENT, ACCENT_MUTED, CANVAS_MID, MUTE]

    fig_donut = go.Figure(
        go.Pie(
            labels=labels,
            values=values,
            hole=0.62,
            marker=dict(colors=donut_colors, line=dict(color=CANVAS_CARD, width=2)),
            textinfo="value",
            textposition="inside",
            textfont=CHART_NUM_FONT,
            hovertemplate="%{label}<br>%{value} calls (%{percent})<extra></extra>",
        )
    )
    fig_donut.update_layout(
        **dark_layout(height=380),
        showlegend=True,
        legend=dict(
            orientation="v",
            yanchor="middle",
            y=0.5,
            x=1.02,
            font=dict(size=10, color=MUTE, family=FONT_MONO),
            bgcolor="rgba(0,0,0,0)",
        ),
        annotations=[
            {
                **chart_number_annotation(sum(values), "declined"),
                "x": 0.5,
                "y": 0.5,
            }
        ],
    )
    st.plotly_chart(fig_donut, use_container_width=True, config=PLOT_CONFIG)
    st.markdown("</div></div>", unsafe_allow_html=True)

with col_r2:
    st.markdown(
        """
<div class="section animate-chart delay-8" style="padding-bottom:24px;">
  <div class="chart-wrap">
    <div class="eyebrow">Volume</div>
    <h3>Call heatmap</h3>
    <p class="caption">Hours × day of week — evening & weekend peaks</p>
""",
        unsafe_allow_html=True,
    )
    fig_heat = go.Figure(
        data=go.Heatmap(
            z=heat_values,
            x=days,
            y=hours,
            colorscale=[
                [0, CANVAS],
                [0.2, CANVAS_SOFT],
                [0.45, CANVAS_MID],
                [0.7, ACCENT_MUTED],
                [1, ACCENT_COOL],
            ],
            text=heat_values,
            texttemplate="%{text}",
            textfont=CHART_NUM_FONT,
            hovertemplate="%{y} · %{x}<br>%{z} calls<extra></extra>",
            colorbar=dict(
                title=dict(text="", font=dict(color=MUTE)),
                tickfont=dict(**CHART_AXIS_FONT),
                bgcolor="rgba(0,0,0,0)",
                borderwidth=0,
            ),
        )
    )
    fig_heat.update_layout(
        **dark_layout(height=380),
        xaxis=dict(
            side="top",
            tickfont=dict(**CHART_AXIS_FONT),
        ),
        yaxis=dict(
            autorange="reversed",
            tickfont=dict(**CHART_AXIS_FONT),
        ),
    )
    st.plotly_chart(fig_heat, use_container_width=True, config=PLOT_CONFIG)
    st.markdown("</div></div>", unsafe_allow_html=True)

st.markdown(
    """
<div class="footer">
  <div class="mono">Morrison &amp; associates · intake analytics</div>
  <p>Sample data for demonstration · Wire to Cekura &amp; Twilio for live metrics</p>
</div>
""",
    unsafe_allow_html=True,
)

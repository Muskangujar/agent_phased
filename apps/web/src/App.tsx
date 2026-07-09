import { useState, useEffect, useRef, useCallback } from 'react'

/* ========================================
   Scroll Reveal Hook (IntersectionObserver)
   ======================================== */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el) } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ========================================
   Hero Carousel Data
   ======================================= */
const heroSlides = [
  {
    category: 'Platform',
    tabTitle: 'The OS for Autonomous Agents',
    eyebrow: 'Open-Source Agent Infrastructure',
    headline: (<>Every framework gives your agent a brain.{' '}<span style={{ color: '#2D8C8C' }}>None give it a body.</span></>),
    desc: 'AgentPhased is the body: cryptographic identity, structured memory, and dynamic tool execution. Three standalone Rust-compiled engines compose into one auditable runtime.',
    cta: { label: 'Get Started', href: '#quickstart' },
    ctaSecondary: { label: 'View on GitHub →', href: 'https://github.com/samvardhan03/agent_phased' },
  },
  {
    category: 'Identity',
    tabTitle: 'Ed25519 Cryptographic Identity',
    eyebrow: 'AgentID',
    headline: (<>Deterministic keypairs.{' '}<span style={{ color: '#D05D43' }}>Zero certificates.</span></>),
    desc: 'Every agent gets an Ed25519 keypair derived deterministically from its name and project namespace. Reproducible fingerprints, request signing, and cross-system verification, with zero external dependencies.',
    cta: { label: 'View AgentID →', href: 'https://github.com/samvardhan03/AgentID' },
  },
  {
    category: 'Memory',
    tabTitle: 'Episodic + Semantic Recall',
    eyebrow: 'AgentMem',
    headline: (<>Not a vector database wrapper.{' '}<span style={{ color: '#8B6CC1' }}>An engine.</span></>),
    desc: 'Compiled Rust core exposed via PyO3. Episodic memory stores structured action logs. Semantic memory runs HNSW approximate nearest-neighbor search over ONNX embeddings with no external API calls. RocksDB persistence with namespace isolation.',
    cta: { label: 'View AgentMem →', href: 'https://github.com/Muskangujar/AgentMem' },
  },
  {
    category: 'Tools',
    tabTitle: 'Schema Inference + MCP Server',
    eyebrow: 'Agentool',
    headline: (<>Point at an API.{' '}<span style={{ color: '#D6AD60' }}>It figures out the rest.</span></>),
    desc: 'A Rust parser that reads OpenAPI specs and raw HTML to automatically infer tool schemas. Tokio-based Model Context Protocol server for tool discovery and invocation. Native Python extension via PyO3.',
    cta: { label: 'View Agentool →', href: 'https://github.com/Muskangujar/Agentool' },
  },
]

const SLIDE_DURATION = 6000
const EXIT_DURATION = 600
const STACK_DURATION = 7000

const stackModules = [
  {
    id: 'AgentID',
    tag: 'Cryptographic Identity',
    tagClass: 'module-tag--id',
    desc: 'Every agent gets a deterministic Ed25519 keypair derived from its name and project namespace. No certificates. No OAuth dance. Just a fingerprint that is reproducible, verifiable, and auditable, with zero external dependencies.',
    href: 'https://github.com/samvardhan03/AgentID',
    features: [
      { title: 'Key Derivation', text: 'Deterministic from (name, project) tuple. Same inputs always produce the same keypair.' },
      { title: 'Request Signing', text: 'Ed25519 signatures on every outbound request. Verifiable by any downstream service.' },
      { title: 'Specifications', specs: [{ key: 'Signing', val: 'Ed25519' }, { key: 'Fingerprint', val: 'SHA-256' }, { key: 'Language', val: 'Python' }] },
    ],
  },
  {
    id: 'AgentMem',
    tag: 'Persistent Memory',
    tagClass: 'module-tag--mem',
    desc: 'A compiled Rust core exposed to Python via PyO3. Not a vector database wrapper; it is an engine. Episodic memory stores structured (action, result_summary, timestamp) tuples. Semantic memory runs HNSW approximate nearest-neighbor search over ONNX embeddings with no external API calls.',
    href: 'https://github.com/Muskangujar/AgentMem',
    features: [
      { title: 'Episodic Memory', text: 'Structured action logs with timestamps. Every tool call is persisted as a queryable episode.' },
      { title: 'Semantic Recall', text: 'HNSW approximate nearest-neighbor search. ONNX embeddings generated locally — no API calls.' },
      { title: 'Specifications', specs: [{ key: 'Storage', val: 'RocksDB' }, { key: 'Indexing', val: 'HNSW' }, { key: 'Core', val: 'Rust → PyO3' }] },
    ],
  },
  {
    id: 'Agentool',
    tag: 'Tool Execution',
    tagClass: 'module-tag--tool',
    desc: 'A Rust parser that reads OpenAPI specifications and raw HTML pages to automatically infer tool schemas. Includes a Tokio-based Model Context Protocol (MCP) server for tool discovery and invocation. The Rust core compiles to a native Python extension via PyO3.',
    href: 'https://github.com/Muskangujar/Agentool',
    features: [
      { title: 'Schema Inference', text: 'Automatically parses OpenAPI JSON/YAML and raw HTML to extract callable tool schemas.' },
      { title: 'MCP Server', text: 'Tokio-based async Model Context Protocol server for standardized tool discovery and invocation.' },
      { title: 'Specifications', specs: [{ key: 'Parser', val: 'Compiled Rust' }, { key: 'Server', val: 'Tokio MCP' }, { key: 'Bridge', val: 'PyO3' }] },
    ],
  },
]

const archNodesData = {
  runtime: {
    title: 'AgentPhased Runtime',
    tag: 'Orchestration Layer',
    color: '#746B61',
    desc: 'The glue that binds identity, memory, and tool execution into a single coherent Agent instance. Uses a decoupled, event-driven architecture to keep components isolated yet collaborative.',
    repo: 'https://github.com/samvardhan03/agent_phased',
    features: [
      'Event-driven communication via pub/sub EventBus',
      'Zero-dependency runtime composition',
      'Thread-safe callbacks and async telemetry streams'
    ]
  },
  id: {
    title: 'AgentID',
    tag: 'Cryptographic Identity',
    color: '#2D8C8C',
    desc: 'Deterministic Ed25519 keypairs derived from the agent\'s name and project namespace. Every outbound request is signed cryptographically for cross-system verification and auditable telemetry.',
    repo: 'https://github.com/samvardhan03/AgentID',
    features: [
      'Zero-certificate setup for trust verification',
      'Reproducible fingerprint derivation (SHA-256)',
      'Native request/payload signing out-of-the-box'
    ]
  },
  mem: {
    title: 'AgentMem',
    tag: 'Persistent Memory',
    color: '#8B6CC1',
    desc: 'A high-performance local memory engine built in Rust. Logs structured episodic timelines (actions, tools, results) and performs semantic searches using a local ONNX embedding engine and HNSW vector indexing.',
    repo: 'https://github.com/Muskangujar/AgentMem',
    features: [
      'RocksDB-backed local storage (no cloud DB required)',
      'Local HNSW approximate nearest-neighbor search',
      'Completely self-contained; zero external API requests'
    ]
  },
  tool: {
    title: 'Agentool',
    tag: 'Tool Execution & Discovery',
    color: '#D6AD60',
    desc: 'An automated tool execution engine that reads OpenAPI/Swagger specifications and parses HTML docs to dynamically infer and build structured execution schemas for model invocation.',
    repo: 'https://github.com/Muskangujar/Agentool',
    features: [
      'Dynamic OpenAPI and HTML schema parsers',
      'Built-in Model Context Protocol (MCP) server',
      'Rust core compiled to native Python modules via PyO3'
    ]
  },
  class: {
    title: 'Agent Class',
    tag: 'Developer Interface',
    color: '#191714',
    desc: 'The main developer API surface. Instantiating Agent initializes all three engines under a single Python object, auto-registering listeners to bridge memory, key signatures, and tool execution.',
    repo: 'https://github.com/samvardhan03/agent_phased',
    features: [
      'Clean developer interface (unified imports)',
      'Pre-wired episodic memory listeners',
      'Centralized configuration and initialization'
    ]
  },
  registry: {
    title: 'ToolRegistry',
    tag: 'Execution Routing',
    color: '#2D8C8C',
    desc: 'Registers, validates, and manages execution schemas. It ensures that inputs match target schemas and uses the agent\'s cryptographic keypair to sign outbound API requests.',
    repo: 'https://github.com/samvardhan03/agent_phased',
    features: [
      'Input/output parameter validation',
      'Payload cryptographic signing hook',
      'Local schema registry caching'
    ]
  },
  bus: {
    title: 'EventBus',
    tag: 'Pub/Sub Broker',
    color: '#C96442',
    desc: 'A thread-safe, synchronous and asynchronous event broker. Decouples components by broadcasting events like tool.called and system to real-time streams like the SSE dashboard.',
    repo: 'https://github.com/samvardhan03/agent_phased',
    features: [
      'Wildcard event subscription capabilities',
      'Thread-safe pub/sub dispatching',
      'Direct connection to SSE dashboard event generator'
    ]
  }
}

function App() {
  // Hero Carousel State
  const [activeSlide, setActiveSlide] = useState(0)
  const [leavingSlide, setLeavingSlide] = useState<number | null>(null)
  const [progressKey, setProgressKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mobile Swipe handling for Hero
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Stack Carousel State
  const [activeModule, setActiveModule] = useState(0)
  const [leavingModule, setLeavingModule] = useState<number | null>(null)
  const [stackProgressKey, setStackProgressKey] = useState(0)
  const stackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stackExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // DX Tabs State
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'api'>('python')

  // Interactive Architecture State
  const [activeNode, setActiveNode] = useState<'id' | 'mem' | 'tool' | 'class' | 'registry' | 'bus' | 'runtime'>('runtime')

  const goToSlide = useCallback((nextIndex: number) => {
    if (nextIndex === activeSlide) return
    setLeavingSlide(activeSlide)
    setActiveSlide(nextIndex)
    setProgressKey(prev => prev + 1)

    if (timerRef.current) clearTimeout(timerRef.current)
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

    exitTimerRef.current = setTimeout(() => {
      setLeavingSlide(null)
    }, EXIT_DURATION)
  }, [activeSlide])

  // Swipe events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const swipeThreshold = 50
    if (diff > swipeThreshold) {
      goToSlide((activeSlide + 1) % heroSlides.length)
    } else if (diff < -swipeThreshold) {
      goToSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  // Hero auto-advance timer
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goToSlide((activeSlide + 1) % heroSlides.length)
    }, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeSlide, goToSlide])

  useEffect(() => {
    return () => { if (exitTimerRef.current) clearTimeout(exitTimerRef.current) }
  }, [])

  const handleTabClick = (index: number) => {
    if (index === activeSlide) return
    goToSlide(index)
  }

  const goToModule = useCallback((nextIndex: number) => {
    if (nextIndex === activeModule) return
    setLeavingModule(activeModule)
    setActiveModule(nextIndex)
    setStackProgressKey(prev => prev + 1)

    if (stackTimerRef.current) clearTimeout(stackTimerRef.current)
    if (stackExitTimerRef.current) clearTimeout(stackExitTimerRef.current)

    stackExitTimerRef.current = setTimeout(() => {
      setLeavingModule(null)
    }, EXIT_DURATION)
  }, [activeModule])

  const nextModule = () => goToModule((activeModule + 1) % stackModules.length)
  const prevModule = () => goToModule((activeModule - 1 + stackModules.length) % stackModules.length)

  const handleStackTabClick = (index: number) => {
    if (index === activeModule) return
    goToModule(index)
  }

  useEffect(() => {
    stackTimerRef.current = setTimeout(() => {
      goToModule((activeModule + 1) % stackModules.length)
    }, STACK_DURATION)
    return () => { if (stackTimerRef.current) clearTimeout(stackTimerRef.current) }
  }, [activeModule, goToModule])

  useEffect(() => {
    return () => { if (stackExitTimerRef.current) clearTimeout(stackExitTimerRef.current) }
  }, [])

  // Scroll reveal refs
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal()
  const r5 = useReveal(), r6 = useReveal(), r7 = useReveal(), r8 = useReveal()
  const r9 = useReveal(), r10 = useReveal(), r11 = useReveal(), r12 = useReveal()
  const r13 = useReveal(), r14 = useReveal()

  return (
    <>
      {/* ===== NAV ===== */}
      <div className="nav-wrapper">
        <div className="nav">
          <a className="nav-brand" href="#">AgentPhased</a>
          <div className="nav-links">
            <a href="#problem">Why</a>
            <a href="#architecture">Architecture</a>
            <a href="#stack">Stack</a>
            <a href="#quickstart">Get Started</a>
            <a href="https://github.com/samvardhan03/agent_phased" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="nav-badge">v0.1.0</span>
          </div>
        </div>
      </div>

      {/* ===== HERO CAROUSEL WITH VIDEO BACKDROP ===== */}
      <section
        className="hero-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <video
          className="hero-video-bg"
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-overlay" />

        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${activeSlide === i ? ' active' : ''}${leavingSlide === i ? ' leaving' : ''}`}
          >
            <div className="hero-slide-inner">
              <p className="hero-eyebrow">{slide.eyebrow}</p>
              <h2>{slide.headline}</h2>
              <p className="hero-desc">{slide.desc}</p>
              <div className="hero-cta">
                <a className="btn btn-fill" href={slide.cta.href} target={slide.cta.href.startsWith('http') ? '_blank' : undefined} rel={slide.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {slide.cta.label}
                </a>
                {slide.ctaSecondary && (
                  <a className="btn btn-outline" href={slide.ctaSecondary.href} target="_blank" rel="noopener noreferrer">
                    {slide.ctaSecondary.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="hero-tabs">
          {heroSlides.map((slide, i) => (
            <button
              key={`${i}-${progressKey}`}
              className={`hero-tab${activeSlide === i ? ' active' : ''}`}
              onClick={() => handleTabClick(i)}
            >
              <div className="hero-tab-progress" />
              <span className="hero-tab-category">{slide.category}</span>
              <span className="hero-tab-title">{slide.tabTitle}</span>
            </button>
          ))}
        </div>
      </section>
      <video
        className="page-bg-video"
        src="/trail-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* ===== WHY THIS EXISTS ===== */}
      <section className="section-full" style={{ background: 'transparent' }} id="problem">
        <div className="section-full-inner">
          <div ref={r1} className="reveal">
            <p className="section-label">Why This Exists</p>
            <h2 className="section-heading">The problem is infrastructure, not intelligence.</h2>
          </div>
          <div ref={r2} className="reveal reveal-delay-2" style={{ marginBottom: 56 }}>
            <p className="section-subtext" style={{ marginBottom: 0 }}>
              Current agent frameworks treat security, memory, and tool access as afterthoughts.
              AgentPhased treats them as first-class, compiled primitives.
            </p>
          </div>
          <div ref={r3} className="reveal-scale">
            <div className="split-grid">
              <div className="split-col split-col-dark">
                <h3>The Status Quo</h3>
                <ul>
                  <li>API keys hardcoded as plaintext environment variables. No agent-level identity, no per-request signing</li>
                  <li>Memory is unstructured vector dumps with no retrieval guarantees and no namespace isolation</li>
                  <li>Tool integrations are brittle schema wrappers that break when APIs change</li>
                  <li>No audit trail, no event telemetry, no way to trace what an agent did or why</li>
                </ul>
              </div>
              <div className="split-col split-col-accent">
                <h3>The AgentPhased Stack</h3>
                <ul>
                  <li>Ed25519 keypair identity with deterministic fingerprints derived from (name, project). Every request is signed</li>
                  <li>Episodic + semantic memory backed by RocksDB with HNSW indexing and ONNX embeddings — fully local, no API calls</li>
                  <li>Compiled Rust parser that infers schemas from OpenAPI specs and raw HTML automatically</li>
                  <li>Thread-safe EventBus with append-only history. Every tool.called event is logged, signed, and streamable via SSE</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARCHITECTURE ===== */}
      <section className="section" id="architecture">
        <div ref={r4} className="reveal">
          <p className="section-label">Architecture</p>
          <h2 className="section-heading">Three standalone engines. One unified runtime.</h2>
        </div>
        <div ref={r5} className="reveal reveal-delay-1">
          <p className="section-subtext">
            Follows a HashiCorp-style decoupled architecture. Each pillar has its own
            repository, test suite, and release cycle. The runtime composes them through
            a pub/sub EventBus, avoiding tight coupling or inheritance.
          </p>
        </div>
        <div ref={r6} className="reveal-scale reveal-delay-2">
          <div className="arch-grid">
            <div className="arch-diagram-wrap">
              <svg 
                width="100%" 
                viewBox="0 0 800 420" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ maxWidth: 760 }}
                onMouseLeave={() => setActiveNode('runtime')}
              >
                {/* Connection lines base and flows */}
                <g className="arch-lines">
                  <line className="arch-base-line" x1="150" y1="100" x2="150" y2="135" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--id ${activeNode === 'id' ? 'arch-flow-line--active' : ''}`} x1="150" y1="100" x2="150" y2="135" stroke="#2D8C8C" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="150" y1="135" x2="300" y2="175" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--id ${activeNode === 'id' ? 'arch-flow-line--active' : ''}`} x1="150" y1="135" x2="300" y2="175" stroke="#2D8C8C" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="400" y1="100" x2="400" y2="175" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--mem ${activeNode === 'mem' ? 'arch-flow-line--active' : ''}`} x1="400" y1="100" x2="400" y2="175" stroke="#8B6CC1" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="650" y1="100" x2="650" y2="135" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--tool ${activeNode === 'tool' ? 'arch-flow-line--active' : ''}`} x1="650" y1="100" x2="650" y2="135" stroke="#D6AD60" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="650" y1="135" x2="500" y2="175" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--tool ${activeNode === 'tool' ? 'arch-flow-line--active' : ''}`} x1="650" y1="135" x2="500" y2="175" stroke="#D6AD60" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="400" y1="264" x2="400" y2="300" stroke="#DED4C8" strokeWidth="1" strokeDasharray="5 4" />
                  <line className={`arch-flow-line arch-flow-line--runtime ${activeNode === 'class' || activeNode === 'bus' ? 'arch-flow-line--active' : ''}`} x1="400" y1="264" x2="400" y2="300" stroke="#191714" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="330" y1="346" x2="260" y2="380" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--stream ${activeNode === 'bus' ? 'arch-flow-line--active' : ''}`} x1="330" y1="346" x2="260" y2="380" stroke="#746B61" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="400" y1="346" x2="400" y2="380" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--stream ${activeNode === 'bus' ? 'arch-flow-line--active' : ''}`} x1="400" y1="346" x2="400" y2="380" stroke="#746B61" strokeWidth="1.5" />

                  <line className="arch-base-line" x1="470" y1="346" x2="540" y2="380" stroke="#DED4C8" strokeWidth="1" />
                  <line className={`arch-flow-line arch-flow-line--stream ${activeNode === 'bus' ? 'arch-flow-line--active' : ''}`} x1="470" y1="346" x2="540" y2="380" stroke="#746B61" strokeWidth="1.5" />
                </g>

                {/* Component Nodes */}
                <g 
                  className={`arch-node arch-node--id ${activeNode === 'id' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('id')}
                  onClick={() => window.open(archNodesData.id.repo, '_blank')}
                  title="Click to view AgentID Repository"
                >
                  <rect x="50" y="30" width="200" height="70" rx="8" fill="#FFFCF5" stroke="#DED4C8" strokeWidth="1" />
                  <rect x="50" y="30" width="200" height="3" rx="1.5" fill="#2D8C8C" />
                  <text x="150" y="58" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="14" fill="#191714" fontWeight="700">AgentID</text>
                  <text x="150" y="80" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">Ed25519 Identity</text>
                </g>

                <g 
                  className={`arch-node arch-node--mem ${activeNode === 'mem' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('mem')}
                  onClick={() => window.open(archNodesData.mem.repo, '_blank')}
                  title="Click to view AgentMem Repository"
                >
                  <rect x="300" y="30" width="200" height="70" rx="8" fill="#FFFCF5" stroke="#DED4C8" strokeWidth="1" />
                  <rect x="300" y="30" width="200" height="3" rx="1.5" fill="#8B6CC1" />
                  <text x="400" y="58" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="14" fill="#191714" fontWeight="700">AgentMem</text>
                  <text x="400" y="80" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">Episodic + Semantic Memory</text>
                </g>

                <g 
                  className={`arch-node arch-node--tool ${activeNode === 'tool' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('tool')}
                  onClick={() => window.open(archNodesData.tool.repo, '_blank')}
                  title="Click to view Agentool Repository"
                >
                  <rect x="550" y="30" width="200" height="70" rx="8" fill="#FFFCF5" stroke="#DED4C8" strokeWidth="1" />
                  <rect x="550" y="30" width="200" height="3" rx="1.5" fill="#D6AD60" />
                  <text x="650" y="58" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="14" fill="#191714" fontWeight="700">Agentool</text>
                  <text x="650" y="80" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">Schema Inference + MCP</text>
                </g>

                <circle cx="300" cy="175" r="3" fill="#EFE7DA" />
                <circle cx="400" cy="175" r="3" fill="#EFE7DA" />
                <circle cx="500" cy="175" r="3" fill="#EFE7DA" />
                
                <rect x="165" y="160" width="470" height="82" rx="10" fill="none" stroke="#DED4C8" strokeWidth="1" strokeDasharray="6 4" />
                <text x="400" y="254" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#746B61" fontWeight="500" letterSpacing="0.08em">AGENTPHASED RUNTIME</text>
                
                <g 
                  className={`arch-node arch-node--class ${activeNode === 'class' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('class')}
                  onClick={() => window.open(archNodesData.class.repo, '_blank')}
                  title="Click to view Runtime Repository"
                >
                  <rect x="180" y="175" width="250" height="55" rx="8" fill="#FFFCF5" stroke="#191714" strokeWidth="1.5" />
                  <text x="305" y="202" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#191714" fontWeight="700">Agent Class</text>
                </g>

                <g 
                  className={`arch-node arch-node--registry ${activeNode === 'registry' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('registry')}
                  onClick={() => window.open(archNodesData.registry.repo, '_blank')}
                  title="Click to view Runtime Repository"
                >
                  <rect x="460" y="175" width="160" height="55" rx="8" fill="#FFFCF5" stroke="#DED4C8" strokeWidth="1" />
                  <text x="540" y="202" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#746B61" fontWeight="500">ToolRegistry</text>
                </g>
                
                <line x1="460" y1="202" x2="430" y2="202" stroke="#DED4C8" strokeWidth="1" />

                <g 
                  className={`arch-node arch-node--bus ${activeNode === 'bus' ? 'arch-node--active' : ''}`}
                  onMouseEnter={() => setActiveNode('bus')}
                  onClick={() => window.open(archNodesData.bus.repo, '_blank')}
                  title="Click to view Runtime Repository"
                >
                  <rect x="270" y="300" width="260" height="46" rx="8" fill="#EFE7DA" stroke="#DED4C8" strokeWidth="1" />
                  <text x="400" y="323" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#746B61" fontWeight="500">EventBus (pub/sub, append-only)</text>
                </g>
                
                <text x="260" y="398" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">SSE Stream</text>
                <text x="400" y="398" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">Dashboard</text>
                <text x="540" y="398" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#746B61">CLI / SDK</text>
              </svg>
            </div>

            <div className="arch-detail-card" style={{ borderTop: `4px solid ${archNodesData[activeNode].color || '#746B61'}` }}>
              <div className="arch-detail-header">
                <span className="arch-detail-tag">
                  {archNodesData[activeNode].tag}
                </span>
                <h3 className="arch-detail-title">{archNodesData[activeNode].title}</h3>
                <p className="arch-detail-desc">{archNodesData[activeNode].desc}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 className="arch-detail-features-title">Core Capability</h4>
                <ul className="arch-detail-features">
                  {archNodesData[activeNode].features.map((feat, index) => (
                    <li key={index} className="arch-detail-feature-item">{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="arch-detail-footer">
                <a 
                  className="arch-detail-btn" 
                  href={archNodesData[activeNode].repo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Explore Codebase
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div ref={r7} className="reveal reveal-delay-3">
          <div className="arch-stats">
            <div className="arch-stat"><div className="arch-stat-val">PyO3</div><div className="arch-stat-label">Rust → Python FFI</div></div>
            <div className="arch-stat"><div className="arch-stat-val">Tokio</div><div className="arch-stat-label">Async MCP Server</div></div>
            <div className="arch-stat"><div className="arch-stat-val">RocksDB</div><div className="arch-stat-label">Storage Backend</div></div>
            <div className="arch-stat"><div className="arch-stat-val">HNSW</div><div className="arch-stat-label">Vector Indexing</div></div>
          </div>
        </div>
      </section>

      {/* ===== DEVELOPER EXPERIENCE ===== */}
      <section className="section-full" style={{ background: 'transparent' }}>
        <div className="section-full-inner">
          <div ref={r8} className="reveal">
            <p className="section-label">Developer Experience</p>
            <h2 className="section-heading">Five lines to a production agent.</h2>
            <p className="section-subtext">No boilerplate. No YAML configs. Import, connect, ship.</p>
          </div>
          <div className="code-layout">
            <div className="code-features">
              <div ref={r9} className="reveal-left code-feature">
                <h4>Automatic Tool Wiring</h4>
                <p>Pass a URL. The Rust parser infers the OpenAPI schema, caches it in AgentMem, and signs every request with AgentID automatically.</p>
              </div>
              <div ref={r10} className="reveal-left code-feature" style={{ transitionDelay: '0.12s' }}>
                <h4>Episodic Memory Logging</h4>
                <p>Every tool invocation fires a <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--ink)', padding: '1px 6px', borderRadius: '3px', fontSize: '12px', color: 'var(--cream)' }}>tool.called</code> event on the EventBus. The default subscriber persists it as a structured episode: action, result_summary, timestamp.</p>
              </div>
              <div ref={r11} className="reveal-left code-feature" style={{ transitionDelay: '0.24s' }}>
                <h4>Semantic Recall</h4>
                <p>Query memory in natural language. HNSW approximate nearest-neighbor search over ONNX embeddings. Fully local, no external embedding API calls.</p>
              </div>
              <div ref={r12} className="reveal-left code-feature" style={{ transitionDelay: '0.36s' }}>
                <h4>Event Telemetry</h4>
                <p>Subscribe to any topic on the thread-safe EventBus. Stream events to the dashboard via SSE, pipe them to your logging stack, or build custom reactive workflows.</p>
              </div>
            </div>
            <div ref={r13} className="reveal-right" style={{ transitionDelay: '0.15s' }}>
              <div className="code-tabs">
                <button className={`code-tab ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>Python</button>
                <button className={`code-tab ${activeTab === 'typescript' ? 'active' : ''}`} onClick={() => setActiveTab('typescript')}>TypeScript</button>
                <button className={`code-tab ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>REST API</button>
              </div>
              {activeTab === 'python' && (
                <div className="code-block">
                  <span className="cm">{'# One object. Three engines. Full audit trail.'}</span>{'\n'}
                  <span className="kw">from</span>{' agentphased '}<span className="kw">import</span>{' Agent\n\n'}
                  {'agent = Agent(\n    name='}<span className="str">"sentinel"</span>{',\n    project='}<span className="str">"acme-corp"</span>{',\n)\n\n'}
                  <span className="cm">{'# Register an API — schema inferred automatically'}</span>{'\n'}
                  {'agent.tools.add('}<span className="str">"https://api.stripe.com/v1"</span>{')\n\n'}
                  <span className="cm">{'# Call a method — signed, logged, streamed'}</span>{'\n'}
                  {'result = agent.tools.call(\n    '}<span className="str">"https://api.stripe.com/v1"</span>{',\n    '}<span className="str">"listCharges"</span>{',\n)\n\n'}
                  <span className="cm">{'# Recall from episodic + semantic memory'}</span>{'\n'}
                  {'history = agent.memory.recall('}<span className="str">"stripe charges"</span>{')\n\n'}
                  <span className="cm">{'# Real-time telemetry via EventBus'}</span>{'\n'}
                  {'agent.bus.subscribe(\n    '}<span className="str">"tool.called"</span>{',\n    '}<span className="kw">lambda</span>{' e: '}<span className="kw">print</span>{'(f"[{e[\'url\']}] {e[\'method\']}")\n)'}
                </div>
              )}
              {activeTab === 'typescript' && (
                <div className="code-block">
                  <span className="kw">import</span>{' { Agent } '}<span className="kw">from</span>{' '}<span className="str">"agentphased"</span>{';\n\n'}
                  <span className="kw">const</span>{' agent = '}<span className="kw">new</span>{' Agent({\n  name: '}<span className="str">"sentinel"</span>{',\n  project: '}<span className="str">"acme-corp"</span>{',\n});\n\n'}
                  <span className="kw">await</span>{' agent.tools.add('}<span className="str">"https://api.stripe.com/v1"</span>{');\n\n'}
                  <span className="kw">const</span>{' result = '}<span className="kw">await</span>{' agent.tools.call(\n  '}<span className="str">"https://api.stripe.com/v1"</span>{',\n  '}<span className="str">"listCharges"</span>{',\n);\n\n'}
                  <span className="kw">const</span>{' history = '}<span className="kw">await</span>{' agent.memory.recall('}<span className="str">"stripe charges"</span>{');\nconsole.log(history);'}
                </div>
              )}
              {activeTab === 'api' && (
                <div className="code-block">
                  <span className="cm">{'# Identity — deterministic fingerprint'}</span>{'\n'}
                  {'curl http://localhost:8000/api/identity\n\n'}
                  <span className="cm">{'# Register a tool'}</span>{'\n'}
                  {'curl -X POST \\\n  "http://localhost:8000/api/tools/add?url=https://api.stripe.com/v1"\n\n'}
                  <span className="cm">{'# Query episodic memory'}</span>{'\n'}
                  {'curl "http://localhost:8000/api/memory/episodes?limit=10"\n\n'}
                  <span className="cm">{'# Real-time SSE event stream'}</span>{'\n'}
                  {'curl -N http://localhost:8000/api/events'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE STACK — SLIDESHOW CAROUSEL ===== */}
      <section className="section stack-section" id="stack">
        <div ref={r14} className="reveal stack-section-header">
          <div>
            <p className="section-label">The Stack</p>
            <h2 className="section-heading">Built standalone. Integrated later.</h2>
            <p className="section-subtext" style={{ marginBottom: 0 }}>
              Each engine has its own repository, test suite, and release cycle.
              Use one module or all three; they compose through the AgentPhased runtime.
            </p>
          </div>
          <div className="stack-controls-wrap">
            <button className="stack-arrow-btn" onClick={prevModule} aria-label="Previous Module">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button className="stack-arrow-btn" onClick={nextModule} aria-label="Next Module">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

        {/* Rotating card carousel — one card visible at a time */}
        <div className="stack-carousel">
          {stackModules.map((mod, i) => (
            <div
              key={mod.id}
              className={`stack-card${activeModule === i ? ' active' : ''}${leavingModule === i ? ' leaving' : ''}`}
            >
              <div className="stack-card-inner">
                <div className="module-header">
                  <div className="module-left">
                    <div className={`module-tag ${mod.tagClass}`}>{mod.tag}</div>
                    <h3 className="module-name">{mod.id}</h3>
                    <p className="module-desc">{mod.desc}</p>
                    <a className="module-link" href={mod.href} target="_blank" rel="noopener noreferrer">
                      View Repository
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                    </a>
                  </div>
                  <div className="module-features">
                    {mod.features.map((feat) => (
                      <div key={feat.title} className="module-feature-card">
                        <h4>{feat.title}</h4>
                        {'text' in feat && feat.text ? <p>{feat.text}</p> : null}
                        {'specs' in feat && feat.specs ? feat.specs.map((s) => (
                          <div key={s.key} className="spec-row">
                            <span className="spec-key">{s.key}</span>
                            <span className="spec-val">{s.val}</span>
                          </div>
                        )) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="stack-tabs">
            {stackModules.map((mod, i) => (
              <button
                key={`${mod.id}-${stackProgressKey}`}
                className={`stack-tab-btn${activeModule === i ? ' active' : ''}`}
                onClick={() => handleStackTabClick(i)}
              >
                <div className="stack-tab-progress" />
                <span className="stack-tab-label">{mod.id}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUICKSTART ===== */}
      <section className="section-full" style={{ background: 'transparent' }} id="quickstart">
        <div className="section-full-inner">
          <div className="qs-layout">
            <div>
              <div className="reveal" ref={(el) => {
                if (el && !el.classList.contains('_observed')) {
                  el.classList.add('_observed')
                  const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } }, { threshold: 0.15 })
                  obs.observe(el)
                }
              }}>
                <p className="section-label">Get Started</p>
                <h2 className="section-heading">Running in under a minute.</h2>
                <p className="section-subtext">
                  Clone the repo, install the package, launch the runtime with the
                  real-time SSE dashboard.
                </p>
              </div>
              <div className="qs-steps">
                <div className="qs-step"><div className="qs-step-num">1</div><div className="qs-step-text">Install: <code>pip install agentphased</code></div></div>
                <div className="qs-step"><div className="qs-step-num">2</div><div className="qs-step-text">Or clone locally: <code>pip install -e .</code></div></div>
                <div className="qs-step"><div className="qs-step-num">3</div><div className="qs-step-text">Launch runtime + dashboard: <code>./start.sh</code></div></div>
                <div className="qs-step"><div className="qs-step-num">4</div><div className="qs-step-text">Dashboard at <code>http://localhost:5175</code>, featuring a live SSE event stream</div></div>
              </div>
            </div>
            <div className="qs-right">
              <div className="code-block" style={{ borderRadius: 8 }}>
                <span className="cm">{'# Clone and install'}</span>{'\n'}
                {'git clone https://github.com/samvardhan03/agent_phased.git\ncd agent_phased\npip install -e .\n\n'}
                <span className="cm">{'# Launch runtime + dashboard'}</span>{'\n'}
                {'./start.sh\n\n'}
                <span className="cm">{'# Or use directly in Python'}</span>{'\n'}
                <span className="kw">from</span>{' agentphased '}<span className="kw">import</span>{' Agent\n\n'}
                {'agent = Agent(\n    name='}<span className="str">"sentinel"</span>{',\n    project='}<span className="str">"acme-corp"</span>{',\n)\n\n'}
                <span className="kw">print</span>{'(agent.fingerprint)\n'}
                <span className="cm">{'# → deterministic, reproducible'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESIGN PHILOSOPHY ===== */}
      <section className="section">
        <div className="reveal" ref={(el) => {
          if (el && !el.classList.contains('_observed')) {
            el.classList.add('_observed')
            const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } }, { threshold: 0.15 })
            obs.observe(el)
          }
        }}>
          <p className="section-label">Design Philosophy</p>
          <h2 className="section-heading">HashiCorp-style decoupled infrastructure.</h2>
          <p className="section-subtext">Build each tool as a standalone, production-grade system. Provide a thin orchestration layer for the integrated experience.</p>
        </div>
        <div className="reveal-scale" ref={(el) => {
          if (el && !el.classList.contains('_observed')) {
            el.classList.add('_observed')
            const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } }, { threshold: 0.1 })
            obs.observe(el)
          }
        }}>
          <table className="phil-table">
            <thead><tr><th>Principle</th><th>Implementation</th></tr></thead>
            <tbody>
              <tr><td>Standalone First</td><td>Each pillar has its own repository, test suite, and release cycle. AgentID, AgentMem, and Agentool ship independently.</td></tr>
              <tr><td>Compiled Cores</td><td>Memory and tool parsing are Rust compiled to native Python extensions via PyO3, not Python wrappers around SQLite.</td></tr>
              <tr><td>Event-Driven Glue</td><td>The unification layer is a thread-safe pub/sub EventBus with append-only history, not inheritance or tight coupling.</td></tr>
              <tr><td>No Vendor Lock-in</td><td>Zero cloud dependencies. ONNX embeddings run locally. RocksDB stores data on disk. Entire stack runs on localhost.</td></tr>
              <tr><td>Auditable by Default</td><td>Every tool invocation is signed with Ed25519, logged as an episodic memory entry, and streamable via SSE in real-time.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <span className="footer-text">AgentPhased v0.1.0. Open Source under MIT. Built for engineers who ship.</span>
            <div className="footer-creators">
              <span>Created by</span>
              <a href="https://muskangujar.vercel.app/" target="_blank" rel="noopener noreferrer">Muskan Gujar</a>
              <span>&</span>
              <a href="https://samvardhan.vercel.app/" target="_blank" rel="noopener noreferrer">Samvardhan Singh</a>
            </div>
          </div>
          <div className="footer-links">
            <a href="https://github.com/samvardhan03/agent_phased" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://github.com/samvardhan03/AgentID" target="_blank" rel="noopener noreferrer">AgentID</a>
            <a href="https://github.com/Muskangujar/AgentMem" target="_blank" rel="noopener noreferrer">AgentMem</a>
            <a href="https://github.com/Muskangujar/Agentool" target="_blank" rel="noopener noreferrer">Agentool</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App

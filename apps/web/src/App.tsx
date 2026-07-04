function App() {
  return (
    <>
      {/* Navigation */}
      <div className="nav">
        <a className="nav-brand" href="#">AgentPhased</a>
        <div className="nav-links">
          <a href="#">Docs</a>
          <a href="https://github.com/samvardhan03/agent_phased">GitHub</a>
          <span className="badge">v0.1.0</span>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <h1>Stop Giving Your AI Agents Root Access.</h1>
        <p className="subtitle">
          The open-source operating system for autonomous agents. Cryptographic
          identity, structured memory, and dynamic tool use -- in one decoupled
          stack.
        </p>
        <div className="cta-group">
          <a className="btn-primary" href="#architecture">View Documentation</a>
          <a className="btn-secondary" href="https://github.com/samvardhan03/agent_phased">GitHub</a>
        </div>
      </div>

      <div className="divider" />

      {/* Problem vs Solution */}
      <div className="section">
        <p className="section-label">WHY THIS EXISTS</p>
        <h2 className="section-heading">The problem is infrastructure, not intelligence.</h2>
        <div className="comparison">
          <div className="problem">
            <h3>The Status Quo</h3>
            <ul>
              <li>Hardcoded API keys passed as plaintext environment variables</li>
              <li>Memory reduced to unstructured vector dumps with no retrieval guarantees</li>
              <li>Tool integrations built on brittle, hand-scraped schema wrappers</li>
              <li>No audit trail. No identity. No accountability.</li>
            </ul>
          </div>
          <div className="solution">
            <h3>The AgentPhased Stack</h3>
            <ul>
              <li>Ed25519 keypair identity with deterministic fingerprints per agent</li>
              <li>Episodic and semantic memory backed by RocksDB and HNSW indexing</li>
              <li>Automatic OpenAPI and HTML schema inference via compiled Rust parser</li>
              <li>Unified event bus with full telemetry for every tool invocation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Architecture */}
      <div className="section" id="architecture">
        <p className="section-label">ARCHITECTURE</p>
        <h2 className="section-heading">Three standalone engines. One unified runtime.</h2>
        <div className="arch-diagram">
          <svg
            width="100%"
            viewBox="0 0 800 400"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: 800 }}
          >
            {/* AgentID Box */}
            <rect x="50" y="30" width="200" height="60" fill="white" stroke="#d4d4d4" strokeWidth="1" />
            <rect x="50" y="30" width="3" height="60" fill="#06b6d4" />
            <text x="150" y="53" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#0a0a0a" fontWeight="600">AgentID</text>
            <text x="150" y="73" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#737373">Cryptographic Identity</text>

            {/* AgentMem Box */}
            <rect x="300" y="30" width="200" height="60" fill="white" stroke="#d4d4d4" strokeWidth="1" />
            <rect x="300" y="30" width="3" height="60" fill="#8b5cf6" />
            <text x="400" y="53" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#0a0a0a" fontWeight="600">AgentMem</text>
            <text x="400" y="73" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#737373">Persistent Memory</text>

            {/* Agentool Box */}
            <rect x="550" y="30" width="200" height="60" fill="white" stroke="#d4d4d4" strokeWidth="1" />
            <rect x="550" y="30" width="3" height="60" fill="#f59e0b" />
            <text x="650" y="53" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#0a0a0a" fontWeight="600">Agentool</text>
            <text x="650" y="73" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#737373">Tool Execution</text>

            {/* Lines from boxes to runtime */}
            <line x1="150" y1="90" x2="150" y2="170" stroke="#d4d4d4" strokeWidth="1" />
            <line x1="400" y1="90" x2="400" y2="170" stroke="#d4d4d4" strokeWidth="1" />
            <line x1="650" y1="90" x2="650" y2="170" stroke="#d4d4d4" strokeWidth="1" />

            {/* Runtime Box */}
            <rect x="200" y="170" width="400" height="60" fill="white" stroke="#0a0a0a" strokeWidth="2" />
            <text x="400" y="200" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#0a0a0a" fontWeight="700">AgentPhased Runtime</text>

            {/* Line to EventBus */}
            <line x1="400" y1="230" x2="400" y2="270" stroke="#d4d4d4" strokeWidth="1" strokeDasharray="4 4" />

            {/* EventBus Box */}
            <rect x="250" y="270" width="300" height="50" fill="white" stroke="#d4d4d4" strokeWidth="1" strokeDasharray="4 4" />
            <text x="400" y="295" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#0a0a0a">EventBus</text>

            {/* Line from EventBus down */}
            <line x1="400" y1="320" x2="400" y2="350" stroke="#d4d4d4" strokeWidth="1" />

            {/* Bottom labels */}
            <text x="400" y="370" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#0a0a0a">SSE / WebSocket</text>
            <text x="400" y="395" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#737373">Dashboard / Client</text>
          </svg>
        </div>
      </div>

      <div className="divider" />

      {/* Developer Experience */}
      <div className="section">
        <p className="section-label">DEVELOPER EXPERIENCE</p>
        <h2 className="section-heading">Five lines to a production agent.</h2>
        <div className="code-section">
          <span className="kw">from</span>{' agentphased '}<span className="kw">import</span>{' Agent'}{'\n'}
          {'\n'}
          {'agent = Agent(name='}<span className="str">"sentinel"</span>{', project='}<span className="str">"acme-corp"</span>{')'}{'\n'}
          {'\n'}
          {'agent.tools.add('}<span className="str">"https://api.stripe.com/v1"</span>{')'}{'\n'}
          {'result = agent.tools.call('}<span className="str">"https://api.stripe.com/v1"</span>{', '}<span className="str">"listCharges"</span>{')'}{'\n'}
          {'\n'}
          <span className="kw">print</span>{'(agent.memory.recall('}<span className="str">"last billing query"</span>{'))'}{'\n'}
        </div>
      </div>

      <div className="divider" />

      {/* The Stack */}
      <div className="section">
        <p className="section-label">THE STACK</p>
        <h2 className="section-heading">Built standalone. Integrated later.</h2>
        <div className="grid-3">
          <div>
            <h3><span className="pillar-bar pillar-id"></span>AgentID</h3>
            <p>Ed25519 cryptographic identity. Deterministic fingerprints. Request signing and verification. Use it standalone to give any process a verifiable identity.</p>
          </div>
          <div>
            <h3><span className="pillar-bar pillar-mem"></span>AgentMem</h3>
            <p>RocksDB-backed episodic and semantic memory. HNSW vector indexing with ONNX embeddings. Compiled Rust core exposed via PyO3.</p>
          </div>
          <div>
            <h3><span className="pillar-bar pillar-tool"></span>Agentool</h3>
            <p>Automatic API schema inference from OpenAPI specs and raw HTML. Tokio-based MCP server. Native Python extension via PyO3.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        AgentPhased v0.1.0 -- Open Source under MIT. Built for engineers who ship.
      </div>
    </>
  )
}

export default App

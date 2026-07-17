/* ==========================================================================
   Svantero / SVO2 — Shared MVP logic (mock data + UI helpers)
   This is an illustrative, front-end-only demo. No real wallet, blockchain,
   or exchange connection is made — all data and actions are simulated.
   ========================================================================== */

const SVO2 = (() => {

  const state = {
    walletConnected: false,
    walletAddress: null,
    svoStaked: 12500,
    accumulatedCredits: 3240,
    redeemableCredits: 3100,
    svoPrice: 0.42,
  };

  const creditTypes = [
    { type: "Regenerative Urbanisation (RAK)", ticker: "RAK-URB", price: 18.40, units: 42000, color: "#282e35", targetBeta: 0.90, trustClass: "Class I" },
    { type: "Nature-Based Removal (Multi-Origin)", ticker: "NAT-REM", price: 21.75, units: 31500, color: "#454e58", targetBeta: 1.15, trustClass: "Class II" },
    { type: "Renewable Energy Avoidance", ticker: "REN-AVD", price: 9.60,  units: 27800, color: "#C9A227", targetBeta: 0.75, trustClass: "Class II" },
    { type: "Industrial Efficiency Credits", ticker: "IND-EFF", price: 14.20, units: 19600, color: "#8a6a10", targetBeta: 1.30, trustClass: "Class III" },
    { type: "Blue Carbon / Coastal Projects", ticker: "BLU-CST", price: 26.90, units: 12300, color: "#6b7480", targetBeta: 1.50, trustClass: "Class IV" },
  ];

  /* ---------------- Governance & Trust Layer (mock) ----------------
     Conceptually inspired by institutional real-world-asset trust
     infrastructure: every tokenised carbon credit is bound to a Trust
     Class, an independent verification event, and a live operator bond
     before it can be minted. This mock data is shared across the
     Tokenisation and Lifecycle pages to demonstrate that governance
     signals flow through the whole platform, not just one screen. */
  const trustClasses = [
    { cls: "Class I", name: "Sovereign & Institutional Origination",
      desc: "Government-backed or large-scale institutional projects (e.g. RAK regenerative urbanisation) with continuous, multi-year MRV.",
      bonding: "3.0% of tokenised value", cadence: "Continuous / quarterly review" },
    { cls: "Class II", name: "Standardised Methodology Projects",
      desc: "Renewable-energy and avoidance projects certified under widely recognised, standardised methodologies.",
      bonding: "2.0% of tokenised value", cadence: "Semi-annual" },
    { cls: "Class III", name: "Industrial & Efficiency Projects",
      desc: "Industrial efficiency and process-improvement credits with shorter, well-defined verification cycles.",
      bonding: "2.5% of tokenised value", cadence: "Semi-annual" },
    { cls: "Class IV", name: "Emerging & Pilot Projects",
      desc: "New project types or first-time origination partners, carrying the highest uncertainty and closest monitoring.",
      bonding: "5.0% of tokenised value", cadence: "Quarterly, enhanced monitoring" },
  ];

  const verificationEvents = [
    { project: "RAK Regenerative Urbanisation — Phase 2", cls: "Class I", verifier: "Independent PCS Registrar", status: "Verified", ts: "2026-07-12 09:14" },
    { project: "Multi-Origin Partner — Nature-Based Removal Site 4", cls: "Class II", verifier: "Third-Party Certification Body", status: "Verified", ts: "2026-07-11 16:40" },
    { project: "Industrial Efficiency Partner — Line 3 Retrofit", cls: "Class III", verifier: "Independent Auditor", status: "Pending bond top-up", ts: "2026-07-11 08:02" },
    { project: "Blue Carbon Pilot — Coastal Mangrove Site", cls: "Class IV", verifier: "Independent PCS Registrar", status: "Verified", ts: "2026-07-10 13:55" },
  ];

  const mintConditions = [
    "Independent verification event recorded and signed",
    "Applicable Carbon Trust Class assigned",
    "Origination partner bond posted and confirmed live",
    "No open dispute or slashing flag on the project",
  ];

  /* ---------------- Derivatives (mock) ---------------- */
  const futuresContracts = [
    { contract: "RAK-URB-DEC26", underlying: "Regenerative Urbanisation (RAK)", expiry: "2026-12-18", mark: 18.62, basis: "+1.2%", oi: 84000, funding: "+0.010%/8h" },
    { contract: "NAT-REM-DEC26", underlying: "Nature-Based Removal (Multi-Origin)", expiry: "2026-12-18", mark: 22.05, basis: "+1.4%", oi: 61500, funding: "+0.014%/8h" },
    { contract: "REN-AVD-MAR27", underlying: "Renewable Energy Avoidance", expiry: "2027-03-19", mark: 9.72, basis: "+1.3%", oi: 53200, funding: "+0.006%/8h" },
    { contract: "IND-EFF-MAR27", underlying: "Industrial Efficiency Credits", expiry: "2027-03-19", mark: 14.55, basis: "+2.5%", oi: 28900, funding: "+0.018%/8h" },
    { contract: "BLU-CST-JUN27", underlying: "Blue Carbon / Coastal Projects", expiry: "2027-06-18", mark: 27.90, basis: "+3.7%", oi: 15400, funding: "+0.022%/8h" },
  ];

  const optionsChain = [
    { underlying: "Regenerative Urbanisation (RAK)", strike: 19.00, type: "Call", premium: 0.92, expiry: "2026-09-25", delta: 0.46 },
    { underlying: "Regenerative Urbanisation (RAK)", strike: 18.00, type: "Put", premium: 0.71, expiry: "2026-09-25", delta: -0.41 },
    { underlying: "Nature-Based Removal (Multi-Origin)", strike: 22.50, type: "Call", premium: 1.18, expiry: "2026-09-25", delta: 0.44 },
    { underlying: "Renewable Energy Avoidance", strike: 10.00, type: "Call", premium: 0.38, expiry: "2026-09-25", delta: 0.39 },
    { underlying: "Industrial Efficiency Credits", strike: 15.00, type: "Put", premium: 0.66, expiry: "2026-12-18", delta: -0.37 },
    { underlying: "Blue Carbon / Coastal Projects", strike: 28.00, type: "Call", premium: 1.84, expiry: "2026-12-18", delta: 0.48 },
  ];

  /* ---------------- Tokenised Production-Linked Royalties ----------------
     A second tokenised asset class alongside carbon credits: fractional,
     yield-bearing rights to a pro-rata share of verified production
     revenue from an underlying decarbonisation project, structured as a
     regulated security via a bankruptcy-remote SPV and issued as an
     ERC-3643 (T-REX) token. SVBR is real, sourced directly from Svantero's
     published Namibia biomass rights tokenisation specification. The
     RAK-specific products are new and illustrative, modelled on the same
     structure, pending final structuring and regulatory sign-off. */
  const royaltyProducts = [
    {
      id: "SVBR",
      name: "Svantero Namibia Biomass Rights",
      symbol: "SVBR",
      location: "Khomas Region, Namibia",
      underlying: "20,000 ha of sustainable encroacher-bush harvesting rights across three farms — Otjompaue Süd (5,500 ha), Hochland (9,500 ha), and Okariro (5,000 ha) — held in a bankruptcy-remote SPV.",
      totalSupply: 4000,
      unitLabel: "5 ha",
      hectaresPerToken: 5,
      priceUsd: 5000,
      royaltyDesc: "$48 per ton of biochar sold, plus $0.96 per litre of wood vinegar sold — pro-rata to token holders, paid quarterly.",
      term: "5 years (2026–2031)",
      principalRepayment: 5000,
      irr: 0.48,
      moic: 7.71,
      totalCashReturn: 38535,
      collateralValueUsd: 716000000,
      ltv: 0.03,
      standard: "ERC-3643 (T-REX)",
      regulator: "FSRC — St. Kitts & Nevis (sophisticated / professional investors only)",
      status: "live",
      illustrative: false,
      annualCashflowPerHectare: [
        { year: 2026, royalty: 450, principal: 0 },
        { year: 2027, royalty: 907, principal: 0 },
        { year: 2028, royalty: 1075, principal: 0 },
        { year: 2029, royalty: 1285, principal: 0 },
        { year: 2030, royalty: 1495, principal: 0 },
        { year: 2031, royalty: 1495, principal: 1000 },
      ],
    },
    {
      id: "SVRR-RAK1",
      name: "RAK Regenerative Urbanisation Royalty Rights",
      symbol: "SVRR-RAK1",
      location: "Ras Al Khaimah, UAE",
      underlying: "Production-linked royalty on verified carbon credits issued and sold from Svantero's RAK regenerative urbanisation project (Carbon Trust Class I).",
      totalSupply: 2000,
      unitLabel: "1 royalty unit",
      hectaresPerToken: null,
      priceUsd: 1000,
      royaltyDesc: "$1.20 per verified tCO2e credit issued and sold from the project — pro-rata to token holders, paid quarterly.",
      term: "5 years (2027–2032)",
      principalRepayment: 1000,
      irr: 0.22,
      moic: 2.4,
      totalCashReturn: 2400,
      collateralValueUsd: 45000000,
      ltv: 0.044,
      standard: "ERC-3643 (T-REX)",
      regulator: "RAK DAO free zone / FSRA MTF licensing track",
      status: "illustrative",
      illustrative: true,
    },
    {
      id: "SVRR-RAK2",
      name: "RAK Blue Carbon Coastal Royalty Rights",
      symbol: "SVRR-RAK2",
      location: "Ras Al Khaimah coastal zone, UAE",
      underlying: "Production-linked royalty on verified blue-carbon credits from mangrove and coastal restoration projects (Carbon Trust Class IV).",
      totalSupply: 1500,
      unitLabel: "1 royalty unit",
      hectaresPerToken: null,
      priceUsd: 750,
      royaltyDesc: "$1.65 per verified tCO2e blue-carbon credit issued and sold — pro-rata to token holders, paid quarterly.",
      term: "5 years (2027–2032)",
      principalRepayment: 750,
      irr: 0.19,
      moic: 2.1,
      totalCashReturn: 1575,
      collateralValueUsd: 22000000,
      ltv: 0.051,
      standard: "ERC-3643 (T-REX)",
      regulator: "RAK DAO free zone / FSRA MTF licensing track",
      status: "illustrative",
      illustrative: true,
    },
  ];

  /* ---------------- Staking & Yield Farming (mock) ---------------- */
  const stakingPools = [
    { name: "SVO₂ Single-Stake", desc: "Stake SVO₂ alone to earn a share of platform fee revenue.", apy: 8.4, tvl: 18400000, lockup: "Flexible / 12mo boost" },
    { name: "SVO₂ / USDT Liquidity Pool", desc: "Provide SVO₂/USDT liquidity to the exchange and earn trading fees plus rewards.", apy: 14.2, tvl: 9600000, lockup: "Flexible" },
    { name: "SVO₂ / Carbon Credit Index LP", desc: "Provide liquidity paired against a basket of tokenised carbon credits.", apy: 19.7, tvl: 5200000, lockup: "90-day minimum" },
  ];

  const marketNews = [
    { src: "Carbon Pulse", headline: "Voluntary carbon credit prices trend upward as compliance-grade demand grows." },
    { src: "BloombergNEF", headline: "Analysts project continued carbon credit price appreciation through 2030." },
    { src: "Svantero Desk", headline: "Multi-origin sourcing pipeline adds two new verified project partners this quarter." },
    { src: "RAK DAO", headline: "Free zone licensing track for digital-asset platforms continues to expand regionally." },
    { src: "Svantero Desk", headline: "SVO₂ buyback-and-burn volume up on higher exchange trading activity." },
  ];

  const tokenomics = [
    { label: "Unlocked (Years 2–20)", value: 720500000, color: "#282e35" },
    { label: "DEX / Public Listing", value: 20000000, color: "#454e58" },
    { label: "Founders", value: 20000000, color: "#C9A227" },
    { label: "Pre-Sale", value: 18000000, color: "#8a6a10" },
    { label: "Treasury / Liquidity", value: 15000000, color: "#6b7480" },
    { label: "Partnerships", value: 5000000, color: "#b08d2b" },
    { label: "Pre-Seed", value: 1500000, color: "#d8c48a" },
  ];

  const lifecycleStages = [
    { name: "Verification", desc: "Independent certification bodies, satellite imagery, and AI-driven monitoring confirm a project's carbon credit claims before anything enters the pipeline." },
    { name: "Issuance & Registry Listing", desc: "Verified credits are formally issued and recorded on the relevant carbon credit registry, establishing a clean chain of custody." },
    { name: "Tokenisation", desc: "Each registry-listed credit is converted into an on-chain, SVO₂-denominated token via the Tokenisation Engine, with full traceability back to the source project." },
    { name: "Distribution", desc: "Tokenised credits are distributed into the platform treasury and to staking participants according to the yield formula Yc = (Vt × Fr) / Sc." },
    { name: "Trading", desc: "Tokenised credits become available for buying and selling on the Decentralised Carbon Exchange, with full pricing transparency." },
    { name: "Audit", desc: "Every transaction and holding is auditable on-chain, with downloadable reports available for ESG disclosure and regulatory review." },
    { name: "Retirement", desc: "When a credit is used to offset emissions, it is permanently retired on-chain and a certificate is generated, preventing any possibility of double-counting." },
  ];

  /* ---------------- Tokenisation Progress (mock) ----------------
     Live status of individual carbon credit batches as they move through
     the seven lifecycleStages above. Shared so the Tokenisation Engine
     page can render a real-time pipeline view instead of a static chart. */
  const tokenisationQueue = [
    { project: "RAK Regenerative Urbanisation — Phase 2", volume: 12400, trustClass: "Class I", stage: 5, updated: "2026-07-13" },
    { project: "Multi-Origin — Nature-Based Removal Site 4", volume: 8200, trustClass: "Class II", stage: 2, updated: "2026-07-14" },
    { project: "Renewable Energy Avoidance — Wind Cluster 3", volume: 15600, trustClass: "Class II", stage: 4, updated: "2026-07-12" },
    { project: "Industrial Efficiency — Line 3 Retrofit", volume: 4300, trustClass: "Class III", stage: 0, updated: "2026-07-14" },
    { project: "Blue Carbon Pilot — Coastal Mangrove Site", volume: 3100, trustClass: "Class IV", stage: 1, updated: "2026-07-13" },
    { project: "RAK Regenerative Urbanisation — Phase 1", volume: 21000, trustClass: "Class I", stage: 6, updated: "2026-07-09" },
  ];

  const orderBook = {
    bids: [
      { price: 18.35, size: 1200 }, { price: 18.30, size: 2400 }, { price: 18.25, size: 3100 },
      { price: 18.15, size: 1800 }, { price: 18.05, size: 2600 },
    ],
    asks: [
      { price: 18.45, size: 900 }, { price: 18.50, size: 1600 }, { price: 18.60, size: 2100 },
      { price: 18.70, size: 1400 }, { price: 18.85, size: 3000 },
    ],
  };

  const recentTrades = [
    { pair: "RAK-URB / SVO₂", side: "buy", price: 18.40, size: 250, time: "12:04:11" },
    { pair: "NAT-REM / SVO₂", side: "sell", price: 21.70, size: 120, time: "12:03:52" },
    { pair: "REN-AVD / SVO₂", side: "buy", price: 9.62, size: 640, time: "12:03:20" },
    { pair: "RAK-URB / SVO₂", side: "sell", price: 18.38, size: 310, time: "12:02:47" },
    { pair: "IND-EFF / SVO₂", side: "buy", price: 14.22, size: 180, time: "12:02:05" },
  ];

  function fmt(n, decimals = 0) {
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fmtUsd(n) { return "$" + fmt(n, n < 10 ? 2 : 2); }

  /* ---------------- Multi-currency quoting ----------------
     SVO2 and every tokenised carbon credit can be quoted and settled in
     USDT or in Digital Dirham (the UAE Central Bank's digital currency),
     alongside SVO2 itself. Digital Dirham uses the UAE's real, longstanding
     fixed peg of AED 3.6725 per USD; USDT is treated 1:1 with USD. */
  const quoteCurrencies = [
    { key: "SVO2", label: "SVO₂", symbol: "SVO₂", decimals: 3 },
    { key: "USDT", label: "USDT", symbol: "USDT", decimals: 2 },
    { key: "DAED", label: "Digital Dirham", symbol: "D-AED", decimals: 2 },
  ];
  const AED_PER_USD = 3.6725;

  function convertPrice(usdPrice, quoteKey) {
    if (quoteKey === "DAED") return usdPrice * AED_PER_USD;
    if (quoteKey === "SVO2") return usdPrice / state.svoPrice;
    return usdPrice; // USDT ≈ USD
  }
  function fmtQuote(usdPrice, quoteKey) {
    const q = quoteCurrencies.find(x => x.key === quoteKey) || quoteCurrencies[1];
    return `${fmt(convertPrice(usdPrice, quoteKey), q.decimals)} ${q.symbol}`;
  }

  /* ---------------- Logo mark ----------------
     Svantero brand mark: exact path data sourced from the brand's own
     "White logo - no background" SVG export (not a hand-drawn approximation).
     logoMarkSvg() is the mark alone (tight-cropped viewBox), used for the
     favicon; logoLockup() is the full mark + wordmark lockup as one SVG,
     preserving the original's exact relative scale/position between the two. */
  const LOGO_MARK_PATH = "M5,51h23.677L45,79.271L61.322,51H85v-6H64.786l19.63-34H5.584l19.63,34H5V51z M45,68.368L34.972,51h20.055L45,68.368z   M14.765,16h60.47L58.492,45H31.508L14.765,16z";
  const LOGO_WORD_PATH = "M27.6 30.92 q0 2.92 -1.76 5.2 q-1.72 2.16 -4.74 3.36 t-6.82 1.2 q-3.48 0 -6.76 -1.62 t-5.52 -4.5 l3.12 -2.92 q3.88 4.68 9.16 4.68 q2.32 0 4.24 -0.56 q2.12 -0.64 3.28 -1.8 q1.32 -1.28 1.32 -3.04 q0 -2.12 -1.32 -3.2 q-1.12 -0.92 -3.32 -1.2 q-1.28 -0.16 -4.2 -0.16 q-5.36 0 -8.18 -1.96 t-2.82 -5.76 q0 -2.4 1.42 -4.56 t3.9 -3.44 q2.56 -1.36 5.68 -1.36 q3.52 0 6.36 1.08 q3.04 1.16 5.64 3.64 l-2.72 3.2 q-2.44 -1.96 -4.44 -2.74 t-4.84 -0.78 q-1.64 0 -3.06 0.68 t-2.26 1.82 t-0.84 2.42 q0 3.44 6.36 3.44 q5.08 0 8.04 1.04 q2.8 1 4 3.04 q1.08 1.8 1.08 4.8 z M64.744 10.16 l-12.52 29.84 l-5.16 0 l-12.32 -29.84 l4.72 0 l10.2 24.96 l10.28 -24.96 l4.8 0 z M83.608 13.32 l-1.64 -3.68 l4.8 0 l14.36 30.36 l-4.88 0 l-1.96 -4.36 l-9.08 0 q-2.56 0 -4.6 0.48 q-1.8 0.44 -3 1.16 q-1.08 0.64 -1.44 1.32 l-0.76 1.4 l-4.72 0 z M86.808 31.24 l5.52 0 l-6.52 -12.6 l-6.6 14.28 q0.88 -0.76 2.68 -1.2 q2.04 -0.48 4.92 -0.48 z M111.552 14.36 l-3.48 -4.2 l5.64 0 l19.16 22.8 l0 -22.8 l4.4 0 l0 29.84 l-4.32 0 l-17.12 -20.52 l0 20.52 l-4.28 0 l0 -25.64 z M172.216 14.56 l-10.52 0 l0 25.44 l-4.24 0 l0 -25.44 l-10.64 0 l0 -4.4 l25.4 0 l0 4.4 z M186.12 28.04 l0 7.6 l18.4 0 l0 4.36 l-22.76 0 l0 -29.84 l21 0 l0 4.4 l-16.64 0 l0 9.04 q1.24 -0.72 2.76 -0.96 q1.12 -0.2 2.88 -0.2 l6.52 0 l0 4.44 l-6.52 0 q-1.64 0 -2.88 0.2 q-1.52 0.28 -2.76 0.96 z M219.824 14.52 l0 9.92 q1.24 -0.72 2.76 -0.96 q1.12 -0.2 2.88 -0.2 l5.68 0 q2.36 0 3.68 -1.08 q1.4 -1.16 1.4 -3.48 q0 -2.2 -1.48 -3.28 q-1.28 -0.92 -3.6 -0.92 l-11.32 0 z M232.584 35.28 l-3.64 -7.64 l-3.48 0 q-1.64 0 -2.88 0.2 q-1.52 0.28 -2.76 0.96 l0 11.2 l-4.36 0 l0 -29.84 l15.68 0 q2.76 0 4.88 1.04 t3.28 2.96 q1.24 2.04 1.24 4.8 q0 3.36 -1.8 5.52 t-5.08 3 l2.32 4.76 q1 1.48 1.56 2.08 q0.68 0.76 1.3 1.02 t1.62 0.26 l0.44 0 l0.96 -0.04 l0 4.44 q-2.32 0 -3.44 -0.16 q-1.88 -0.32 -3.2 -1.24 q-1.56 -1.12 -2.64 -3.32 z M278.808 24.88 q0 -3.2 -1.64 -5.8 q-1.56 -2.52 -4.26 -3.96 t-5.86 -1.44 q-3.28 0 -5.98 1.48 t-4.22 4.04 q-1.56 2.68 -1.56 5.96 q0 3.12 1.68 5.76 q1.6 2.48 4.3 3.94 t5.84 1.46 t5.84 -1.52 t4.26 -4.08 q1.6 -2.68 1.6 -5.84 z M283.128 25.12 q0 4.32 -2.24 7.96 q-2.16 3.48 -5.86 5.54 t-7.98 2.06 q-4.44 0 -8.16 -2.16 q-3.64 -2.08 -5.72 -5.72 q-2.16 -3.72 -2.16 -8.16 q0 -4.28 2.28 -7.88 q2.16 -3.44 5.86 -5.46 t7.94 -2.02 q4.36 0 8.08 2.12 q3.64 2.08 5.76 5.64 q2.2 3.72 2.2 8.08 z";

  function logoMarkSvg(fg = "#FFFFFF") {
    // Tight viewBox around the mark's own bounding box (x:5–85, y:11–79.271).
    return `<svg width="26" height="26" viewBox="0 6 90 80" xmlns="http://www.w3.org/2000/svg">
      <path fill="${fg}" d="${LOGO_MARK_PATH}"/>
    </svg>`;
  }
  function logoLockup(fg = "#FFFFFF") {
    return `<svg class="logo-lockup-svg" viewBox="0 0 3162.083535360532 596.5504237074117" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Svantero">
      <g transform="scale(8.104176768026598) translate(10, 10)">
        <g transform="matrix(0.7852564102564102,0,0,0.7852564102564102,-3.926282051282051,-8.637820512820513)" fill="${fg}">
          <path d="${LOGO_MARK_PATH}"/>
        </g>
        <g transform="matrix(1.0215257699572184,0,0,1.0215257699572184,80.95694797298412,1.5202430759796037)" fill="${fg}">
          <path d="${LOGO_WORD_PATH}"/>
        </g>
      </g>
    </svg>`;
  }

  /* ---------------- Header / nav injection ---------------- */
  function renderHeader(activePage) {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const links = [
      { href: "index.html", label: "Portfolio", key: "portfolio" },
      { href: "svx.html", label: "SVX", key: "svx" },
      { href: "tokenisation.html", label: "Tokenisation", key: "tokenisation" },
      { href: "lifecycle.html", label: "Lifecycle", key: "lifecycle" },
    ];
    mount.innerHTML = `
      <a href="index.html" class="brand">${logoLockup()}</a>
      <nav class="main-nav" id="main-nav">
        ${links.map(l => `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}">${l.label}</a>`).join("")}
      </nav>
      <div class="wallet-area">
        <span id="wallet-status"><span class="dot"></span><span id="wallet-address-label"></span></span>
        <button class="btn btn-outline" id="connect-wallet-btn" onclick="SVO2.toggleWallet()">Connect Wallet</button>
        <button class="nav-toggle" id="nav-toggle" onclick="SVO2.toggleMobileNav()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-scrim" id="nav-scrim" onclick="SVO2.toggleMobileNav()"></div>
    `;
    updateWalletUI();
  }

  function toggleMobileNav() {
    const nav = document.getElementById("main-nav");
    const toggle = document.getElementById("nav-toggle");
    const scrim = document.getElementById("nav-scrim");
    if (!nav) return;
    const open = nav.classList.toggle("open");
    if (toggle) toggle.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function toggleWallet() {
    if (!state.walletConnected) {
      state.walletConnected = true;
      state.walletAddress = "0x" + Math.random().toString(16).slice(2, 6) + "…" + Math.random().toString(16).slice(2, 6);
      showToast("Wallet connected (simulated) — " + state.walletAddress);
    } else {
      state.walletConnected = false;
      state.walletAddress = null;
      showToast("Wallet disconnected.");
    }
    updateWalletUI();
  }

  function updateWalletUI() {
    const btn = document.getElementById("connect-wallet-btn");
    const status = document.getElementById("wallet-status");
    const label = document.getElementById("wallet-address-label");
    if (!btn) return;
    if (state.walletConnected) {
      btn.textContent = "Disconnect";
      status.style.display = "inline-flex";
      label.textContent = state.walletAddress;
    } else {
      btn.textContent = "Connect Wallet";
      status.style.display = "none";
    }
  }

  /* ---------------- Modal helpers ---------------- */
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("open");
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function showToast(msg) {
    let t = document.getElementById("global-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "global-toast";
      t.className = "toast";
      t.innerHTML = '<span class="dot"></span><span id="toast-msg"></span>';
      document.body.appendChild(t);
    }
    document.getElementById("toast-msg").textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3600);
  }

  /* ---------------- Simple SVG donut chart ---------------- */
  function renderDonut(svgEl, data, opts = {}) {
    const size = opts.size || 160;
    const stroke = opts.stroke || 26;
    const r = (size - stroke) / 2;
    const cx = size / 2, cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = data.reduce((s, d) => s + d.value, 0);
    let offset = 0;
    let svgParts = [`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E1E3DE" stroke-width="${stroke}"/>`];
    data.forEach(d => {
      const frac = d.value / total;
      const dash = frac * circumference;
      svgParts.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${stroke}"
          stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}"
          transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`
      );
      offset += dash;
    });
    svgEl.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svgEl.innerHTML = svgParts.join("");
  }

  /* ---------------- Simple SVG line chart ---------------- */
  function renderLine(svgEl, values, opts = {}) {
    const w = opts.w || 400, h = opts.h || 120, pad = 10;
    const min = Math.min(...values), max = Math.max(...values);
    const range = (max - min) || 1;
    const stepX = (w - pad * 2) / (values.length - 1);
    const pts = values.map((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    });
    const line = `<polyline points="${pts.join(" ")}" fill="none" stroke="#282e35" stroke-width="2.5"/>`;
    const areaPts = `${pad},${h - pad} ${pts.join(" ")} ${pad + (values.length - 1) * stepX},${h - pad}`;
    const area = `<polygon points="${areaPts}" fill="#282e35" opacity="0.08"/>`;
    svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svgEl.innerHTML = area + line;
  }

  /* ---------------- Sparkline (tiny watchlist trend line) ---------------- */
  function renderSparkline(svgEl, values, opts = {}) {
    const w = opts.w || 64, h = opts.h || 22;
    const up = values[values.length - 1] >= values[0];
    const color = up ? "#0ECB81" : "#F6465D";
    const min = Math.min(...values), max = Math.max(...values);
    const range = (max - min) || 1;
    const stepX = w / (values.length - 1);
    const pts = values.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`);
    svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svgEl.innerHTML = `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  }

  /* ---------------- OHLC candle generator (deterministic mock) ---------------- */
  function generateOHLC(basePrice, count, seed, volatility = 0.025) {
    const rng = mulberry32(seed);
    let price = basePrice * (0.9 + rng() * 0.08);
    const candles = [];
    for (let i = 0; i < count; i++) {
      const open = price;
      const drift = (rng() - 0.5) * volatility * 2;
      const close = Math.max(0.01, open * (1 + drift));
      const wickUp = rng() * volatility * 0.9;
      const wickDown = rng() * volatility * 0.9;
      const high = Math.max(open, close) * (1 + wickUp);
      const low = Math.max(0.005, Math.min(open, close) * (1 - wickDown));
      const volume = 400 + rng() * 3600;
      candles.push({ open, high, low, close, volume });
      price = close;
    }
    // Anchor the final close to the instrument's displayed price so the
    // chart always agrees with the watchlist / deal ticket.
    const scale = basePrice / candles[candles.length - 1].close;
    return candles.map(c => ({
      open: c.open * scale, high: c.high * scale, low: c.low * scale, close: c.close * scale, volume: c.volume,
    }));
  }

  /* ---------------- TradingView-style candlestick + volume chart ----------------
     Renders into a wrapping <div> (not just an <svg>) so a floating OHLC
     tooltip can be layered on top and follow the cursor. */
  function renderCandleChart(container, candles, opts = {}) {
    const w = opts.w || 760, h = opts.h || 360;
    const volH = Math.round(h * (opts.volumeRatio || 0.22));
    const priceH = h - volH - 24;
    const padL = 6, padR = 58, padTop = 10;
    const plotW = w - padL - padR;
    const n = candles.length;
    const slot = plotW / n;
    const bodyW = Math.max(1, slot * 0.46);

    const maxP = Math.max(...candles.map(c => c.high));
    const minP = Math.min(...candles.map(c => c.low));
    const rangeP = (maxP - minP) || 1;
    const maxV = Math.max(...candles.map(c => c.volume)) || 1;
    const volTop = priceH + padTop + 16;

    const xFor = i => padL + i * slot + slot / 2;
    const yFor = p => padTop + (1 - (p - minP) / rangeP) * priceH;
    const volYFor = v => volTop + (1 - v / maxV) * (volH - 4);

    let svg = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" style="display:block;overflow:visible;">`;

    const gridLines = 5;
    for (let g = 0; g <= gridLines; g++) {
      const p = minP + (rangeP * g) / gridLines;
      const y = yFor(p);
      svg += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" stroke="#262b31" stroke-width="1"/>`;
      svg += `<text x="${w - padR + 6}" y="${(y + 3).toFixed(1)}" fill="#7a828c" font-size="10" font-family="Consolas,Menlo,monospace">${p.toFixed(2)}</text>`;
    }

    candles.forEach((c, i) => {
      const x = xFor(i);
      const up = c.close >= c.open;
      const color = up ? "#0ECB81" : "#F6465D";
      const yHigh = yFor(c.high), yLow = yFor(c.low);
      const yOpen = yFor(c.open), yClose = yFor(c.close);
      const bodyTop = Math.min(yOpen, yClose), bodyBot = Math.max(yOpen, yClose);
      svg += `<line x1="${x.toFixed(1)}" y1="${yHigh.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yLow.toFixed(1)}" stroke="${color}" stroke-width="1"/>`;
      svg += `<rect x="${(x - bodyW / 2).toFixed(1)}" y="${bodyTop.toFixed(1)}" width="${bodyW.toFixed(1)}" height="${Math.max(1, bodyBot - bodyTop).toFixed(1)}" fill="${color}"/>`;
      const vY = volYFor(c.volume);
      svg += `<rect x="${(x - bodyW / 2).toFixed(1)}" y="${vY.toFixed(1)}" width="${bodyW.toFixed(1)}" height="${Math.max(1, volTop + volH - 4 - vY).toFixed(1)}" fill="${color}" opacity="0.5"/>`;
    });

    const last = candles[candles.length - 1];
    const lastY = yFor(last.close);
    const lastColor = last.close >= last.open ? "#0ECB81" : "#F6465D";
    svg += `<line x1="${padL}" y1="${lastY.toFixed(1)}" x2="${w - padR}" y2="${lastY.toFixed(1)}" stroke="${lastColor}" stroke-width="1" stroke-dasharray="4,3"/>`;
    svg += `<rect x="${w - padR}" y="${(lastY - 9).toFixed(1)}" width="${padR}" height="18" fill="${lastColor}"/>`;
    svg += `<text x="${w - padR + 6}" y="${(lastY + 4).toFixed(1)}" fill="#14171b" font-size="10.5" font-weight="700" font-family="Consolas,Menlo,monospace">${last.close.toFixed(2)}</text>`;
    svg += `</svg>`;

    container.innerHTML = `<div class="tv-tooltip" id="tv-tip-${container.id}"></div>${svg}`;
    const svgEl = container.querySelector("svg");
    const tip = container.querySelector(`#tv-tip-${container.id}`);

    svgEl.addEventListener("mousemove", e => {
      const rect = svgEl.getBoundingClientRect();
      const scaleX = w / rect.width;
      const mx = (e.clientX - rect.left) * scaleX;
      let idx = Math.round((mx - padL - slot / 2) / slot);
      idx = Math.max(0, Math.min(n - 1, idx));
      const c = candles[idx];
      const up = c.close >= c.open;
      tip.style.display = "block";
      const leftPx = Math.min(rect.width - 175, Math.max(4, e.clientX - rect.left + 12));
      tip.style.left = leftPx + "px";
      tip.style.top = "6px";
      tip.innerHTML = `<div style="color:${up ? "#0ECB81" : "#F6465D"};font-weight:700;">O ${c.open.toFixed(2)} &nbsp; H ${c.high.toFixed(2)}</div>
        <div>L ${c.low.toFixed(2)} &nbsp; C ${c.close.toFixed(2)}</div>
        <div style="color:#7a828c;">Vol ${Math.round(c.volume).toLocaleString()}</div>`;
    });
    svgEl.addEventListener("mouseleave", () => { tip.style.display = "none"; });
  }

  /* ---------------- Options breakeven ("hockey stick") payoff diagram ----------------
     Renders the exact piecewise-linear P&L-at-expiry curve for a single
     option contract: long/short, call/put, scaled by quantity. Breakeven
     is computed analytically (K + premium for a call, K - premium for a
     put), not estimated numerically. */
  function renderOptionPayoff(container, opt, side, qty) {
    const w = 640, h = 240, padL = 54, padR = 20, padT = 16, padB = 30;
    const plotW = w - padL - padR, plotH = h - padT - padB;
    const K = opt.strike, prem = opt.premium;
    const range = Math.max(K * 0.35, prem * 6, 1);
    const minX = Math.max(0.01, K - range), maxX = K + range;
    const isCall = opt.type === "Call";
    const breakeven = isCall ? K + prem : K - prem;

    function rawPayoff(S) { return isCall ? Math.max(S - K, 0) - prem : Math.max(K - S, 0) - prem; }
    function payoff(S) { const p = rawPayoff(S) * qty; return side === "sell" ? -p : p; }

    let xs = [minX, K, maxX];
    if (breakeven > minX && breakeven < maxX && !xs.includes(breakeven)) { xs.push(breakeven); xs.sort((a, b) => a - b); }
    const pts = xs.map(S => [S, payoff(S)]);
    const maxAbs = Math.max(...pts.map(p => Math.abs(p[1])), qty * prem, 1);

    const x = S => padL + ((S - minX) / (maxX - minX)) * plotW;
    const y = v => padT + plotH / 2 - (v / maxAbs) * (plotH / 2 - 8);
    const zeroY = y(0);

    let svg = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="display:block;">`;
    svg += `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${w - padR}" y2="${zeroY.toFixed(1)}" stroke="#33393f" stroke-width="1"/>`;
    svg += `<text x="${padL - 6}" y="${(zeroY + 3).toFixed(1)}" fill="#7a828c" font-size="9" text-anchor="end">0</text>`;
    svg += `<line x1="${x(K).toFixed(1)}" y1="${padT}" x2="${x(K).toFixed(1)}" y2="${h - padB}" stroke="#7a828c" stroke-width="1" stroke-dasharray="3,3"/>`;
    svg += `<text x="${x(K).toFixed(1)}" y="${h - padB + 14}" fill="#7a828c" font-size="10" text-anchor="middle">K ${K.toFixed(2)}</text>`;
    svg += `<line x1="${x(breakeven).toFixed(1)}" y1="${padT}" x2="${x(breakeven).toFixed(1)}" y2="${h - padB}" stroke="#C9A227" stroke-width="1" stroke-dasharray="2,2"/>`;
    svg += `<text x="${x(breakeven).toFixed(1)}" y="${padT - 4}" fill="#C9A227" font-size="10" text-anchor="middle">BE ${breakeven.toFixed(2)}</text>`;

    for (let i = 0; i < pts.length - 1; i++) {
      const [S0, v0] = pts[i], [S1, v1] = pts[i + 1];
      const up = (v0 + v1) / 2 >= 0;
      const color = up ? "#0ECB81" : "#F6465D";
      const poly = `${x(S0).toFixed(1)},${zeroY.toFixed(1)} ${x(S0).toFixed(1)},${y(v0).toFixed(1)} ${x(S1).toFixed(1)},${y(v1).toFixed(1)} ${x(S1).toFixed(1)},${zeroY.toFixed(1)}`;
      svg += `<polygon points="${poly}" fill="${color}" opacity="0.18"/>`;
    }
    const linePts = pts.map(([S, v]) => `${x(S).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    svg += `<polyline points="${linePts}" fill="none" stroke="#C9A227" stroke-width="2.2"/>`;
    svg += `<circle cx="${x(breakeven).toFixed(1)}" cy="${zeroY.toFixed(1)}" r="4" fill="#14171b" stroke="#C9A227" stroke-width="2"/>`;
    svg += `</svg>`;

    container.innerHTML = svg;

    // Exact analytic max profit / max loss (not estimated from the sampled
    // chart range) — flags the two genuinely unlimited-risk/reward cases.
    let maxProfit, maxLoss;
    if (isCall) {
      if (side === "buy") { maxLoss = -prem * qty; maxProfit = Infinity; }
      else { maxProfit = prem * qty; maxLoss = -Infinity; }
    } else {
      if (side === "buy") { maxLoss = -prem * qty; maxProfit = (K - prem) * qty; }
      else { maxProfit = prem * qty; maxLoss = (prem - K) * qty; }
    }
    return { breakeven, maxProfit, maxLoss };
  }

  /* ---------------- Seeded RNG (deterministic mock market data) ---------------- */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- Market Risk: beta coefficient analysis ---------------- */
  // Generates a deterministic mock daily-return history for a "Carbon Market
  // Index" and for each credit type (built around each type's targetBeta),
  // then computes an empirical beta via covariance/variance — a genuine
  // calculation over the mock series, not a hardcoded number.
  function computeBetaAnalysis(days = 90) {
    const rngIndex = mulberry32(42);
    const indexReturns = [];
    for (let i = 0; i < days; i++) indexReturns.push((rngIndex() - 0.5) * 0.04);
    const meanI = indexReturns.reduce((a, b) => a + b, 0) / days;
    const varI = indexReturns.reduce((s, r) => s + (r - meanI) ** 2, 0) / days;

    const totalValue = creditTypes.reduce((s, c) => s + c.price * c.units, 0);

    const rows = creditTypes.map((c, idx) => {
      const rng = mulberry32(1000 + idx * 77);
      const idiosync = 0.02;
      const assetReturns = indexReturns.map(r => c.targetBeta * r + (rng() - 0.5) * idiosync);
      const meanA = assetReturns.reduce((a, b) => a + b, 0) / days;
      let cov = 0;
      for (let i = 0; i < days; i++) cov += (assetReturns[i] - meanA) * (indexReturns[i] - meanI);
      cov /= days;
      const beta = cov / varI;
      const weight = (c.price * c.units) / totalValue;
      return { type: c.type, ticker: c.ticker, beta, weight, contribution: beta * weight, color: c.color };
    });

    const portfolioBeta = rows.reduce((s, r) => s + r.contribution, 0);
    return { rows, portfolioBeta, totalValue };
  }

  /* ---------------- Lifecycle: per-credit stage breakdown ----------------
     Deterministic pipeline snapshot: for every credit type, its total unit
     supply is split across the 7 lifecycleStages. A fixed weight profile
     (most supply sits in Trading or has already reached Retirement; the
     four upstream stages hold smaller "in-flight" batches) is jittered per
     credit type via a seeded RNG, then converted to integer unit counts
     with the largest-remainder method so each credit type's stage counts
     sum EXACTLY to its total units — no rounding drift. */
  function computeStageBreakdown() {
    const stageWeightProfile = [0.05, 0.06, 0.05, 0.06, 0.42, 0.08, 0.28];
    return creditTypes.map((c, ci) => {
      const rng = mulberry32(9100 + ci * 41);
      const jittered = stageWeightProfile.map(w => Math.max(0.01, w * (0.75 + rng() * 0.5)));
      const totalW = jittered.reduce((a, b) => a + b, 0);
      const norm = jittered.map(w => w / totalW);
      const raw = norm.map(w => w * c.units);
      const floors = raw.map(Math.floor);
      let remainder = c.units - floors.reduce((a, b) => a + b, 0);
      const order = raw.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac);
      const stages = floors.slice();
      for (let k = 0; k < remainder; k++) stages[order[k % order.length].i] += 1;
      return {
        type: c.type, ticker: c.ticker, color: c.color, units: c.units,
        stages, trading: stages[4], retired: stages[6],
      };
    });
  }

  const performanceMetrics = {
    winRate: 0.62,
    realisedPnl: 184320,
    sharpe: 1.38,
    maxDrawdown: -0.114,
    avgHoldDays: 9.4,
    trades: 214,
  };

  return {
    state, creditTypes, marketNews, tokenomics, lifecycleStages, orderBook, recentTrades,
    trustClasses, verificationEvents, mintConditions, futuresContracts, optionsChain, stakingPools,
    performanceMetrics, royaltyProducts, tokenisationQueue,
    fmt, fmtUsd, renderHeader, toggleWallet, toggleMobileNav, openModal, closeModal, showToast, renderDonut, renderLine,
    logoMarkSvg, logoLockup, mulberry32, computeBetaAnalysis, computeStageBreakdown,
    renderSparkline, generateOHLC, renderCandleChart, renderOptionPayoff,
    quoteCurrencies, convertPrice, fmtQuote, AED_PER_USD,
  };
})();

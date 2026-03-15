// =========================================
// AppleAI — Crop Intelligence System
// Simulated AI logic for prototype purposes
// =========================================

// ---- Navigation ----
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const tab = link.dataset.tab;
    switchTab(tab);
  });
});

function switchTab(tab) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.nav-link[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');
}

// ---- File handling ----
const state = { disease: null, severity: null, counting: null };

function handleDrop(e, key) {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) loadPreview(file, key);
}

function handleFileChange(e, key) {
  const file = e.target.files?.[0];
  if (file) loadPreview(file, key);
}

function loadPreview(file, key) {
  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById(`${key}-preview`);
    const placeholder = document.getElementById(`${key}-placeholder`);
    const zone = document.getElementById(`${key}-upload`);
    img.src = ev.target.result;
    img.style.display = 'block';
    placeholder.style.display = 'none';
    zone.classList.add('has-image');
    state[key] = { src: ev.target.result, file };
    document.getElementById(`${key}-btn`).disabled = false;
    document.getElementById(`${key}-result`).style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// =========================================
// USE CASE A1: DISEASE DETECTION
// =========================================

const APPLE_DISEASES = [
  {
    id: 'scab',
    name: 'Apple Scab',
    badge: 'diseased',
    color: '#d94f3b',
    desc: 'Caused by Venturia inaequalis fungus. Appears as olive-green to brown velvety spots on leaves and fruit. Most severe in cool, moist spring conditions. Early treatment with fungicides is essential.',
  },
  {
    id: 'black_rot',
    name: 'Apple Black Rot',
    badge: 'diseased',
    color: '#c05030',
    desc: 'Caused by Botryosphaeria obtusa. Characterized by circular brown lesions with purple halos on leaves (frog-eye leaf spot). Can cause significant defoliation and fruit rot if untreated.',
  },
  {
    id: 'cedar_rust',
    name: 'Cedar Apple Rust',
    badge: 'diseased',
    color: '#e07030',
    desc: 'A fungal disease caused by Gymnosporangium juniperi-virginianae. Creates bright orange-yellow spots on upper leaf surfaces with tube-like structures beneath. Requires alternate hosts (cedars/junipers).',
  },
  {
    id: 'alternaria',
    name: 'Alternaria Leaf Blotch',
    badge: 'warning',
    color: '#c08030',
    desc: 'Caused by Alternaria mali. Produces small, circular, brown lesions with purple-red borders. More common on stressed or weakened trees. Often secondary to other infections.',
  },
  {
    id: 'healthy',
    name: 'Healthy Leaf',
    badge: 'healthy',
    color: '#5c9e3b',
    desc: 'No disease detected. The apple leaf shows normal coloration, texture, and structure consistent with a healthy plant. Continue regular monitoring and preventive care.',
  },
];

async function analyzeDisease() {
  if (!state.disease) return;
  const btn = document.getElementById('disease-btn');
  showLoader(btn);

  await simulateDelay(1600 + Math.random() * 800);

  const result = pickWeightedDisease();
  const confidence = (61 + Math.random() * 18).toFixed(1);

  // Show result
  const card = document.getElementById('disease-result');
  card.style.display = 'block';

  const badge = document.getElementById('disease-badge');
  badge.textContent = result.badge === 'healthy' ? '✓ Healthy' : '⚠ Disease Detected';
  badge.className = `result-badge ${result.badge}`;

  document.getElementById('disease-conf').textContent = `Confidence: ${confidence}%`;
  document.getElementById('disease-name').textContent = result.name;
  document.getElementById('disease-name').style.color = result.color;
  document.getElementById('disease-desc').textContent = result.desc;

  // All classes grid
  const grid = document.getElementById('disease-grid');
  grid.innerHTML = APPLE_DISEASES.map(d =>
    `<div class="class-chip ${d.id === result.id ? (d.id === 'healthy' ? 'healthy-match' : 'match') : ''}">${d.name}</div>`
  ).join('');

  hideLoader(btn, 'Analyze Leaf Disease');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function pickWeightedDisease() {
  // Weighted random: higher chance of interesting results
  const weights = [0.25, 0.20, 0.20, 0.10, 0.25];
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return APPLE_DISEASES[i];
  }
  return APPLE_DISEASES[APPLE_DISEASES.length - 1];
}

// =========================================
// USE CASE A2: SEVERITY ESTIMATION
// =========================================

async function analyzeSeverity() {
  if (!state.severity) return;
  const btn = document.getElementById('severity-btn');
  showLoader(btn);

  await simulateDelay(1800 + Math.random() * 1000);

  const totalPixels = 3200 + Math.floor(Math.random() * 1600);
  const severityPct = Math.floor(5 + Math.random() * 70);
  const diseasedPixels = Math.floor(totalPixels * severityPct / 100);
  const healthyPixels = totalPixels - diseasedPixels;

  const card = document.getElementById('severity-result');
  card.style.display = 'block';

  // Canvas segmentation visualization
  drawSegmentationCanvas(severityPct);

  // Meter
  const fill = document.getElementById('severity-fill');
  const pct = document.getElementById('severity-pct');
  fill.style.width = '0%';
  setTimeout(() => { fill.style.width = severityPct + '%'; }, 100);

  if (severityPct < 25) {
    fill.className = 'meter-fill low';
    pct.style.color = 'var(--green-light)';
  } else if (severityPct < 55) {
    fill.className = 'meter-fill medium';
    pct.style.color = 'var(--amber-light)';
  } else {
    fill.className = 'meter-fill high';
    pct.style.color = 'var(--red-light)';
  }
  pct.textContent = severityPct + '%';

  // Verdict
  const verdict = document.getElementById('severity-verdict');
  if (severityPct < 25) {
    verdict.textContent = '✓ Low severity — Preventive treatment may be sufficient. Monitor in 7 days.';
    verdict.className = 'severity-verdict verdict-low';
  } else if (severityPct < 55) {
    verdict.textContent = '⚠ Moderate severity — Apply targeted fungicide treatment within 48 hours.';
    verdict.className = 'severity-verdict verdict-medium';
  } else {
    verdict.textContent = '🚨 High severity — Immediate treatment required. Risk of spread to adjacent trees.';
    verdict.className = 'severity-verdict verdict-high';
  }

  // Stats
  document.getElementById('severity-stats').innerHTML = `
    <div class="sstat"><div class="sstat-val">${totalPixels.toLocaleString()}</div><div class="sstat-lbl">Total Pixels</div></div>
    <div class="sstat"><div class="sstat-val" style="color:var(--red-light)">${diseasedPixels.toLocaleString()}</div><div class="sstat-lbl">Diseased</div></div>
    <div class="sstat"><div class="sstat-val" style="color:var(--green-light)">${healthyPixels.toLocaleString()}</div><div class="sstat-lbl">Healthy</div></div>
  `;

  hideLoader(btn, 'Estimate Severity');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function drawSegmentationCanvas(severityPct) {
  const canvas = document.getElementById('severity-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0e110d';
  ctx.fillRect(0, 0, W, H);

  // Draw a stylized leaf outline
  ctx.save();
  ctx.translate(W / 2, H / 2);

  const leafW = 180, leafH = 100;

  // Leaf base shape (healthy green)
  ctx.beginPath();
  ctx.ellipse(0, 0, leafW, leafH, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#2d5e1e';
  ctx.fill();

  // Diseased patches (red-brown blotches)
  const numSpots = Math.floor(2 + (severityPct / 100) * 12);
  for (let i = 0; i < numSpots; i++) {
    const angle = (i / numSpots) * Math.PI * 2 + Math.random() * 0.5;
    const radius = (0.2 + Math.random() * 0.55) * leafW;
    const x = Math.cos(angle) * radius * 0.9;
    const y = Math.sin(angle) * radius * 0.5;
    const r = 8 + Math.random() * (severityPct / 5);
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.75, Math.random() * Math.PI, 0, Math.PI * 2);
    const alpha = 0.7 + Math.random() * 0.3;
    ctx.fillStyle = i % 3 === 0 ? `rgba(180,60,30,${alpha})` : `rgba(140,80,20,${alpha})`;
    ctx.fill();
  }

  // Leaf midrib
  ctx.beginPath();
  ctx.moveTo(-leafW + 20, 0);
  ctx.lineTo(leafW - 20, 0);
  ctx.strokeStyle = 'rgba(100,180,60,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Leaf veins
  for (let i = -3; i <= 3; i++) {
    const x0 = i * (leafW / 4);
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 - 20, i > 0 ? -40 : 40);
    ctx.strokeStyle = 'rgba(100,180,60,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Leaf border
  ctx.beginPath();
  ctx.ellipse(0, 0, leafW, leafH, -0.2, 0, Math.PI * 2);
  ctx.strokeStyle = '#5c9e3b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // Labels
  ctx.fillStyle = 'rgba(92,158,59,0.8)';
  ctx.font = '12px DM Mono, monospace';
  ctx.fillText(`Healthy: ${100 - severityPct}%`, 16, H - 16);

  ctx.fillStyle = 'rgba(217,79,59,0.9)';
  ctx.fillText(`Diseased: ${severityPct}%`, W - 110, H - 16);
}

// =========================================
// USE CASE A3: FRUIT COUNTING (YOLO)
// =========================================

async function analyzeCounting() {
  if (!state.counting) return;
  const btn = document.getElementById('counting-btn');
  showLoader(btn);

  await simulateDelay(2000 + Math.random() * 1200);

  const img = new Image();
  img.onload = () => {
    const canvas = document.getElementById('counting-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || 600;
    canvas.height = img.naturalHeight || 400;
    ctx.drawImage(img, 0, 0);

    const boxes = generateYOLOBoxes(canvas.width, canvas.height);
    boxes.forEach((b, i) => drawBoundingBox(ctx, b, i + 1));

    const card = document.getElementById('counting-result');
    card.style.display = 'block';

    document.getElementById('count-number').textContent = boxes.length;

    const visible = boxes.filter(b => b.visibility === 'full').length;
    const partial = boxes.filter(b => b.visibility === 'partial').length;
    document.getElementById('count-breakdown').innerHTML =
      `${visible} fully visible · ${partial} partially visible`;

    // Box detail chips
    document.getElementById('boxes-info').innerHTML = boxes.map((b, i) =>
      `<div class="box-chip"><strong>Apple ${i + 1}</strong>${(b.conf * 100).toFixed(0)}% conf<br />${b.visibility}</div>`
    ).join('');

    hideLoader(btn, 'Detect &amp; Count Apples');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  img.src = state.counting.src;
}

function generateYOLOBoxes(W, H) {
  const count = 4 + Math.floor(Math.random() * 9); // 4–12 apples
  const boxes = [];
  const attempts = count * 8;
  for (let i = 0; i < attempts && boxes.length < count; i++) {
    const bw = 40 + Math.random() * 60;
    const bh = bw * (0.85 + Math.random() * 0.3);
    const x = Math.random() * (W - bw * 0.5) - bw * 0.1;
    const y = Math.random() * (H - bh * 0.5) - bh * 0.1;
    const isPartial = x < 0 || y < 0 || (x + bw) > W || (y + bh) > H;
    boxes.push({
      x: Math.max(0, x), y: Math.max(0, y),
      w: Math.min(bw, W - Math.max(0, x)),
      h: Math.min(bh, H - Math.max(0, y)),
      conf: 0.51 + Math.random() * 0.28,
      visibility: isPartial ? 'partial' : 'full',
    });
  }
  return boxes;
}

function drawBoundingBox(ctx, box, num) {
  const { x, y, w, h, conf } = box;
  const color = conf > 0.9 ? '#5c9e3b' : conf > 0.8 ? '#e8a23a' : '#d94f3b';

  // Box
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  // Corner accents
  const cs = 10;
  ctx.lineWidth = 4;
  // TL
  ctx.beginPath(); ctx.moveTo(x, y + cs); ctx.lineTo(x, y); ctx.lineTo(x + cs, y); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(x + w - cs, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cs); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(x, y + h - cs); ctx.lineTo(x, y + h); ctx.lineTo(x + cs, y + h); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(x + w - cs, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cs); ctx.stroke();

  // Label background
  const label = `🍎 ${num} · ${(conf * 100).toFixed(0)}%`;
  ctx.font = 'bold 11px DM Mono, monospace';
  const tw = ctx.measureText(label).width;
  const lx = x;
  const ly = y > 20 ? y - 20 : y + h + 4;

  ctx.fillStyle = color;
  ctx.fillRect(lx, ly, tw + 10, 18);

  // Label text
  ctx.fillStyle = '#fff';
  ctx.fillText(label, lx + 5, ly + 13);
}

// =========================================
// UTILITIES
// =========================================

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showLoader(btn) {
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-spinner').style.display = 'inline';
  btn.disabled = true;
}

function hideLoader(btn, label) {
  btn.querySelector('.btn-text').innerHTML = label;
  btn.querySelector('.btn-text').style.display = 'inline';
  btn.querySelector('.btn-spinner').style.display = 'none';
  btn.disabled = false;
}

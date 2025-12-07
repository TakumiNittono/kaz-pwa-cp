const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVGアイコンを生成する関数（無料特典アプリ用）
function generateSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- 背景 -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
  
  <!-- ギフトボックス -->
  <g transform="translate(${size * 0.2}, ${size * 0.25})">
    <!-- ボックス本体 -->
    <rect x="${size * 0.15}" y="${size * 0.2}" width="${size * 0.5}" height="${size * 0.4}" fill="#ffffff" opacity="0.9" rx="${size * 0.02}"/>
    
    <!-- リボン（縦） -->
    <rect x="${size * 0.38}" y="${size * 0.2}" width="${size * 0.04}" height="${size * 0.4}" fill="#ef4444" rx="${size * 0.01}"/>
    
    <!-- リボン（横） -->
    <rect x="${size * 0.15}" y="${size * 0.38}" width="${size * 0.5}" height="${size * 0.04}" fill="#ef4444" rx="${size * 0.01}"/>
    
    <!-- リボンの結び目 -->
    <circle cx="${size * 0.4}" cy="${size * 0.38}" r="${size * 0.05}" fill="#dc2626"/>
    
    <!-- 星の装飾 -->
    <g transform="translate(${size * 0.25}, ${size * 0.25})">
      <path d="M ${size * 0.1} ${size * 0.05} L ${size * 0.12} ${size * 0.08} L ${size * 0.15} ${size * 0.08} L ${size * 0.12} ${size * 0.1} L ${size * 0.13} ${size * 0.13} L ${size * 0.1} ${size * 0.11} L ${size * 0.07} ${size * 0.13} L ${size * 0.08} ${size * 0.1} L ${size * 0.05} ${size * 0.08} Z" fill="#fbbf24" opacity="0.8"/>
    </g>
    
    <!-- 光る効果 -->
    <ellipse cx="${size * 0.3}" cy="${size * 0.25}" rx="${size * 0.08}" ry="${size * 0.04}" fill="#ffffff" opacity="0.3"/>
  </g>
  
  <!-- テキスト "FREE" -->
  <text x="${size * 0.5}" y="${size * 0.75}" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.9">FREE</text>
</svg>`;
}

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');

  // 192x192 アイコン
  const svg192 = generateSVG(192);
  const svg192Path = path.join(publicDir, 'icon-192.svg');
  fs.writeFileSync(svg192Path, svg192);
  
  // SVGをPNGに変換
  await sharp(svg192Path)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // 512x512 アイコン
  const svg512 = generateSVG(512);
  const svg512Path = path.join(publicDir, 'icon-512.svg');
  fs.writeFileSync(svg512Path, svg512);
  
  // SVGをPNGに変換
  await sharp(svg512Path)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('✅ アイコンを生成しました！');
  console.log('📁 生成されたファイル:');
  console.log('   - public/icon-192.png');
  console.log('   - public/icon-512.png');
  console.log('   - public/icon-192.svg');
  console.log('   - public/icon-512.svg');
}

generateIcons().catch(console.error);

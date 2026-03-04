import React, { useMemo } from 'react';

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function generateColors(hash: number) {
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 137.5) % 360; // Golden angle
  const hue3 = (hue1 + 222.5) % 360;
  return [
    `hsl(${hue1}, 70%, 60%)`,
    `hsl(${hue2}, 70%, 50%)`,
    `hsl(${hue3}, 70%, 40%)`,
  ];
}

export function RepoLogo({ name, className = "w-12 h-12" }: { name: string, className?: string }) {
  const svgContent = useMemo(() => {
    const hash = hashString(name);
    const colors = generateColors(hash);
    const seed = Math.abs(hash);
    
    // Generate a unique geometric pattern
    const shapes = [];
    const numShapes = 3 + (seed % 4); // 3 to 6 shapes
    
    for (let i = 0; i < numShapes; i++) {
      const type = (seed + i) % 3;
      const cx = 20 + ((seed + i * 17) % 60);
      const cy = 20 + ((seed + i * 23) % 60);
      const size = 10 + ((seed + i * 31) % 30);
      const color = colors[i % colors.length];
      const opacity = 0.5 + ((seed + i * 7) % 50) / 100;
      
      if (type === 0) {
        shapes.push(<circle key={i} cx={cx} cy={cy} r={size} fill={color} opacity={opacity} />);
      } else if (type === 1) {
        shapes.push(<rect key={i} x={cx - size/2} y={cy - size/2} width={size} height={size} fill={color} opacity={opacity} rx={size/4} transform={`rotate(${(seed + i * 11) % 90} ${cx} ${cy})`} />);
      } else {
        const pts = `${cx},${cy-size} ${cx+size},${cy+size/2} ${cx-size},${cy+size/2}`;
        shapes.push(<polygon key={i} points={pts} fill={color} opacity={opacity} transform={`rotate(${(seed + i * 13) % 120} ${cx} ${cy})`} />);
      }
    }
    
    // Add some connecting lines or a grid
    const lines = [];
    for (let i = 0; i < 5; i++) {
      const y = 10 + i * 20;
      lines.push(<line key={`l${i}`} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />);
      const x = 10 + i * 20;
      lines.push(<line key={`v${i}`} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />);
    }

    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.2" />
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0.2" />
          </linearGradient>
          <filter id={`blur-${name}`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect width="100" height="100" fill={`url(#grad-${name})`} rx="20" />
        {lines}
        <g filter={`url(#blur-${name})`}>
          {shapes}
        </g>
        <g>
          {shapes.map((s, i) => React.cloneElement(s, { key: `overlay-${i}`, opacity: 0.8, fill: 'none', stroke: colors[(i+1)%colors.length], strokeWidth: 2 }))}
        </g>
        {/* Abstract central element */}
        <circle cx="50" cy="50" r="15" fill="none" stroke={colors[2]} strokeWidth="4" strokeDasharray="10 5" transform={`rotate(${seed % 360} 50 50)`} />
        <circle cx="50" cy="50" r="8" fill={colors[0]} />
      </svg>
    );
  }, [name, className]);

  return svgContent;
}

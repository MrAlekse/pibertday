import './Cake.css';

export default function Cake({ candlesOut, age }) {
  return <div className={`cake-art ${candlesOut ? 'candles-out' : ''}`} role="img" aria-label={`A pixel-art strawberry birthday cake with five ${candlesOut ? 'extinguished' : 'lit'} candles${age ? ` and the number ${age}` : ''}`}>
    <svg viewBox="0 0 320 290" className="pixel-cake" aria-hidden="true" shapeRendering="crispEdges">
      <ellipse cx="160" cy="265" rx="131" ry="13" fill="#171726" opacity=".4"/>
      <path d="M20 238h16v-8h248v8h16v20h-16v8H36v-8H20z" fill="#827389"/>
      <path d="M20 234h16v-8h20v-8h208v8h20v8h16v16h-16v8H36v-8H20z" fill="#d6c5bc"/>
      <path d="M36 232h20v-8h208v8h20v12h-20v6H56v-6H36z" fill="#f5e5cc"/>
      <path d="M50 139h220v88h-12v12H62v-12H50z" fill="#ac614a"/>
      <path d="M58 150h204v76h-12v8H70v-8H58z" fill="#cb8460"/>
      <path d="M70 153h166v79H70z" fill="#dfaa78"/>
      <path d="M86 153h118v79H86z" fill="#efc08b"/>
      <path d="M50 173h12v7h196v-7h12v13h-12v7H62v-7H50z" fill="#9c514b"/>
      <path d="M50 169h12v7h196v-7h12v9h-12v8H62v-8H50z" fill="#f9e1aa"/>
      <path d="M50 207h12v7h196v-7h12v11h-12v8H62v-8H50z" fill="#a05548"/>
      <path d="M50 201h12v7h196v-7h12v9h-12v7H62v-7H50z" fill="#ffe5b4"/>
      <g fill="#b17a59"><path d="M76 194h5v4h-5zM105 191h4v4h-4zM134 198h5v3h-5zM220 194h5v4h-5zM246 187h4v4h-4zM92 224h4v3h-4zM191 225h5v3h-5z"/></g>
      <path d="M50 128h12v-12h24v-8h148v8h24v12h12v26h-10v12h-12v-15h-14v23h-12v-7h-7v-15h-18v9h-16v-8h-18v20h-13v-6h-7v-14h-18v10h-14v-13H91v16H77v-8H65v-10H50z" fill="#dba885"/>
      <path d="M50 123h12v-11h24v-8h148v8h24v11h12v26h-13v10h-9v-16h-14v23h-12v-20h-25v9h-16v-8h-18v18h-13v-19h-25v11h-14v-14H91v16H77v-16H65v-7H50z" fill="#f4d4a6"/>
      <path d="M62 119h20v-9h156v9h20v17h-20v8H82v-8H62z" fill="#ffe7ba"/>
      <path d="M83 115h152v6H83zM66 122h12v10H66z" fill="#fff5d5"/>
      <g fill="#cc7977"><path d="M99 124h8v3h-8zM142 137h4v6h-4zM184 120h8v3h-8zM215 135h8v3h-8z"/></g>
      <g fill="#91ad91"><path d="M118 136h7v3h-7zM172 132h4v6h-4zM236 123h6v3h-6z"/></g>
      <g fill="#e6b467"><path d="M95 137h4v5h-4zM155 123h7v3h-7zM199 140h6v3h-6z"/></g>
      {[75, 237].map((x, i) => <g key={x} transform={`translate(${x} ${i ? 123 : 130})`}><path d="M-9-6h5v-5H7v5h5V7H7v7H-4V9h-5z" fill="#983e52"/><path d="M-7-6H7V7H2v5h-5V6h-4z" fill="#df6e78"/><path d="M-5-6h5v5h-5z" fill="#ffaca0"/><path d="M-8-10h6v-5h5v5h7v4H-8z" fill="#648b78"/><path d="M-4 2h2v2h-2zM3 5h2v2H3z" fill="#ffde9b"/></g>)}
      {[100, 130, 160, 190, 220].map((x, i) => <g key={x} transform={`translate(${x} ${i % 2 ? 8 : 0})`}><path d="M-5 64H6v61H-5z" fill="#c77985"/><path d="M-5 64H2v59H-5z" fill="#ffe9c8"/><path d="M-5 77h4v-4h7v7H2v4h-7zM-5 99h4v-4h7v7H2v4h-7zM-5 119h4v-4h7v7H2v3h-7z" fill="#dd8d98"/><path d="M-1 58h3v7h-3z" fill="#60404b"/>{!candlesOut ? <g className="pixel-flame" style={{ '--delay': `${i * -.2}s` }}><path d="M-2 30h5v7h4v7h4v11H7v5H-6v-5h-4V44h4v-7h4z" fill="#e98951"/><path d="M-2 36h5v9h4v10H3v4H-3v-4h-4v-9h5z" fill="#ffca70"/><path d="M-1 45h4v12h-4z" fill="#fff3bc"/></g> : <g className="candle-smoke" style={{ '--delay': `${i * .1}s` }} fill="#ebdec8"><path d="M0 51h4v-9H0v-9h-4v-8h4v8h4v9H0z"/></g>}</g>)}
      {age && <g><path d="M143 178h34v6h6v21h-6v6h-34v-6h-6v-21h6z" fill="#996d55"/><path d="M143 176h34v6h6v21h-6v6h-34v-6h-6v-21h6z" fill="#ffe0a0"/><text x="160" y="198" textAnchor="middle" fill="#885648" fontFamily="monospace" fontSize="17" fontWeight="bold">{age}</text></g>}
    </svg>
  </div>;
}

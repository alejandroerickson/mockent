// Drawn inline icons, 1.5 stroke, currentColor. No icon font, no glyphs.
const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const Chevron = ({ dir = 'down', className = 'ico' }: { dir?: 'down' | 'up' | 'left' | 'right'; className?: string }) => {
  const rot = { down: 0, left: 90, up: 180, right: -90 }[dir];
  return <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false" style={{ transform: `rotate(${rot}deg)` }}><path d="M2.5 4.5 6 8l3.5-3.5" {...p} /></svg>;
};
export const Close = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" {...p} /></svg>;
export const Bell = () => <svg className="ico ico--14" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.5H3zM6.5 13.5a1.5 1.5 0 0 0 3 0" {...p} /></svg>;
export const Search = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><circle cx="5" cy="5" r="3.5" {...p} /><path d="M7.7 7.7 11 11" {...p} /></svg>;
export const Help = () => <svg className="ico ico--14" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.2" {...p} /><path d="M6.2 6.4a1.9 1.9 0 1 1 2.6 1.8c-.6.3-.8.6-.8 1.2M8 11.4h.01" {...p} /></svg>;
export const External = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M5 2H2.5v7.5H10V7M7 2h3v3M10 2 5.5 6.5" {...p} /></svg>;
export const Sun = () => <svg className="ico ico--14" viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...p} strokeWidth={1.4}><circle cx="8" cy="8" r="3.2" /><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1" /></svg>;
export const Moon = () => <svg className="ico ico--14" viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...p} strokeWidth={1.4}><path d="M13.2 9.8A5.6 5.6 0 0 1 6.2 2.8a5.6 5.6 0 1 0 7 7z" /></svg>;
export const Sort = ({ dir }: { dir?: 'ascending' | 'descending' | null }) => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 2v8" {...p} opacity={dir ? 1 : 0.4} /><path d={dir === 'ascending' ? 'M3.5 4.5 6 2l2.5 2.5' : dir === 'descending' ? 'M3.5 7.5 6 10l2.5-2.5' : 'M3.5 4.5 6 2l2.5 2.5M3.5 7.5 6 10l2.5-2.5'} {...p} opacity={dir ? 1 : 0.4} /></svg>;
export const Arrow = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 6h8M7 3l3 3-3 3" {...p} /></svg>;
export const Plus = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 2v8M2 6h8" {...p} /></svg>;
export const Check = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 6.5 5 9l4.5-6" {...p} /></svg>;
export const Star = ({ on }: { on: boolean }) => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 1.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1L6 8.6 3.2 10.1l.6-3.1L1.5 4.8l3.1-.4z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
export const Dots = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><circle cx="2.5" cy="6" r="1" fill="currentColor" /><circle cx="6" cy="6" r="1" fill="currentColor" /><circle cx="9.5" cy="6" r="1" fill="currentColor" /></svg>;
export const Download = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 1.5v6M3.5 5 6 7.5 8.5 5M2 10h8" {...p} /></svg>;
export const Filter = () => <svg className="ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M1.5 2.5h9L7 6.5v3.5L5 9V6.5z" {...p} /></svg>;

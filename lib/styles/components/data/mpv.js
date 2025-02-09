// Styles for /lib/components/data/mpv.jsx component
export const mpvStyles = /* css */ `
   .simple - bar--data .mpv-widget {
   position: relative;
   display: flex;
   align - items: center;
   margin: 0 var(--item - gap);
   padding: 2px var(--item - padding);
   background - color: rgba(0, 0, 0, 0.9);
   border - radius: var(--item - radius);
   user - select: none;
   cursor: pointer;
   transition: all 320ms ease;
   border: 1px solid #666;
   z - index: 1;
   height: 18px;
}

  .simple - bar--data.mpv - widget__content {
   display: inline - flex;
   align - items: center;
   height: 100 %;
   z - index: 2;
   gap: 4px;
   margin - top: -1px;
}

  .simple - bar--data.mpv - widget: hover.mpv - widget__text {
   overflow: visible;
   text - overflow: unset;
   animation: scroll - text 8s linear infinite;
}

@keyframes scroll - text {
   0 % { transform: translateX(0); }
   45 % { transform: translateX(calc(-100 % + 200px)); }
   55 % { transform: translateX(calc(-100 % + 200px)); }
   100 % { transform: translateX(0); }
}
`;

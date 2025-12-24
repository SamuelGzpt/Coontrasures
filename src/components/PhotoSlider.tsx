import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PhotoSlider: React.FC = () => {
    const topRowRef = useRef<HTMLDivElement>(null);
    const bottomRowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const top = topRowRef.current;
        const bottom = bottomRowRef.current;

        if (top && bottom) {
            // Prevent duplicate cloning if already running (React Strict Mode)
            if (top.getAttribute('data-cloned') === 'true') return;
            top.setAttribute('data-cloned', 'true');
            bottom.setAttribute('data-cloned', 'true');

            // Measure initial width (Set A)
            // Note: In flex gap scenarios, scrollWidth might not account for the final gap if not explicit,
            // but the difference method is safer.
            const initialWidthTop = top.scrollWidth;

            // Duplicate items
            const topChildren = Array.from(top.children) as HTMLElement[];
            const bottomChildren = Array.from(bottom.children) as HTMLElement[];

            topChildren.forEach(child => top.appendChild(child.cloneNode(true)));
            bottomChildren.forEach(child => bottom.appendChild(child.cloneNode(true)));

            // Measure new width to get exact length of one set + one gap
            // The scrollWidth now includes: Set A + Gaps + Set A + Gaps (roughly)
            // The "period" is the width added.
            const finalWidthTop = top.scrollWidth;
            const singleSetWidth = finalWidthTop - initialWidthTop;

            // Top Row: Move LEFT (0 -> -width)
            gsap.to(top, {
                x: -singleSetWidth,
                duration: 90, // Even slower speed
                ease: "linear",
                repeat: -1
            });

            // Bottom Row: Move RIGHT (-width -> 0)
            // Start at -width (visualizing the clone set)
            // Animate to 0 (visualizing the original set)
            // seamless jump back to -width
            gsap.fromTo(bottom, {
                x: -singleSetWidth
            }, {
                x: 0,
                duration: 90, // Even slower speed
                ease: "linear",
                repeat: -1
            });
        }
    }, []);

    // 8 items to ensure full width coverage
    const placeholderItems = Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="photo-item" />
    ));

    return (
        <section className="photo-slider">
            <div className="row top-row" ref={topRowRef}>
                {placeholderItems}
            </div>
            <div className="row bottom-row" ref={bottomRowRef}>
                {placeholderItems}
            </div>
        </section>
    );
};

export default PhotoSlider;

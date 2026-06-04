'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function ZoomParallax({ images = [] }) {
    const container = useRef(null);
    // Ortadaki SVG sabit; diğer kutular bu görsellerle doldurulur
    const imgClass = "h-full w-full object-cover";
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

    return (
        <div ref={container} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* index 0 - merkez, hero-paint.svg */}
                <motion.div
                    style={{ scale: scale4 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative h-[25vh] w-[25vw]">
                        <img
                            src="/hero-paint.svg"
                            alt="Hero"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </motion.div>

                {/* index 1 - üst sağ */}
                <motion.div
                    style={{ scale: scale5 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative -top-[30vh] left-[5vw] h-[30vh] w-[35vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[0]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

                {/* index 2 - üst sol */}
                <motion.div
                    style={{ scale: scale6 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative -top-[10vh] -left-[25vw] h-[45vh] w-[20vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[1]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

                {/* index 3 - orta sağ */}
                <motion.div
                    style={{ scale: scale5 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative left-[27.5vw] h-[25vh] w-[25vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[2]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

                {/* index 4 - alt sağ */}
                <motion.div
                    style={{ scale: scale6 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative top-[27.5vh] left-[5vw] h-[25vh] w-[20vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[3]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

                {/* index 5 - alt sol */}
                <motion.div
                    style={{ scale: scale8 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[4]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

                {/* index 6 - küçük sağ alt */}
                <motion.div
                    style={{ scale: scale9 }}
                    className="absolute top-0 flex h-full w-full items-center justify-center"
                >
                    <div className="relative top-[22.5vh] left-[25vw] h-[15vh] w-[15vw] overflow-hidden rounded-lg bg-neutral-200">
                        <img src={images[5]} alt="" draggable={false} loading="lazy" decoding="async" className={imgClass} />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
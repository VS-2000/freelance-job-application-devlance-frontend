import { useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Counter = ({ value, duration = 1.5, formatter = (v) => v.toLocaleString() }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMiliseconds = duration * 1000;
        let incrementTime = (totalMiliseconds / end);

        let timer = setInterval(() => {
            start += Math.ceil(end / (duration * 60)); // roughly 60fps
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [value, duration, isInView]);

    return <span ref={ref}>{formatter(count)}</span>;
};

export default Counter;

import Centerlogo from "../../assets/splash/logo.png";

import { useState, useEffect } from "react";

type RingFramesProps = {
  size?: number; // diameter of the outermost ring
  ringCount?: number; // number of rings
  gap?: number; // gap between rings
  orbitImages?: string[][]; // array of images per ring
  orbitDuration?: number[]; // rotation duration in seconds per ring
};

const RingFramesWithOrbit = ({
  size = 567,
  ringCount = 4,
  gap = 75,
  orbitImages = [],
  orbitDuration = [],
}: RingFramesProps) => {
  const [dynamicSize, setDynamicSize] = useState(size);

  useEffect(() => {
    const handleResize = () => {
      const newSize =
        window.innerWidth < 390 && window.innerHeight < 850
          ? 407
          : window.innerWidth <= 540 && window.innerHeight <= 720
            ? 467
            : size;

      setDynamicSize((prev) => (prev !== newSize ? newSize : prev));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  const rings = Array.from({ length: ringCount }, (_, i) => i);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dynamicSize, height: dynamicSize }}
    >
      {rings.map((index) => {
        const dynamicGap =
          dynamicSize === 407 ? 50 : dynamicSize === 467 ? 60 : gap;
        const ringSize = dynamicSize - index * dynamicGap * 2; // reduce each inner ring
        const duration = orbitDuration[index] || 10;
        const opacity = 0.15 + (index / ringCount) * 0.5; // increase opacity for inner rings

        return (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${ringSize}px`,
              height: `${ringSize}px`,
              borderRadius: "50%",
              border: "1px solid transparent",
              background: `linear-gradient(black, black) padding-box,
                             linear-gradient(180deg, rgba(222,219,0,${opacity}), rgba(92,225,230,${opacity})) border-box`,
            }}
          >
            {orbitImages[index] && orbitImages[index].length > 0 && (
              <div
                className="absolute rounded-full"
                style={{
                  width: "100%",
                  height: "100%",
                  animation: `spin ${duration}s linear infinite`,
                  animationDirection: index === 1 ? "reverse" : "normal",
                }}
              >
                {orbitImages[index].map((img, i) => {
                  const angle = (360 / orbitImages[index].length) * i;
                  return (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={`absolute ${dynamicSize === 407 ? "w-10 h-10" : dynamicSize === 467 ? "w-12 h-12" : "w-15 h-15"} rounded-full`}
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) 
                                                rotate(${angle}deg) 
                                                translateY(-${ringSize / 2}px)
                                                rotate(-${angle}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <img
        src={Centerlogo}
        className="absolute w-22 h-15 object-contain object-center rounded-full"
        alt=""
        style={{ zIndex: ringCount + 1 }}
      />

    </div>
  );
};

export default RingFramesWithOrbit;

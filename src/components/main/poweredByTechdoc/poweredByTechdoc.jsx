import React, { useRef, useEffect } from 'react';
import './poweredByTechdoc.scss';

const colors = ['#FF4143', '#50C5DC', '#FCB415', '#7F00FF']; // Red, Blue, Gold , Purple

function randomPhysics(angle, spread, velocity) {
  const radAngle = (angle * Math.PI) / 180;
  const radSpread = (spread * Math.PI) / 180;

  return {
    x: 0,
    y: 0,
    z: 0,
    wobble: Math.random() * 10,
    velocity: velocity * 0.65 + Math.max(Math.random(), 0.35) * velocity,
    angle2D: -radAngle + (radSpread * 0.5 - Math.random() * radSpread),
    angle3D: 0,
    tiltAngle: Math.random() * Math.PI,
  };
}

function createFettiElements(container, count) {
  return Array.from({ length: count }).map((_, index) => {
    const element = document.createElement('div');
    element.classList.add('fetti');
    const color = colors[index % colors.length];
    element.style.backgroundColor = color;
    container.appendChild(element);
    return element;
  });
}

function updateFetti(fetti, progress, decay) {
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += 0.05;
  fetti.physics.velocity *= decay;
  fetti.physics.y += 3;
  fetti.physics.tiltAngle += 30.1;

  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + Math.cos(wobble) * 10;
  const wobbleY = y + Math.sin(wobble) * 10;
  const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotateZ(${tiltAngle}deg)`;

  fetti.element.style.transform = transform;
  fetti.element.style.opacity = Math.max(1 - progress * 4.2, 0);
}

function animateFetti(container, fettis, decay) {
  return new Promise((resolve) => {
    let tick = 0;
    const totalTicks = 200;

    function frame() {
      fettis.forEach((fetti) => updateFetti(fetti, tick / totalTicks, decay));
      tick += 1;
      if (tick < totalTicks) {
        requestAnimationFrame(frame);
      } else {
        fettis.forEach((fetti) => {
          if (fetti.element && container.contains(fetti.element)) {
            container.removeChild(fetti.element);
          }
        });
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

const Footer = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const poweredByRef = useRef(null);

  const triggerConfetti = (element) => {
    const container = containerRef.current;
    if (!container || !element) return;

    const rect = element.getBoundingClientRect();
    const logoX = rect.left + rect.width / 2;
    const logoY = rect.top + rect.height / 2;

    document.documentElement.style.setProperty(
      '--confetti-x-position',
      `${logoX}px`
    );
    document.documentElement.style.setProperty(
      '--confetti-y-position',
      `${logoY}px`
    );

    const angle = window.innerWidth >= 768 ? 70 : 90;
    const decay = 0.89;
    const spread = 80;
    const velocity = 15;
    const count = 20;

    const elements = createFettiElements(container, count);
    const fettis = elements.map((element) => ({
      element,
      physics: randomPhysics(angle, spread, velocity),
    }));

    animateFetti(container, fettis, decay);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerConfetti(logoRef.current);
          }
        });
      },
      { threshold: 1.0 }
    );

    if (poweredByRef.current) {
      observer.observe(poweredByRef.current);
    }

    return () => {
      if (poweredByRef.current) {
        observer.unobserve(poweredByRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    triggerConfetti(logoRef.current);
  };

  return (
    <div className='footerWrapper mt-4' ref={poweredByRef}>
      <div
        // id='confetti-wrap'
        // ref={containerRef}
        className='d-flex align-items-center p-2 gap-2 cursor-pointer justify-content-center'
        // onClick={handleClick}
      >
        <div className='d-flex align-items-center gap-2 justify-content-center'>
          <p className='m-0 font-weight-bold'>Powered by</p>
          <p className='m-0 d-flex align-items-center'>
            <img
              ref={logoRef}
              src='https://techdoc.walkover.in/favicon.svg'
              alt='TechDoc Logo'
              width='24px'
              height='auto'
            />
            <span className='font-20 font-weight-bold powered-techdoc'>
              TechDoc
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

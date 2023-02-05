import { useCallback, useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';

interface AnalogStickProps {
  className?: string;
}
export function AnalogStick({ className }: AnalogStickProps) {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const joystickSize = Math.floor(Math.min(...size) / 2);

  return (
    <div className={`${className}`}>
      <Joystick
        size={joystickSize}
        stickSize={joystickSize * 0.6}
        baseColor="#212121"
        stickColor="rgba(255, 255, 255, 0.2)"
        throttle={50}
        move={(event) => console.log(event)}
      />
    </div>
  );
}

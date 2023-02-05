import React, { useEffect } from 'react';
import { useScene } from 'react-babylonjs';

type ControllerProps = {
  register: () => void;
};
function Controller({ register }: ControllerProps) {
  const scene = useScene();
  useEffect(() => {
    scene?.registerAfterRender(register);
    return () => {
      scene?.unregisterAfterRender(register);
    };
  });

  return null;
}

export default Controller;

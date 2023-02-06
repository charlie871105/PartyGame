import { Color3 } from '@babylonjs/core';
import React from 'react';

function SceneBackground({ children }: { children: React.ReactNode }) {
  return (
    <ground name="sea" width={1000} height={1000}>
      <backgroundMaterial
        name="seaMaterial"
        primaryColor={new Color3(0.57, 0.7, 0.83)}
        useRGBColor={false}
      >
        {children}
      </backgroundMaterial>
    </ground>
  );
}

export default SceneBackground;

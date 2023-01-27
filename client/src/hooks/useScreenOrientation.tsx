import { useState, useEffect } from 'react';

const getIsPortrait = () =>
  window.matchMedia('(orientation: portrait)').matches;

const useScreenPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(getIsPortrait());

  const updateIsPortrait = () => {
    setIsPortrait(getIsPortrait());
  };

  useEffect(() => {
    window.addEventListener('resize', updateIsPortrait);
    return () => {
      window.removeEventListener('resize', updateIsPortrait);
    };
  }, []);

  return isPortrait;
};

export default useScreenPortrait;

import React, { useEffect } from 'react';
import { useGlobalState } from 'state';
import { pageUp } from 'functions';
import brand_1 from 'assets/brand_1.jpg';
import brand_2 from 'assets/brand_2.jpg';
import s from './PortfolioView.module.css';

export default function PortfolioView() {
  const { mainHeight } = useGlobalState('global');

  useEffect(pageUp, []);

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <img src={brand_1} alt={'Brands'} className={s.image} />
      <img src={brand_2} alt={'Brands'} className={s.image} />
    </main>
  );
}

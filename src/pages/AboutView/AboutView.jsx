import React from 'react';
import { useGlobalState } from 'state';
import s from './AboutView.module.css';

export default function AboutView({ text }) {
  const { mainHeight } = useGlobalState('global');

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {`Тут буде сторінка "${text}"!`}
    </main>
  );
}

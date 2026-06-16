import { useState } from 'react';
import HexGrid from './HexGrid';
import './App.css'

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#F0F8FF', fontFamily: 'Lato' }}>
      
      <HexGrid />

      <main style={{ position: 'relative', zIndex: 1, padding: '5rem', maxWidth: '800px', margin: '0 auto' }}>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

interface ClientTimeProps {
  className?: string;
}

export function ClientTime({ className }: ClientTimeProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{time}</span>;
}

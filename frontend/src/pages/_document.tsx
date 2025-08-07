import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="description" content="Sistema de gerenciamento de ordens de serviço" />
        
        {/* Preconnect para fontes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

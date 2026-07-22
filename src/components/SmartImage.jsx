import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Encaixe da imagem. Precisa ser uma prop, e nao uma classe passada por fora:
 * `object-cover` e `object-contain` tem a mesma especificidade, entao quem
 * vencia era a ordem da folha de estilo do Tailwind, nao a ordem do atributo.
 */
const FIT = {
  cover: 'object-cover',
  contain: 'object-contain',
};

/**
 * Imagem com carregamento preguicoso, fade-in e fallback visual.
 * Se o arquivo nao existir, mostra um painel discreto no lugar do quadrado quebrado.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fit = 'cover',
  loading = 'lazy',
  fetchPriority,
  sizes,
  onLoad,
}) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('loading');

  if (status === 'error') {
    return (
      <div
        className={`flex items-center justify-center bg-surface-light/60 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 p-4 text-center text-text-muted">
          <ImageOff className="h-6 w-6 text-gold/70" aria-hidden="true" />
          <span className="text-[0.7rem] uppercase tracking-widest">{t('common.imageFallback')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-light/70 to-surface" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        sizes={sizes}
        draggable="false"
        onLoad={(e) => {
          setStatus('loaded');
          onLoad?.(e);
        }}
        onError={() => setStatus('error')}
        className={`h-full w-full ${FIT[fit] ?? FIT.cover} transition-opacity duration-700 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
}

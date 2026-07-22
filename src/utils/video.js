/**
 * Resolve o endereço de vídeo de um integrante para algo que dê para exibir.
 *
 * Aceita o que o usuário costuma ter na mão: link de post do X, link normal do
 * YouTube (watch, youtu.be, shorts), link do Vimeo ou um arquivo enviado.
 */

const X_POST = /(?:twitter\.com|x\.com)\/[^/]+\/status(?:es)?\/(\d+)/i;
const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)/i;

/** Id do post do X, ou null se não for um link de post. */
export function parseXPostId(url) {
  const match = X_POST.exec(String(url || ''));
  return match ? match[1] : null;
}

/** Id de um vídeo do YouTube (watch, youtu.be, shorts…), ou null. */
export function parseYouTubeId(url) {
  const match = YOUTUBE_ID.exec(String(url || ''));
  return match ? match[1] : null;
}

/**
 * Descobre o tipo pelo próprio endereço. Serve para o editor ajustar o campo
 * "tipo" sozinho quando alguém cola um link.
 */
export function detectVideoType(url) {
  const value = String(url || '').trim();
  if (!value) return null;
  if (parseXPostId(value)) return 'x';
  if (YOUTUBE_ID.test(value) || value.includes('youtube-nocookie.com')) return 'youtube';
  if (VIMEO_ID.test(value) || value.includes('player.vimeo.com')) return 'vimeo';
  if (/\.(mp4|webm|mov)(\?|$)/i.test(value) || value.startsWith('/uploads/')) return 'mp4';
  return null;
}

/**
 * Devolve { kind, src } pronto para o player.
 * `kind` é 'x' | 'iframe' | 'file' | 'none'.
 */
export function resolveVideoSource(member) {
  const url = String(member?.videoUrl || '').trim();
  if (!url) return { kind: 'none', src: '' };

  const type = member?.videoType && member.videoType !== 'auto' ? member.videoType : detectVideoType(url);

  if (type === 'x') {
    const id = parseXPostId(url) || (/^\d+$/.test(url) ? url : null);
    if (!id) return { kind: 'none', src: '' };
    const params = new URLSearchParams({
      id,
      theme: 'dark',
      dnt: 'true',
      hideThread: 'true',
      lang: 'pt',
    });
    return { kind: 'x', src: `https://platform.twitter.com/embed/Tweet.html?${params}`, id };
  }

  if (type === 'mp4') return { kind: 'file', src: url };

  if (type === 'vimeo') {
    const id = VIMEO_ID.exec(url)?.[1];
    const base = id ? `https://player.vimeo.com/video/${id}` : url;
    return { kind: 'iframe', src: `${base}${base.includes('?') ? '&' : '?'}autoplay=1&title=0&byline=0` };
  }

  // YouTube e qualquer outro embed em iframe
  const id = YOUTUBE_ID.exec(url)?.[1];
  const base = id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
  return { kind: 'iframe', src: `${base}${base.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1` };
}

export default resolveVideoSource;

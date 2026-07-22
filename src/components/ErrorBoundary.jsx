import { Component } from 'react';

/** Evita a tela em branco: qualquer erro de render vira um painel legivel. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unexpected error' };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('[ARABIA GANG]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="font-display text-2xl text-gilded">ARABIA GANG</p>
        <p className="max-w-md text-sm text-text-muted">
          Algo saiu do lugar ao montar esta seção. Recarregue a página para continuar.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-gold">
          Recarregar
        </button>
      </div>
    );
  }
}

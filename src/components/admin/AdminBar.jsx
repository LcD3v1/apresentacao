import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  KeyRound,
  Loader2,
  LogOut,
  PencilRuler,
  RotateCcw,
  UserPlus,
  X,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import useModalBehavior from '../../hooks/useModalBehavior';

/* ------------------------------------------------------------- login */

function LoginDialog({ onClose }) {
  const { login } = useContent();
  const panelRef = useModalBehavior(true, onClose);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(password);
      onClose();
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.');
      setBusy(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
      />

      <motion.form
        ref={panelRef}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm border border-gold/40 bg-surface p-7 shadow-gold"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">Painel</p>
            <h2 id="admin-login-title" className="mt-1 font-display text-xl text-text">
              Modo de edição
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-text-muted transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <label className="mt-6 block">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-text-muted">Senha</span>
          <input
            type="password"
            value={password}
            data-autofocus
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-text outline-none focus:border-gold"
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-red-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || !password} className="btn btn-gold mt-6 w-full disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
          Entrar
        </button>

        <p className="mt-4 text-[0.68rem] leading-relaxed text-text-muted">
          Senha inicial <code className="text-gold">thamaniya2026</code>. Troque definindo
          <code className="mx-1 text-gold">ADMIN_PASSWORD</code> no ambiente do servidor.
        </p>
      </motion.form>
    </motion.div>
  );
}

/* ---------------------------------------------------------- confirmação */

function ConfirmReset({ onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="absolute bottom-full end-0 mb-3 w-72 border border-gold/50 bg-black/95 p-4 shadow-deep">
      <p className="text-sm leading-relaxed text-text">
        Restaurar o conteúdo original? Todas as edições feitas pelo painel serão perdidas.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-[0.68rem] uppercase tracking-widest text-text-muted hover:text-text"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
              onCancel();
            }
          }}
          className="btn btn-gold px-3 py-1.5 text-[0.62rem] disabled:opacity-50"
        >
          Restaurar
        </button>
      </div>
    </div>
  );
}

/** Como cada estado da conexão em tempo real aparece na barra. */
const CONEXAO = {
  live: {
    rotulo: 'Ao vivo',
    dica: 'Toda edição aparece nas outras abas na hora, sem recarregar.',
    texto: 'text-text-muted',
    ponto: 'bg-primary-light',
  },
  conectando: {
    rotulo: 'Conectando',
    dica: 'Abrindo o canal de tempo real…',
    texto: 'text-text-muted',
    ponto: 'bg-gold/70',
  },
  reconectando: {
    rotulo: 'Reconectando',
    dica: 'O canal caiu e está voltando; enquanto isso a checagem é periódica.',
    texto: 'text-gold-light',
    ponto: 'bg-gold',
  },
  polling: {
    rotulo: 'A cada 20s',
    dica: 'Esta hospedagem não sustentou o canal ao vivo; as abas checam a cada 20 segundos.',
    texto: 'text-text-muted',
    ponto: 'bg-gold/70',
  },
  offline: {
    rotulo: 'API offline',
    dica: 'Sem conexão com o servidor — as edições não estão sendo salvas.',
    texto: 'text-red-300',
    ponto: 'bg-red-400',
  },
};

/* ------------------------------------------------------------- barra */

export default function AdminBar() {
  const { isAdmin, editing, setEditing, logout, addMember, resetContent, status, live, toast } =
    useContent();
  const [loginOpen, setLoginOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      {/* Aviso de salvamento */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role="status"
            aria-live="polite"
            className={`fixed bottom-24 start-1/2 z-[96] flex -translate-x-1/2 items-center gap-2 border px-4 py-2.5 text-xs backdrop-blur rtl:translate-x-1/2 ${
              toast.tone === 'error'
                ? 'border-red-400/50 bg-red-950/80 text-red-100'
                : 'border-gold/50 bg-black/85 text-gold-light'
            }`}
          >
            {toast.tone === 'error' ? (
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdmin && (
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          aria-label="Abrir painel de edição"
          className="fixed bottom-6 start-5 z-[70] flex h-11 w-11 items-center justify-center border border-white/15 bg-black/60 text-text-muted backdrop-blur transition-colors hover:border-gold hover:text-gold sm:bottom-8 sm:start-8"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {isAdmin && (
        <div className="fixed inset-x-0 bottom-0 z-[75] border-t border-gold/30 bg-black/90 backdrop-blur-xl">
          <div className="container-x flex flex-wrap items-center gap-3 py-3">
            <span className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-gold">
              <PencilRuler className="h-4 w-4" aria-hidden="true" />
              Painel
            </span>

            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-pressed={editing}
              className={`flex items-center gap-2 border min-h-11 cursor-pointer px-3 py-2 text-[0.66rem] uppercase tracking-[0.16em] transition-colors ${
                editing
                  ? 'border-gold bg-gold/15 text-gold-light'
                  : 'border-white/15 text-text-muted hover:border-gold/60 hover:text-gold-light'
              }`}
            >
              {editing ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <PencilRuler className="h-3.5 w-3.5" aria-hidden="true" />}
              {editing ? 'Ver como visitante' : 'Editar conteúdo'}
            </button>

            <button
              type="button"
              onClick={addMember}
              className="flex items-center gap-2 border border-white/15 min-h-11 cursor-pointer px-3 py-2 text-[0.66rem] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-gold/60 hover:text-gold-light"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Novo integrante
            </button>

            <div className="relative ms-auto flex items-center gap-3">
              {confirmOpen && (
                <ConfirmReset onCancel={() => setConfirmOpen(false)} onConfirm={resetContent} />
              )}

              <span
                title={CONEXAO[status === 'online' ? live : 'offline'].dica}
                className={`hidden items-center gap-2 text-[0.6rem] uppercase tracking-[0.18em] sm:flex ${
                  CONEXAO[status === 'online' ? live : 'offline'].texto
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${CONEXAO[status === 'online' ? live : 'offline'].ponto}`}
                  aria-hidden="true"
                />
                {CONEXAO[status === 'online' ? live : 'offline'].rotulo}
              </span>

              <button
                type="button"
                onClick={() => setConfirmOpen((v) => !v)}
                className="flex items-center gap-2 border border-white/15 min-h-11 cursor-pointer px-3 py-2 text-[0.66rem] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-gold/60 hover:text-gold-light"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Restaurar
              </button>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 border border-white/15 min-h-11 cursor-pointer px-3 py-2 text-[0.66rem] uppercase tracking-[0.16em] text-text-muted transition-colors hover:border-gold/60 hover:text-gold-light"
              >
                <LogOut className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>{loginOpen && <LoginDialog onClose={() => setLoginOpen(false)} />}</AnimatePresence>
    </>
  );
}

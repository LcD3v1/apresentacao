import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ContentProvider, useContent } from './context/ContentContext';
import ErrorBoundary from './components/ErrorBoundary';
import AccessScreen from './components/AccessScreen';
import SandTransition from './components/SandTransition';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Hero from './components/Hero';
import MembersSection from './components/MembersSection';
import MemberModal from './components/MemberModal';
import VideoModal from './components/VideoModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundMusic from './components/BackgroundMusic';
import AdminBar from './components/admin/AdminBar';
import MemberEditor from './components/admin/MemberEditor';

const ENTERED_KEY = 'al-thamaniya:entered';

function Site() {
  const { language, localize } = useLanguage();
  const { members, site } = useContent();

  /**
   * Três momentos: a porta ('gate'), a cortina de areia ('transition') e o
   * site ('site'). O site já monta durante a cortina, então quando ela abre
   * não há espera nem salto de layout.
   */
  const [phase, setPhase] = useState(() => {
    try {
      return window.sessionStorage.getItem(ENTERED_KEY) === '1' ? 'site' : 'gate';
    } catch {
      return 'gate';
    }
  });

  const [profileMember, setProfileMember] = useState(null);
  const [videoMember, setVideoMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const enter = useCallback(() => setPhase('transition'), []);

  const finishTransition = useCallback(() => {
    try {
      window.sessionStorage.setItem(ENTERED_KEY, '1');
    } catch {
      /* modo privado: a porta reaparece no próximo carregamento */
    }
    setPhase('site');
  }, []);

  // A página não deve rolar enquanto a porta ou a cortina estiverem na frente.
  useEffect(() => {
    document.body.classList.toggle('modal-open', phase !== 'site');
    return () => document.body.classList.remove('modal-open');
  }, [phase]);

  const access = site.access ?? {};
  const transitionLogo = access.transitionLogo || access.logoPrimary;

  const openProfile = useCallback((member) => setProfileMember(member), []);
  const playVideo = useCallback((member) => setVideoMember(member), []);

  // Mantém o integrante aberto em sincronia com o que foi editado.
  const liveProfile = profileMember ? members.find((m) => m.id === profileMember.id) ?? null : null;
  const liveVideo = videoMember ? members.find((m) => m.id === videoMember.id) ?? null : null;

  return (
    <>
      {/* Fora do AnimatePresence: a trilha atravessa a transição sem parar */}
      <BackgroundMusic url={access.music} />

      <AnimatePresence>
        {phase === 'gate' && <AccessScreen key="access" onEnter={enter} />}
        {phase === 'transition' && (
          <SandTransition
            key="curtain"
            logo={transitionLogo}
            alt={localize(access.logoPrimaryAlt) || ''}
            onDone={finishTransition}
          />
        )}
      </AnimatePresence>

      {phase !== 'gate' && (
        <>
          <ScrollProgress />
          <Header />

          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={language}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: 'easeInOut' }}
            >
              <Hero />
              <MembersSection
                onOpenProfile={openProfile}
                onPlayVideo={playVideo}
                onEditMember={setEditingMember}
              />
            </motion.main>
          </AnimatePresence>

          <Footer />
          <ScrollToTop />

          <MemberModal
            member={liveProfile}
            onClose={() => setProfileMember(null)}
            onPlayVideo={playVideo}
          />
          <VideoModal member={liveVideo} onClose={() => setVideoMember(null)} />

          {editingMember && (
            <MemberEditor
              member={members.find((m) => m.id === editingMember.id) ?? editingMember}
              onClose={() => setEditingMember(null)}
            />
          )}
        </>
      )}

      <AdminBar />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ContentProvider>
          <Site />
        </ContentProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

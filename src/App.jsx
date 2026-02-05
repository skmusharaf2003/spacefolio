import { MascotProvider, useMascot } from "./context/MascotContext";
import AppRoutes from "./AppRoutes";
import { useState, useEffect } from "react";
import MascotBot from "./bot/MascotBot";
import VoiceToggle from "./bot/VoiceToggle";
import LoadingScreen from "./components/loadingscreen/LoadingScreen"
const HAS_VISITED_KEY = "hasVisitedPortfolio";
function MascotLayer() {
  const {
    activePlanetPos,
    voiceEnabled,
    toggleVoice,
    speech
  } = useMascot();



  return (
    <>
      <MascotBot
        speech={speech}
        target={activePlanetPos}
        voiceEnabled={voiceEnabled}
      />
      <VoiceToggle
        enabled={voiceEnabled}
        onToggle={toggleVoice}
      />
    </>
  );
}

function App() {

  const [loaded, setLoaded] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem(HAS_VISITED_KEY);

    if (hasVisited) {
      // Already visited → skip loading screen completely
      setShouldShowLoading(false);
      setLoaded(true);
      return;
    }


    // First visit → show loading screen with timer
    const timer = setTimeout(() => {
      setLoaded(true);
      // Mark as visited so next time we skip it
      localStorage.setItem(HAS_VISITED_KEY, "true");
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  if (shouldShowLoading && !loaded) {
    return <LoadingScreen />;
  }


  return (
    <MascotProvider>
      <AppRoutes />
      <MascotLayer />
    </MascotProvider>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bluetooth, 
  Cpu, 
  Battery, 
  Activity, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  HelpCircle,
  X,
  Sliders
} from 'lucide-react';

interface DeviceConnectorProps {
  language: 'it' | 'en';
}

interface SimulatedDevice {
  id: string;
  name: string;
  type: string;
  battery: number;
  rssi: number;
}

export default function DeviceConnector({ language }: DeviceConnectorProps) {
  // Connection states: 'disconnected' | 'searching' | 'connecting' | 'connected'
  const [connectionState, setConnectionState] = useState<'disconnected' | 'searching' | 'connecting' | 'connected'>('disconnected');
  const [selectedDevice, setSelectedDevice] = useState<SimulatedDevice | null>(null);
  
  // Telemetry states
  const [angle, setAngle] = useState<number>(12); // degrees of slouching
  const [calibratedOffset, setCalibratedOffset] = useState<number>(0);
  const [audioAlerts, setAudioAlerts] = useState<boolean>(true);
  const [autoDrift, setAutoDrift] = useState<boolean>(false);
  const [postureStreak, setPostureStreak] = useState<number>(0); // consecutive seconds of good posture
  
  // Audio state refs to prevent overlapping alert prompts too frequently
  const lastAlertTime = useRef<number>(0);
  const driftInterval = useRef<any>(null);
  const streakInterval = useRef<any>(null);

  // Available simulated devices
  const availableDevices: SimulatedDevice[] = [
    { id: 'dev-smartspine', name: 'SmartSpine Tracker Pro v2', type: 'Sensore Posturale Biometrico', battery: 84, rssi: -58 },
    { id: 'dev-postureband', name: 'PostureBand Lite S1', type: 'Fascia Intelligente Lombare', battery: 67, rssi: -72 },
    { id: 'dev-neckfit', name: 'NeckFit Align collar', type: 'Collare Cervicale IoT', battery: 92, rssi: -45 }
  ];

  // Translate labels inside the component
  const t = {
    it: {
      title: 'Dispositivo Smart Schiena',
      subtitle: 'Collega un sensore posturale via Bluetooth',
      connectBtn: 'Connetti Sensore',
      disconnectBtn: 'Disconnetti',
      scanning: 'Ricerca dispositivi Bluetooth...',
      connecting: 'Associazione con il dispositivo...',
      selectDevice: 'Seleziona un sensore posturale trovato:',
      cancel: 'Annulla',
      statusLabel: 'Stato Connessione',
      connected: 'Connesso',
      disconnected: 'Disconnesso',
      postureStatus: 'Valutazione Postura',
      goodPosture: 'Ottima Postura',
      poorPosture: 'Postura Scorretta!',
      slouchWarning: 'Spalle Curve / Cedimento!',
      angleLabel: 'Inclinazione Colonna',
      calibrateBtn: 'Calibra come Zero',
      calibratedSuccess: 'Zero calibrato con successo!',
      audioAlertsLabel: 'Avvisi Vocali / Acustici',
      simulatorsTitle: 'Emulatori di Test',
      driftLabel: 'Deriva Temporale (Simula Fatica)',
      manualSlider: 'Simula Angolo Manuale',
      batteryLabel: 'Batteria Sensore',
      signalLabel: 'Segnale (RSSI)',
      perfectStreak: 'Tempo in Postura Corretta',
      perfectStreakUnit: 'secondi',
      exerciseAdvice: 'Postura scorretta rilevata troppo a lungo. Fai una pausa per fare un allungamento della zona interessata!',
      seconds: 's',
      deviceType: 'Modello',
      activeAlert: 'RADDRIZZA LA SCHIENA'
    },
    en: {
      title: 'Smart Back Device',
      subtitle: 'Connect a posture sensor via Bluetooth',
      connectBtn: 'Connect Sensor',
      disconnectBtn: 'Disconnect',
      scanning: 'Searching for Bluetooth devices...',
      connecting: 'Pairing with device...',
      selectDevice: 'Select a discovered posture sensor:',
      cancel: 'Cancel',
      statusLabel: 'Connection Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      postureStatus: 'Posture Evaluation',
      goodPosture: 'Excellent Posture',
      poorPosture: 'Poor Posture!',
      slouchWarning: 'Slouched shoulders / slouching!',
      angleLabel: 'Spine Tilt Angle',
      calibrateBtn: 'Calibrate as Zero',
      calibratedSuccess: 'Zero posture calibrated successfully!',
      audioAlertsLabel: 'Voice & Audio Alerts',
      simulatorsTitle: 'Testing Emulators',
      driftLabel: 'Auto-Drift (Simulate Fatigue)',
      manualSlider: 'Simulate Manual Angle',
      batteryLabel: 'Sensor Battery',
      signalLabel: 'Signal (RSSI)',
      perfectStreak: 'Time in Good Posture',
      perfectStreakUnit: 'seconds',
      exerciseAdvice: 'Poor posture detected for too long. Take a break and do a quick stretch!',
      seconds: 's',
      deviceType: 'Model',
      activeAlert: 'STRAIGHTEN YOUR BACK'
    }
  }[language];

  // Compute the final relative angle
  const currentRelativeAngle = Math.max(0, Math.abs(angle - calibratedOffset));
  const isSlouching = currentRelativeAngle >= 22;

  // Handle Speech Alert using browser native SpeechSynthesis
  const speakAlert = () => {
    if (!audioAlerts) return;
    const now = Date.now();
    // Throttle voice alerts to once every 10 seconds to avoid annoying loop
    if (now - lastAlertTime.current > 10000) {
      lastAlertTime.current = now;
      
      // Attempt Voice Speech
      if ('speechSynthesis' in window) {
        const textToSpeak = language === 'it' 
          ? 'Per favore, raddrizza la schiena e mantieni la corretta postura.' 
          : 'Please, straighten your back and maintain a good posture.';
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = language === 'it' ? 'it-IT' : 'en-US';
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback to standard web beep audio context
        try {
          const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
          gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.start();
          setTimeout(() => oscillator.stop(), 400);
        } catch (e) {
          console.log('Audio Context beep not supported or blocked by user gesture.');
        }
      }
    }
  };

  // Check slouching to trigger sound
  useEffect(() => {
    if (connectionState === 'connected' && isSlouching) {
      speakAlert();
    }
  }, [connectionState, isSlouching]);

  // Handle Automatic Fatigue Drift Simulator
  useEffect(() => {
    if (connectionState === 'connected' && autoDrift) {
      driftInterval.current = setInterval(() => {
        setAngle(prev => {
          // Slowly drift upwards towards slouching posture (adding 1-3 degrees every 2 seconds)
          if (prev < 45) {
            return Math.min(45, prev + Math.floor(Math.random() * 3) + 1);
          }
          return prev;
        });
      }, 2000);
    } else {
      if (driftInterval.current) clearInterval(driftInterval.current);
    }

    return () => {
      if (driftInterval.current) clearInterval(driftInterval.current);
    };
  }, [connectionState, autoDrift]);

  // Handle Perfect Posture Streak Tracker
  useEffect(() => {
    if (connectionState === 'connected') {
      streakInterval.current = setInterval(() => {
        if (!isSlouching) {
          setPostureStreak(prev => prev + 1);
        } else {
          setPostureStreak(0);
        }
      }, 1000);
    } else {
      setPostureStreak(0);
      if (streakInterval.current) clearInterval(streakInterval.current);
    }

    return () => {
      if (streakInterval.current) clearInterval(streakInterval.current);
    };
  }, [connectionState, isSlouching]);

  // Trigger search simulation
  const startSearch = () => {
    setConnectionState('searching');
  };

  // Select device and connect
  const connectDevice = (device: SimulatedDevice) => {
    setSelectedDevice(device);
    setConnectionState('connecting');
    setTimeout(() => {
      setConnectionState('connected');
      setAngle(12); // starts with relatively straight back
      setCalibratedOffset(0); // reset calibration
    }, 1800);
  };

  const handleDisconnect = () => {
    setConnectionState('disconnected');
    setSelectedDevice(null);
    setAutoDrift(false);
  };

  const handleCalibrate = () => {
    setCalibratedOffset(angle);
    // Show temporary alert message
    alert(t.calibratedSuccess);
  };

  return (
    <div id="smart-device-connector-card" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 relative overflow-hidden">
      {/* Absolute background visual details */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-50 rounded-full opacity-40 pointer-events-none" />

      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {connectionState === 'connected' ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : connectionState === 'searching' ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-300"></span>
              )}
            </span>
            <span>{t.title}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {t.subtitle}
          </p>
        </div>
        <Bluetooth className={`w-5 h-5 ${connectionState === 'connected' ? 'text-indigo-600' : 'text-slate-300'}`} />
      </div>

      {/* STATE 1: Disconnected */}
      {connectionState === 'disconnected' && (
        <div className="space-y-4 pt-1">
          <div className="bg-slate-50 border border-slate-100/60 rounded-2xl p-4 flex gap-3.5 items-center">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-3xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-700 block">SmartSpine Sensor Tracker</span>
              <span className="text-slate-400 leading-relaxed block">
                {language === 'it' 
                  ? 'Collega e attiva la bio-calibrazione per ricevere correzioni posturali parlando o con avviso acustico se ti incurvi davanti al computer.'
                  : 'Connect and enable bio-calibration to receive spoken correction alerts or beeps if you slouch in front of your computer.'}
              </span>
            </div>
          </div>

          <button
            id="start-bluetooth-search-btn"
            onClick={startSearch}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            {t.connectBtn}
          </button>
        </div>
      )}

      {/* STATE 2: Searching */}
      {connectionState === 'searching' && (
        <div className="space-y-4 py-1">
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                <Bluetooth className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-30" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide animate-pulse">
              {t.scanning}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.selectDevice}
            </span>
            {availableDevices.map((device) => (
              <button
                key={device.id}
                onClick={() => connectDevice(device)}
                className="w-full text-left bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-100 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block group-hover:text-indigo-900">{device.name}</span>
                  <span className="text-[10px] text-slate-400 block">{device.type}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                  <span>RSSI {device.rssi} dBm</span>
                  <Bluetooth className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <button
            id="cancel-bluetooth-search-btn"
            onClick={() => setConnectionState('disconnected')}
            className="w-full border border-slate-200 text-slate-500 text-xs py-2.5 rounded-xl font-bold transition-all text-center cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>
      )}

      {/* STATE 3: Connecting */}
      {connectionState === 'connecting' && (
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-indigo-600 border-indigo-100 animate-spin flex items-center justify-center">
            <Cpu className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-slate-700 block">
              {t.connecting}
            </span>
            {selectedDevice && (
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {selectedDevice.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* STATE 4: Connected Dashboard */}
      {connectionState === 'connected' && selectedDevice && (
        <div className="space-y-5 pt-1">
          {/* Active Status Ribbon */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div className="text-[10px] font-bold text-emerald-800">
                <span className="uppercase">{t.statusLabel}:</span> <span className="text-emerald-700">{selectedDevice.name}</span>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase shrink-0"
            >
              {t.disconnectBtn}
            </button>
          </div>

          {/* Device Hardware Info Bar */}
          <div className="grid grid-cols-2 gap-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-600" /> {t.batteryLabel}</span>
              <span className="text-slate-800 font-mono">{selectedDevice.battery}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-500" /> {t.signalLabel}</span>
              <span className="text-slate-800 font-mono">{selectedDevice.rssi} dBm</span>
            </div>
          </div>

          {/* TELEMETRY MAIN DISPLAY - ANGLE AND FEEDBACK */}
          <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/40 space-y-4">
            
            {/* Real-time Angle Arc / Graph Simulator */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2 relative">
              
              {/* Dynamic Posture Status Notification Badge */}
              <div className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs transition-all ${
                isSlouching 
                  ? 'bg-red-50 text-red-700 border-red-200 animate-bounce' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {isSlouching ? `🚨 ${t.poorPosture}` : `✨ ${t.goodPosture}`}
              </div>

              {/* The Visual angle gauge meter */}
              <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden pt-4">
                {/* SVG Semi Circle Gauge */}
                <svg className="w-36 h-18 absolute bottom-0 left-1/2 -translate-x-1/2">
                  {/* Background Track */}
                  <path 
                    d="M 10 70 A 60 60 0 0 1 134 70" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="10" 
                    strokeLinecap="round"
                  />
                  {/* Value Track */}
                  <path 
                    d="M 10 70 A 60 60 0 0 1 134 70" 
                    fill="none" 
                    stroke={isSlouching ? '#ef4444' : '#10b981'} 
                    strokeWidth="10" 
                    strokeLinecap="round"
                    strokeDasharray="195"
                    strokeDashoffset={195 - (195 * Math.min(currentRelativeAngle, 45)) / 45}
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Center needle or big degree value */}
                <div className="text-center relative z-10 space-y-0.5">
                  <span className="text-3xl font-display font-extrabold text-slate-800 font-mono tracking-tight">
                    {currentRelativeAngle}°
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    {t.angleLabel}
                  </span>
                </div>
              </div>

              {/* Dynamic text helper based on slouching */}
              <div className="text-center px-4 max-w-sm">
                {isSlouching ? (
                  <p className="text-[11px] text-red-600 font-bold leading-relaxed flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                    <span>{t.slouchWarning}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-bold leading-relaxed">
                    {language === 'it' ? 'Allineamento colonna corretto.' : 'Correct spine alignment.'}
                  </p>
                )}
              </div>
            </div>

            {/* Calibration & Audio toggles block */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="calibrate-posture-sensor-btn"
                onClick={handleCalibrate}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                {t.calibrateBtn}
              </button>

              <button
                id="toggle-posture-audio-btn"
                onClick={() => setAudioAlerts(!audioAlerts)}
                className={`border font-bold text-[11px] py-2.5 px-3 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  audioAlerts 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {audioAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {t.audioAlertsLabel}
              </button>
            </div>
          </div>

          {/* GOOD POSTURE STREAK COUNTER */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 block">
                {t.perfectStreak}
              </span>
              <span className="text-lg font-display font-black leading-none">
                {postureStreak} {t.perfectStreakUnit}
              </span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
              {postureStreak >= 30 ? (
                <span>🌟 EXCELLENT!</span>
              ) : postureStreak >= 10 ? (
                <span>🔥 GOOD JOB</span>
              ) : (
                <span>🧘 KEEP ACTIVE</span>
              )}
            </div>
          </div>

          {/* TESTING SIMULATORS AND TELEMETRY CONTROLLER */}
          <div className="border border-dashed border-slate-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-4 h-4 text-indigo-500" />
                {t.simulatorsTitle}
              </span>
              <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                SANDBOX
              </span>
            </div>

            {/* Slider to simulate spinal angle */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>{t.manualSlider}</span>
                <span className="font-mono text-indigo-600">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={angle}
                onChange={(e) => {
                  setAngle(parseInt(e.target.value));
                  if (autoDrift) setAutoDrift(false); // disable auto drift if user manually interacts
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                <span>0° (Eretto)</span>
                <span>22° (Soglia)</span>
                <span>50° (Chino)</span>
              </div>
            </div>

            {/* Auto Drift simulator switch */}
            <label className="flex items-center justify-between cursor-pointer pt-1 group">
              <div className="space-y-0.5 text-left">
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                  {t.driftLabel}
                </span>
                <p className="text-[10px] text-slate-400 leading-normal max-w-xs">
                  {language === 'it'
                    ? 'Simula lo scivolamento e stanchezza della postura nel tempo'
                    : 'Simulate posture sliding and fatigue drift over time'}
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoDrift}
                  onChange={(e) => setAutoDrift(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </div>
            </label>
          </div>

          {/* Exercises warning warning */}
          {isSlouching && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl p-4 text-xs space-y-1.5 leading-relaxed">
              <span className="font-bold flex items-center gap-1">
                ⚠️ {language === 'it' ? 'Suggerimento Correttivo:' : 'Corrective Suggestion:'}
              </span>
              <p className="text-slate-600 font-medium text-[11px]">
                {t.exerciseAdvice}
              </p>
              <div className="flex gap-2 pt-1.5">
                <a
                  href="#exercises-catalog"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors inline-block"
                >
                  {language === 'it' ? 'Esegui Allungamenti' : 'Perform Stretches'}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

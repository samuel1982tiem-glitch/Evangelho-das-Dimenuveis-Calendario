/**
 * @file src/components/GpsPermissionModal.tsx
 * Classical book-styled GPS Permission Dialog for Android APK and web.
 * Allows the user to grant GPS access so local Sunrise, Solar Noon, and Sunset
 * times are calculated for their real coordinates instead of generic Jerusalem.
 */

import React, { useState } from 'react';
import { MapPin, Compass, Sun, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { Language } from '../i18n/translations';
import {
  requestLocalGpsCoordinates,
  markGpsPromptDecided,
  ResolvedUserLocation,
} from '../services/geolocationService';

interface GpsPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentLocation?: {
    latitude: number;
    longitude: number;
    cityName?: string;
  };
  onLocationResolved: (location: ResolvedUserLocation) => void;
}

export const GpsPermissionModal: React.FC<GpsPermissionModalProps> = ({
  isOpen,
  onClose,
  language,
  currentLocation,
  onLocationResolved,
}) => {
  const isPt = language === 'pt';
  const [status, setStatus] = useState<'IDLE' | 'REQUESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resolvedLoc, setResolvedLoc] = useState<ResolvedUserLocation | null>(null);

  if (!isOpen) return null;

  const handleAllowGps = async () => {
    setStatus('REQUESTING');
    setErrorMessage('');
    try {
      const loc = await requestLocalGpsCoordinates(language);
      setResolvedLoc(loc);
      setStatus('SUCCESS');
      onLocationResolved(loc);
      setTimeout(() => {
        setStatus('IDLE');
        onClose();
      }, 1100);
    } catch (err: any) {
      setStatus('ERROR');
      if (err?.message === 'PERMISSION_DENIED') {
        setErrorMessage(
          isPt
            ? 'Permissão de GPS negada. Ative a localização nas configurações do Android/navegador ou insira as coordenadas manualmente na aba Ajustes.'
            : 'GPS permission denied. Enable location access in your Android/browser settings or enter coordinates manually in the Settings tab.'
        );
      } else {
        setErrorMessage(
          isPt
            ? 'Não foi possível obter o sinal de GPS no momento. Verifique se a localização do aparelho está ligada.'
            : 'Could not acquire a GPS fix right now. Please verify that your device location service is turned on.'
        );
      }
    }
  };

  const handleKeepJerusalem = () => {
    markGpsPromptDecided();
    setStatus('IDLE');
    setErrorMessage('');
    onClose();
  };

  const rawCity = currentLocation?.cityName || '';
  const displayCurrentCity =
    !rawCity || rawCity === 'Jerusalem (Default)'
      ? isPt
        ? 'Jerusalém (Padrão)'
        : 'Jerusalem (Default)'
      : rawCity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gps-permission-title"
    >
      <div className="relative w-full max-w-lg border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl divide-y divide-slate-800 font-serif">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 bg-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold whitespace-nowrap">
              {isPt ? 'Permissão de GPS Local' : 'Local GPS Permission'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleKeepJerusalem}
            className="inline-flex items-center justify-center w-7 h-7 border border-slate-700 bg-slate-950 hover:border-amber-500/60 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer shrink-0"
            title={isPt ? 'Fechar' : 'Close'}
            aria-label={isPt ? 'Fechar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 border border-amber-500/40 bg-amber-950/20 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0 space-y-1">
              <h2
                id="gps-permission-title"
                className="text-base sm:text-xl font-bold text-slate-100 leading-tight whitespace-nowrap"
              >
                {isPt ? 'Efemérides Solares Locais' : 'Local Solar Ephemeris'}
              </h2>
              <p className="text-xs italic text-amber-300/90 whitespace-nowrap">
                {isPt
                  ? 'Nascer e Pôr do Sol na sua localização'
                  : 'Sunrise & Sunset at your location'}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {isPt
              ? 'Deseja permitir o acesso ao GPS do seu aparelho para calcular com precisão os horários locais de Nascer do Sol, Meio-Dia Solar, Pôr do Sol (início do dia bíblico) e Crepúsculo na sua cidade, em vez de usar Jerusalém como padrão?'
              : 'Would you like to allow device GPS access to accurately calculate local Sunrise, Solar Noon, Sunset (Biblical day boundary), and Dusk times at your location instead of using generic Jerusalem?'}
          </p>

          {/* Current vs Local Comparison Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-800 border border-slate-800 text-xs">
            <div className="bg-slate-950 p-3.5 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider font-semibold block whitespace-nowrap">
                {isPt ? 'Localização Atual' : 'Current Location'}
              </span>
              <strong className="text-slate-200 block whitespace-nowrap">
                {displayCurrentCity}
              </strong>
              <span className="text-slate-400 tabular-nums block whitespace-nowrap">
                {(currentLocation?.latitude ?? 31.7683).toFixed(4)}°, {(currentLocation?.longitude ?? 35.2137).toFixed(4)}°
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 space-y-1">
              <span className="text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 whitespace-nowrap">
                <Sun className="w-3.5 h-3.5 shrink-0" />
                <span>{isPt ? 'Cálculo com GPS' : 'With Local GPS'}</span>
              </span>
              <strong className="text-amber-300 block whitespace-nowrap">
                {isPt ? 'Horizonte Solar Real' : 'True Local Horizon'}
              </strong>
              <span className="text-slate-300 block whitespace-nowrap">
                {isPt ? '100% no aparelho (privado)' : '100% on-device (private)'}
              </span>
            </div>
          </div>

          {/* Status Feedback */}
          {status === 'SUCCESS' && resolvedLoc && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <div className="font-bold whitespace-nowrap">
                  {isPt ? 'GPS Local Ativado!' : 'Local GPS Activated!'}
                </div>
                <div className="text-emerald-200 tabular-nums whitespace-nowrap">
                  {resolvedLoc.cityName} ({resolvedLoc.latitude.toFixed(4)}°, {resolvedLoc.longitude.toFixed(4)}°)
                </div>
              </div>
            </div>
          )}

          {status === 'ERROR' && errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 px-4 sm:px-6 py-3.5 bg-slate-900/80 text-xs">
          <button
            type="button"
            onClick={handleKeepJerusalem}
            disabled={status === 'REQUESTING'}
            className="px-3.5 py-2 border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            {isPt ? 'Manter Jerusalém (Padrão)' : 'Keep Jerusalem (Default)'}
          </button>

          <button
            type="button"
            onClick={handleAllowGps}
            disabled={status === 'REQUESTING'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            {status === 'REQUESTING' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{isPt ? 'Obtendo GPS...' : 'Acquiring GPS...'}</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{isPt ? 'Permitir GPS Local' : 'Allow Local GPS'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

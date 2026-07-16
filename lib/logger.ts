/**
 * Dev-only log helpers · no-op en producción.
 *
 * Audit cleanup 2026-04-30 D.5: el repo tenía ~50 `console.log/.warn/.debug`
 * directos en hot paths (WS hooks, services, pages). Riesgos en producción:
 * (1) ruido en consola del cliente · (2) mínima fuga de payloads sensibles
 * (lo que se imprime en `console.log` queda en DevTools del browser indefinido)
 * · (3) bundle size (terser puede tree-shake `() => {}` pero NO `console.log`).
 *
 * Patrón: importar `devLog`/`devWarn`/`devDebug` y usar normal. En producción
 * (`process.env.NODE_ENV === 'production'`) cada función es no-op estática
 * → terser elimina los call sites como dead code.
 *
 * `console.error` se mantiene tal cual en el código — los errores legítimos
 * (WS connection failure, parse failure, network timeout) ayudan a triage en
 * producción y deben llegar a Sentry/Datadog si está wireado.
 *
 * Uso:
 *   import { devLog, devWarn, devDebug } from '@/lib/logger';
 *   devLog('[WS] Connected');                // visible solo en dev
 *   devWarn('[WS] Reconnect attempt', n);    // visible solo en dev
 *   console.error('[WS] Connection error', err); // siempre visible
 */

const DEV = process.env.NODE_ENV !== 'production';

const noop = (..._args: unknown[]): void => {};

export const devLog: (...args: unknown[]) => void = DEV
  ? console.log.bind(console)
  : noop;

export const devWarn: (...args: unknown[]) => void = DEV
  ? console.warn.bind(console)
  : noop;

export const devDebug: (...args: unknown[]) => void = DEV
  ? console.debug.bind(console)
  : noop;

export const devInfo: (...args: unknown[]) => void = DEV
  ? console.info.bind(console)
  : noop;

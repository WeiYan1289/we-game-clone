"use client";

import { type FormEvent, type MouseEvent, useEffect, useId, useRef, useState } from "react";
import { goPath } from "@/data/links";
import { useModalDialog } from "@/hooks/useModalDialog";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { type LoginErrors, validateLogin } from "@/lib/login";
import { Icon } from "../ui/Icon";
import styles from "./LoginModal.module.css";

type Props = { dict: Dictionary["login"]; locale: Locale; onClose: () => void };

type Status = "idle" | "submitting" | "done";

/** Simulated round-trip so the loading state is visible. Nothing is sent anywhere. */
const FAKE_LATENCY_MS = 1000;

/**
 * Themed login modal. A demo: inputs are validated client-side, a loading
 * state is shown, then a notice explains that no real account system exists —
 * credentials never leave the browser (no fetch, no storage).
 */
export function LoginModal({ dict, locale, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  useModalDialog(dialogRef);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateLogin({ account, password });
    setErrors(next);
    if (next.account) return accountRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();

    setStatus("submitting");
    timer.current = setTimeout(() => {
      setStatus("done");
      setPassword(""); // don't keep the secret around in state
    }, FAKE_LATENCY_MS);
  };

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const accountError = errors.account && dict.errors[errors.account];
  const passwordError = errors.password && dict.errors[errors.password];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={onBackdropClick}
    >
      <div className={styles.card}>
        <header className={styles.head}>
          <div className={styles.brandMark} aria-hidden="true">
            <Icon name="user" size={22} />
          </div>
          <div>
            <h2 id={`${id}-title`} className={styles.title}>
              {dict.title}
            </h2>
            <p className={styles.subtitle}>{dict.subtitle}</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={dict.close}>
            <Icon name="close" />
          </button>
        </header>

        <p className={styles.badge}>{dict.demoBadge}</p>

        <form className={styles.form} onSubmit={onSubmit} noValidate autoComplete="off">
          <div className={styles.field} data-invalid={!!accountError}>
            <label htmlFor={`${id}-account`}>{dict.account}</label>
            <input
              ref={accountRef}
              id={`${id}-account`}
              inputMode="numeric"
              autoComplete="off"
              placeholder={dict.accountPlaceholder}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              aria-invalid={!!accountError}
              aria-describedby={accountError ? `${id}-account-error` : undefined}
              disabled={status === "submitting"}
            />
            {accountError && (
              <p id={`${id}-account-error`} className={styles.error}>
                {accountError}
              </p>
            )}
          </div>

          <div className={styles.field} data-invalid={!!passwordError}>
            <label htmlFor={`${id}-password`}>{dict.password}</label>
            <div className={styles.passwordRow}>
              <input
                ref={passwordRef}
                id={`${id}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                placeholder={dict.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? `${id}-password-error` : undefined}
                disabled={status === "submitting"}
              />
              <button
                type="button"
                className={styles.reveal}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? dict.hidePassword : dict.showPassword}
                aria-pressed={showPassword}
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
            {passwordError && (
              <p id={`${id}-password-error`} className={styles.error}>
                {passwordError}
              </p>
            )}
          </div>

          <label className={styles.remember}>
            <input type="checkbox" />
            <span>{dict.remember}</span>
          </label>

          <button type="submit" className={styles.submit} disabled={status === "submitting"}>
            {status === "submitting" && <span className={styles.spinner} aria-hidden="true" />}
            {status === "submitting" ? dict.submitting : dict.submit}
          </button>

          {status === "done" && (
            <p role="status" className={styles.result}>
              {dict.demoResult}
            </p>
          )}
        </form>

        <div className={styles.divider}>
          <span>{dict.other}</span>
        </div>

        <div className={styles.providers}>
          <a href={goPath(locale, "login")} className={styles.provider} data-provider="qq">
            <span className={styles.providerDot} aria-hidden="true">
              Q
            </span>
            {dict.qq}
          </a>
          <a href={goPath(locale, "login")} className={styles.provider} data-provider="wechat">
            <span className={styles.providerDot} aria-hidden="true">
              W
            </span>
            {dict.wechat}
          </a>
        </div>

        <a href={goPath(locale, "login")} className={styles.official}>
          {dict.official}
          <Icon name="external" size={14} />
        </a>
        <p className={styles.agreement}>{dict.agreement}</p>
      </div>
    </dialog>
  );
}

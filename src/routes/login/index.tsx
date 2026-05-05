import { TopBar } from "@core-nexus/components/layout/TopBar";
import { HexBackground, OrbitalOrb, StatusDot } from "@core-nexus/components/ui";
import { getVaultFromEntry, type UserEntry } from "@core-nexus/user-vault";
import { cx } from "@core-nexus/utils/cx";
import { LocalStorage } from "@efficimo/storage";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import styles from "./Login.module.css";

const userEntrySchema = z.object({
  kid: z.string(),
  publicKey: z.record(z.string(), z.unknown()),
  salt: z.string(),
  iv: z.string(),
  encryptedPrivateKey: z.string(),
  wrappedMasterKey: z.string(),
});
const usersSchema = z.record(z.string(), userEntrySchema);

async function fetchLoginData(): Promise<{
  users: Record<string, UserEntry>;
}> {
  const base = `${import.meta.env.BASE_URL}data`;
  const usersRes = await fetch(`${base}/users.json`);
  if (!usersRes.ok) throw new Error("Failed to fetch users.json");
  const users = usersSchema.parse(await usersRes.json()) as Record<string, UserEntry>;
  return { users };
}

const LOGIN_TAGS = [{ label: "Portail d'Authentification" }];

export const Route = createFileRoute("/login/")({
  loader: fetchLoginData,
  component: Login,
});

function useClock(): string {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("fr-FR"));
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setTime(new Date().toLocaleTimeString("fr-FR"));
      id = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    id = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => clearTimeout(id);
  }, []);
  return time;
}

function Login() {
  const { users } = Route.useLoaderData();
  const navigate = useNavigate();

  const clock = useClock();

  const [booted, setBooted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [termState, setTermState] = useState<"idle" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successName, setSuccessName] = useState("");

  useEffect(() => {
    if (LocalStorage.get("#core-nexus/data-key")) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2400);
    return () => clearTimeout(t);
  }, []);

  function calcStrength(val: string): number {
    if (!val) return 0;
    return Math.min(
      (val.length > 6 ? 1 : 0) +
        (val.length > 10 ? 1 : 0) +
        (/[A-Z]/.test(val) ? 1 : 0) +
        (/[0-9!@#$%^&*]/.test(val) ? 1 : 0),
      4,
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scanning) return;
    setErrorMsg("");
    setTermState("idle");
    setScanning(true);

    await new Promise((r) => setTimeout(r, 1450));
    setScanning(false);

    try {
      const userEntry = users[email];
      if (!userEntry) {
        setTermState("error");
        setErrorMsg("Identifiant inconnu — accès refusé.");
        setTimeout(() => setTermState("idle"), 600);
        return;
      }

      const vault = await getVaultFromEntry(userEntry as UserEntry, password);
      LocalStorage.set("#core-nexus/user-email", email);
      LocalStorage.set("#core-nexus/data-key", await vault.export());

      setSuccessName(`Bienvenue, ${email}`);
      setTermState("success");
      setTimeout(() => navigate({ to: "/" }), 1200);
    } catch {
      setTermState("error");
      setErrorMsg("Mot de passe incorrect — accès refusé.");
      setTimeout(() => setTermState("idle"), 600);
    }
  };

  const barClass = (i: number) =>
    i >= pwStrength
      ? styles.pwBar
      : cx(styles.pwBar, pwStrength >= 3 ? styles.strong : styles.active);

  const loginRight = (
    <div className={styles.topRight}>
      <StatusDot status="connected" />
      <span className={styles.clock}>{clock}</span>
    </div>
  );

  return (
    <div className={styles.app}>
      <TopBar tags={LOGIN_TAGS} right={loginRight} />

      <div className={styles.main}>
        <HexBackground vignette />

        <div className={cx(styles.bootScreen, booted && styles.hidden)}>
          <div className={cx(styles.bootLine, styles.ok)}>INIT Core Nexus v{__APP_VERSION__}</div>
          <div className={cx(styles.bootLine, styles.ok)}>VÉRIF Intégrité Cryptographique</div>
          <div className={cx(styles.bootLine, styles.ok)}>CHARGEMENT Couche Authentification</div>
          <div className={cx(styles.bootLine, styles.sys)}>Terminal Prêt</div>
        </div>

        <div className={cx(styles.page, booted && styles.visible)}>
          <div className={cx(styles.errorToast, errorMsg && styles.visible)}>{errorMsg}</div>

          <div
            className={cx(
              styles.terminal,
              termState === "error" && styles.stateError,
              termState === "success" && styles.stateSuccess,
            )}
          >
            <div className={cx(styles.scanOverlay, scanning && styles.active)}>
              <div key={scanning ? "scanning" : "idle"} className={styles.scanLine} />
            </div>

            <div className={styles.cardTopbar}>
              <div className={styles.ctbDot} />
              <span>Terminal Sécurisé</span>
              <span className={styles.ctbSep}>{"//"}</span>
              <span className={styles.ctbAccent}>AES-256-GCM</span>
            </div>

            <div className={styles.brandSection}>
              <OrbitalOrb size="lg" className={styles.heroOrb} />
              <div className={styles.brandName}>CORE NEXUS</div>
              <div className={styles.brandSub}>Système de Commandement Distribué</div>
              <div className={styles.clearanceBadge}>Niveau Habilitation : ARCHITECTE</div>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="field-email">
                  Identifiant Architectural
                </label>
                <div className={styles.fieldWrap}>
                  <input
                    id="field-email"
                    className={cx(styles.fieldInput, termState === "error" && styles.err)}
                    type="email"
                    placeholder="architecte@nexus-prime.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="field-pw">
                  Phrase de Passe
                </label>
                <div className={styles.fieldWrap}>
                  <input
                    id="field-pw"
                    className={cx(styles.fieldInput, termState === "error" && styles.err)}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwStrength(calcStrength(e.target.value));
                    }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.fieldEye}
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? "◎" : "◉"}
                  </button>
                </div>
                <div className={styles.pwStrength}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={barClass(i)} />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={scanning || termState === "success"}
              >
                <div className={styles.btnDot} />
                {scanning ? "Vérification…" : "Authentifier"}
              </button>
            </form>

            <div className={styles.cardFooter}>
              <span>{"Nexus Prime // Nœud ∞"}</span>
              <button
                type="button"
                className={styles.footLink}
                onClick={() => alert("Contact : Maître-Patterniste de permanence")}
              >
                Clé oubliée ?
              </button>
            </div>

            <div className={cx(styles.successScreen, termState === "success" && styles.visible)}>
              <div className={styles.successOrb}>
                <div className={styles.successRing} />
                <div className={styles.successCore} />
              </div>
              <div className={styles.successTitle}>ACCÈS ACCORDÉ</div>
              <div className={styles.successSub}>{successName}</div>
              <div className={styles.successSubFaint}>Chargement du terminal…</div>
              <div className={styles.successBarWrap}>
                <div className={styles.successBar} />
              </div>
            </div>
          </div>

          <div className={styles.signature}>
            Core Nexus — Adeptus Architectus Digitalis — Nœud ∞
          </div>
        </div>
      </div>
    </div>
  );
}

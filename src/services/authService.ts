import { delay, loadSession, saveSession, store, type Session } from "./store";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

const FAST_DOMAINS = ["nu.edu.pk", "khi.nu.edu.pk"];

export const authService = {
  isFastEmail(email: string) {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    return FAST_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
  },

  async signup(input: SignupInput): Promise<Session> {
    if (!authService.isFastEmail(input.email)) {
      throw new Error("Use your FAST university email (e.g. k214512@nu.edu.pk).");
    }
    store.profile = { ...store.profile, name: input.name, email: input.email, verified: false };
    const session: Session = { role: "student", email: input.email, verified: false, onboarded: false };
    saveSession(session);
    return delay(session);
  },

  async login(email: string, password: string): Promise<Session> {
    if (!email || password.length < 6) throw new Error("Invalid email or password.");
    const session: Session = { role: "student", email, verified: true, onboarded: true };
    saveSession(session);
    return delay(session);
  },

  async adminLogin(email: string, password: string): Promise<Session> {
    if (!email || password.length < 6) throw new Error("Invalid admin credentials.");
    const session: Session = { role: "admin", email, verified: true, onboarded: true };
    saveSession(session);
    return delay(session);
  },

  async sendOtp(): Promise<{ sent: true }> {
    store.pendingOtp = "123456";
    return delay({ sent: true } as const, 700);
  },

  /** Mock rules: 123456 = success, 000000 = expired, anything else = invalid. */
  async verifyOtp(code: string): Promise<Session> {
    await delay(null, 700);
    if (code === "000000") throw new Error("This code has expired. Request a new one.");
    if (code !== store.pendingOtp) throw new Error("That code isn't correct. Please try again.");
    store.profile = { ...store.profile, verified: true };
    const session: Session = {
      role: "student",
      email: store.profile.email,
      verified: true,
      onboarded: false,
    };
    saveSession(session);
    return session;
  },

  getSession(): Session | null {
    return loadSession();
  },

  setOnboarded() {
    const session = loadSession();
    if (session) saveSession({ ...session, onboarded: true });
  },

  async logout() {
    saveSession(null);
    return delay(true, 200);
  },
};

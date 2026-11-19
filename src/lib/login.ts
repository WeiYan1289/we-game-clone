export type LoginFields = { account: string; password: string };
export type LoginErrorKey = "accountRequired" | "accountInvalid" | "passwordRequired" | "passwordShort";
export type LoginErrors = Partial<Record<keyof LoginFields, LoginErrorKey>>;

/** QQ numbers are 5–11 digits (no leading 0); mainland mobile numbers are 11 digits starting 1. */
const QQ = /^[1-9]\d{4,10}$/;
const PHONE = /^1\d{10}$/;

/** Pure client-side validation; returns dictionary keys so the UI can translate them. */
export function validateLogin({ account, password }: LoginFields): LoginErrors {
  const errors: LoginErrors = {};
  const a = account.trim();
  if (!a) errors.account = "accountRequired";
  else if (!QQ.test(a) && !PHONE.test(a)) errors.account = "accountInvalid";
  if (!password) errors.password = "passwordRequired";
  else if (password.length < 6) errors.password = "passwordShort";
  return errors;
}

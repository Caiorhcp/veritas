// Casos das regras de skills/lgpd/lgpd.semgrep.yml (formato do `semgrep --test`).
declare const logger: any;
export function ruim(user: any, cpf: string) {
  // ruleid: lgpd-dado-pessoal-em-log-js
  console.log("user", user.email);
  // ruleid: lgpd-dado-pessoal-em-log-js
  logger.info(cpf);
  // ruleid: lgpd-dado-pessoal-na-url
  return fetch(`/api/users?email=${user.email}`);
}
export function bom(user: any) {
  // ok: lgpd-dado-pessoal-em-log-js
  console.log("user id", user.id);
  // ok: lgpd-dado-pessoal-na-url
  return fetch("/api/users", { method: "POST", body: JSON.stringify({ email: user.email }) });
}

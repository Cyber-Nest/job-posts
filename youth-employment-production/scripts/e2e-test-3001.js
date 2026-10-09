(async () => {
  const base = 'http://localhost:3001';
  const ts = Math.floor(Date.now() / 1000);
  const email = `test+${ts}@example.com`;
  const username = `user${ts}`;

  console.log('[e2e] Registering user', email);
  const registerRes = await fetch(`${base}/api/auth/register/employer`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ firstName: 'Test', lastName: 'User', email, username, password: 'Passw0rd!', businessName: 'ACME', phoneNumber: '1234567890', province: 'ON' }),
  }).catch((err) => { console.error('[e2e] register error', err); process.exit(1); });

  console.log('[e2e] register status', registerRes.status);
  const regText = await registerRes.text();
  console.log('[e2e] register body:', regText);
  const setCookie = registerRes.headers.get('set-cookie') || registerRes.headers.get('Set-Cookie');
  console.log('[e2e] set-cookie header:', setCookie);

  let cookie = null;
  if (setCookie) {
    const m = setCookie.match(/local_session=([^;]+)/);
    if (m) cookie = `local_session=${m[1]}`;
  }

  if (!cookie) {
    console.log('[e2e] No local_session cookie from register; trying /api/auth/login');
    // try login route
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ identifier: email, password: 'Passw0rd!' }),
    });
    console.log('[e2e] login status', loginRes.status);
    const loginText = await loginRes.text();
    console.log('[e2e] login body:', loginText);
    const sc = loginRes.headers.get('set-cookie') || loginRes.headers.get('Set-Cookie');
    console.log('[e2e] login set-cookie:', sc);
    if (sc) {
      const m2 = sc.match(/local_session=([^;]+)/);
      if (m2) cookie = `local_session=${m2[1]}`;
    }
  }

  if (!cookie) {
    console.error('[e2e] Failed to obtain local_session cookie; aborting.');
    process.exit(1);
  }

  console.log('[e2e] cookie:', cookie);

  console.log('[e2e] Calling /api/auth/me');
  const meRes = await fetch(`${base}/api/auth/me`, { method: 'GET', headers: { cookie } });
  console.log('[e2e] /api/auth/me status', meRes.status);
  console.log('[e2e] /api/auth/me body:', await meRes.text());

  console.log('[e2e] Submitting job');
  const jobBody = {
    title: 'E2E Test Job',
    company: 'ACME',
    city: 'Toronto',
    province: 'ON',
    employmentType: 'Full-time',
    adDurationDays: 30,
    category: 'Tech',
    jobPostingDate: new Date().toISOString(),
    descriptionHtml: 'Test job',
    howToApply: { byEmail: true, email: 'hr@example.com' }
  };
  const jobRes = await fetch(`${base}/api/jobs`, { method: 'POST', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify(jobBody) });
  console.log('[e2e] /api/jobs status', jobRes.status);
  console.log('[e2e] /api/jobs body:', await jobRes.text());
})();

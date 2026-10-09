# Domain Setup Guide for pinkcycle.co.ke

This guide provides the exact DNS records needed to connect **`pinkcycle.co.ke`** and **`www.pinkcycle.co.ke`** to your Fly.io deployment (`https://pinkcycle.fly.dev`).

---

## 1. Fly.io Allocation Details

- **App Name:** `pinkcycle`
- **Region:** `jnb` (Johannesburg, South Africa)
- **Shared IPv4:** `66.241.125.252`
- **Dedicated IPv6:** `2a09:8280:1::179:809b:0`
- **Ownership Token:** `app-z3kopg3`
- **ACME Fly DNS Targets:**
  - `pinkcycle.co.ke` -> `pinkcycle.co.ke.z3kopg3.flydns.net.`
  - `www.pinkcycle.co.ke` -> `www.pinkcycle.co.ke.z3kopg3.flydns.net.`

---

## 2. Option A: Cloudflare (Recommended for Speed & Free DDoS Protection)

If `pinkcycle.co.ke` is managed in Cloudflare, go to **DNS → Records** and add:

| Type | Name | Content / Target | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `66.241.125.252` | ☁️ Proxied (Orange) | IPv4 routing |
| **AAAA** | `@` | `2a09:8280:1::179:809b:0` | ☁️ Proxied (Orange) | IPv6 routing |
| **CNAME** | `www` | `pinkcycle.fly.dev` | ☁️ Proxied (Orange) | www alias |
| **TXT** | `_fly-ownership` | `app-z3kopg3` | 🔘 DNS only (Grey) | Fly.io SSL & ownership verification |

> **Cloudflare SSL Setting:** Under **SSL/TLS → Overview**, make sure encryption mode is set to **Full** or **Full (strict)**.

---

## 3. Option B: Namecheap / cPanel DNS Zone Editor

Currently, the nameservers for `pinkcycle.co.ke` point to:
- `dns1.namecheaphosting.com`
- `dns2.namecheaphosting.com`

If you are managing DNS inside Namecheap cPanel **Zone Editor**:

1. Find the existing **A record** for `pinkcycle.co.ke` (currently pointing to `162.0.235.18`) and update it:
   - **Type:** `A`
   - **Name:** `pinkcycle.co.ke.` (or `@`)
   - **Record:** `66.241.125.252`

2. Add the **AAAA record**:
   - **Type:** `AAAA`
   - **Name:** `pinkcycle.co.ke.` (or `@`)
   - **Record:** `2a09:8280:1::179:809b:0`

3. Update the **www record**:
   - **Type:** `CNAME`
   - **Name:** `www.pinkcycle.co.ke.` (or `www`)
   - **Record:** `pinkcycle.fly.dev.`

4. Add the **TXT verification record**:
   - **Type:** `TXT`
   - **Name:** `_fly-ownership.pinkcycle.co.ke.`
   - **Record:** `app-z3kopg3`

5. (Optional ACME challenge for immediate pre-issuance):
   - **Type:** `CNAME`
   - **Name:** `_acme-challenge.pinkcycle.co.ke.`
   - **Record:** `pinkcycle.co.ke.z3kopg3.flydns.net.`
   - **Type:** `CNAME`
   - **Name:** `_acme-challenge.www.pinkcycle.co.ke.`
   - **Record:** `www.pinkcycle.co.ke.z3kopg3.flydns.net.`

---

## 4. Option C: HostAfrica Client Area

If you manage DNS records directly in the [HostAfrica Portal](https://panel.hostafrica.com/domains/307582):

1. **A Record:** `@` points to `66.241.125.252`
2. **AAAA Record:** `@` points to `2a09:8280:1::179:809b:0`
3. **CNAME Record:** `www` points to `pinkcycle.fly.dev`
4. **TXT Record:** `_fly-ownership` with text `app-z3kopg3`

---

## 5. Verification Command

Once DNS records are saved and propagated, run:

```powershell
$env:FLY_API_TOKEN="<YOUR_FLY_TOKEN>"
flyctl certs check pinkcycle.co.ke --app pinkcycle
flyctl certs check www.pinkcycle.co.ke --app pinkcycle
```

When Fly.io detects the records, the status changes to `Verified` and automatic Let's Encrypt certificates are issued.

import Medusa from "@medusajs/js-sdk";

// Server-only: authenticates with a Medusa secret API key (Settings → Secret API Keys
// in the admin). Never import this from a client component — the key must not reach
// the browser, which is why it isn't a NEXT_PUBLIC_ variable.
let adminSdk: Medusa | null | undefined;

export function getAdminSdk(): Medusa | null {
  if (adminSdk !== undefined) return adminSdk;
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const apiKey = process.env.MEDUSA_ADMIN_API_KEY;
  adminSdk = backendUrl && apiKey ? new Medusa({ baseUrl: backendUrl.replace(/\/+$/, ""), apiKey }) : null;
  return adminSdk;
}

// Records a newsletter opt-in on the Medusa customer with this email, creating a
// guest customer if none exists. Subscribers show up under Customers in the admin.
export async function subscribeToNewsletter(sdk: Medusa, email: string): Promise<void> {
  const subscribedAt = new Date().toISOString();
  const { customers } = await sdk.admin.customer.list({ email, fields: "id,email,has_account,metadata" });
  const existing = customers.find((c) => c.has_account) ?? customers[0];

  if (existing) {
    await sdk.admin.customer.update(existing.id, {
      metadata: { ...(existing.metadata ?? {}), newsletter: true, newsletter_subscribed_at: subscribedAt },
    });
    return;
  }

  await sdk.admin.customer.create({
    email,
    metadata: { newsletter: true, newsletter_subscribed_at: subscribedAt },
  });
}

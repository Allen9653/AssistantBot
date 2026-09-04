=== AssistantBot ===
Contributors: bh-assistant
Tags: chatbot, viber, payments, paypal, digital-download
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Checkout for AssistantBot with PayPal and bank-transfer payment workflows.

== Description ==

AssistantBot provides a shortcode checkout, PayPal Standard payment, bank-transfer instructions, and administrator-confirmed access-code delivery. After a verified PayPal payment or administrator confirmation of a bank payment, the customer receives a login code by email and through the configured SMS webhook.

== Installation ==

1. Upload the `assistantbot` folder to `/wp-content/plugins/` or upload the generated ZIP in WordPress.
2. Activate AssistantBot.
3. Open Settings > AssistantBot and configure the verified IBAN, price, download URL, and SMS webhook.
4. Create a page containing `[assistantbot_checkout]`.
5. Create a page with slug `assistantbot-payment` for the payment step.
6. Configure PayPal IPN to `https://YOUR-DOMAIN.example/wp-json/assistantbot/v1/paypal-ipn`.

== Important ==

Bank payments must be checked against the bank statement and confirmed by an administrator. PayPal delivery occurs only after PayPal IPN verification. Configure an HTTPS site, a real SMS provider webhook, and a protected download URL before production use.

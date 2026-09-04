const officialBranding = Object.freeze({
  name: 'AssistantBot',
  logo: '/assets/assistantbot-logo.png'
});

function canCustomizeBranding(subscription) {
  return Number(subscription?.paidMonths) >= 6;
}

function getBranding(subscription) {
  if (!canCustomizeBranding(subscription)) return officialBranding;

  return {
    name: subscription.name || officialBranding.name,
    logo: subscription.logo || officialBranding.logo
  };
}

module.exports = { officialBranding, canCustomizeBranding, getBranding };

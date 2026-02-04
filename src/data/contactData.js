export const contactData = {
  headline: "Let’s connect",
  subline: "Open to full-time roles, internships, and collaborations",

  primaryActions: [
    {
      id: "email",
      label: "Email",
      value: "shaikmusharaf@gmail.com",
      action: "mailto",
      icon: "gmail",
      priority: "primary",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "https://www.linkedin.com/in/skmusharaf01/",
      action: "external",
      icon: "linkedin",
    },
    {
      id: "github",
      label: "GitHub",
      value: "https://github.com/musharraf10",
      action: "external",
      icon: "github",
    },
    {
      id: "phone",
      label: "Call",
      value: "+919182399196",
      action: "tel",
      icon: "phone",
      hideLabel: true,
    },
  ],

  secondaryActions: [
    {
      id: "instagram",
      label: "Instagram",
      value: "https://www.instagram.com/asur.musharaf/",
      action: "external",
      icon: "instagram",
    },
    {
      id: "twitter",
      label: "Twitter / X",
      value: "https://www.linkedin.com/in/skmusharaf01/",
      action: "external",
      icon: "twitter",
    },
  ],

  form: {
    enabled: true,
    title: "Send a message",
    description: "Prefer a direct message? Drop it here.",
  },
};

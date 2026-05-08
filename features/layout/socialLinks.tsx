import type { SVGProps } from "react";

function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      {children}
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M17.53 3h3.15l-6.88 7.87L21.9 21h-6.34l-4.97-6.5L4.9 21H1.75l7.36-8.42L1.35 3h6.5l4.49 5.94L17.53 3Zm-1.1 16.22h1.74L6.9 4.69H5.03l11.4 14.53Z" />
    </IconBase>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M14.2 8.3V6.75c0-.72.48-.89.82-.89h2.09V2.14L14.23 2.13c-3.2 0-3.93 2.4-3.93 3.93V8.3H7.78v3.83h2.52V22h3.9v-9.87h3.32l.16-1.5.25-2.33H14.2Z" />
    </IconBase>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v10.75H3V9.75Zm6.25 0h3.82v1.47h.05c.53-.96 1.84-1.97 3.78-1.97 4.04 0 4.79 2.66 4.79 6.12v5.13h-4v-4.55c0-1.09-.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.41v4.63h-4V9.75Z" />
    </IconBase>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5-2.75a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
    </IconBase>
  );
}

function ThreadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12.08 2C6.5 2 3 5.95 3 12.08 3 18.1 6.42 22 11.7 22c4.48 0 7.4-2.42 7.4-6.08 0-2.63-1.48-4.42-4.16-5.08-.12-.27-.26-.54-.42-.8-.83-1.35-2.2-2.06-3.98-2.06-2.16 0-3.77 1.02-4.54 2.87l1.9.78c.43-1.03 1.34-1.62 2.54-1.62 1.08 0 1.84.4 2.3 1.19-3.2.05-5.08 1.27-5.08 3.33 0 1.78 1.42 3.08 3.38 3.08 2.06 0 3.62-1.07 4.2-2.83.08-.25.14-.5.18-.75 1.1.48 1.67 1.44 1.67 2.76 0 2.45-2.08 4.03-5.3 4.03-4.03 0-6.57-3.13-6.57-8.03 0-4.94 2.6-8.13 6.86-8.13 3.1 0 5.4 1.6 6.5 4.53l1.96-.73C19.14 4.75 16.14 2 12.08 2Zm1.35 11.63c-.22 1.23-1.05 1.98-2.22 1.98-.86 0-1.45-.45-1.45-1.1 0-.91 1.15-1.38 3.37-1.38h.36c-.01.17-.03.34-.06.5Z" />
    </IconBase>
  );
}

export const socialLinks = [
  { label: "X", href: "https://x.com/", Icon: XIcon },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/CodeMark/100092354044797",
    Icon: FacebookIcon,
  },
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: InstagramIcon,
  },
  { label: "Threads", href: "https://www.threads.net/", Icon: ThreadsIcon },
] as const;

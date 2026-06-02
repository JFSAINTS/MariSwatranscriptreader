import { Github, Mail, Linkedin, Twitter } from 'lucide-react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color?: string;
}

export function SocialLinks() {
  const links: SocialLink[] = [
    {
      icon: <Github className="h-5 w-5" />,
      href: 'https://github.com/JFSAINTS',
      label: 'GitHub',
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: 'https://twitter.com',
      label: 'Twitter',
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: 'mailto:jfsaints@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-4">
      {links.map(({ icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-accent/20 transition-colors duration-200 text-muted-foreground hover:text-foreground"
          title={label}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

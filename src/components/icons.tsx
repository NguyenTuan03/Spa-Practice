import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(children: ReactNode, props: IconProps): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SparklesIcon(props: IconProps): ReactNode {
  return base(
    <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.95-6.95-2.12 2.12M8.17 15.83l-2.12 2.12m0-11.9 2.12 2.12m9.66 9.66-2.12-2.12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
    props,
  );
}

export function ImageIcon(props: IconProps): ReactNode {
  return base(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5L17 11l3 3" />
    </>,
    props,
  );
}

export function CheckCircleIcon(props: IconProps): ReactNode {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L15.5 9.5" />
    </>,
    props,
  );
}

export function AlertTriangleIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="M10.3 3.9 1.9 18a1.8 1.8 0 0 0 1.55 2.7h17.1A1.8 1.8 0 0 0 22.1 18L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4.25" />
      <path d="M12 17h.01" />
    </>,
    props,
  );
}

export function ListChecksIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="m3.5 6.5 1.5 1.5 2.5-2.5" />
      <path d="m3.5 13.5 1.5 1.5 2.5-2.5" />
      <path d="M11 7h9.5" />
      <path d="M11 14h9.5" />
      <path d="M11 20.5h9.5" />
      <path d="m3.5 19.5 1.5 1.5 2.5-2.5" />
    </>,
    props,
  );
}

export function FlaskIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v6.2L4.8 18a1.5 1.5 0 0 0 1.3 2.3h11.8a1.5 1.5 0 0 0 1.3-2.3L13.5 9.2V3" />
      <path d="M7.5 15h9" />
    </>,
    props,
  );
}

export function TrashIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="M4.5 6.5h15" />
      <path d="M9 6.5V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12.5" />
      <path d="M10.2 10.5v6.3M13.8 10.5v6.3" />
    </>,
    props,
  );
}

export function UploadIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="M12 15.5V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </>,
    props,
  );
}

export function ChevronDownIcon(props: IconProps): ReactNode {
  return base(<path d="m6 9 6 6 6-6" />, props);
}

export function BookIcon(props: IconProps): ReactNode {
  return base(
    <>
      <path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H19a1 1 0 0 1 1 1v15.3a.7.7 0 0 1-.7.7H6.5A2.5 2.5 0 0 0 4 22.5V5.2Z" />
      <path d="M4 17.2A2.2 2.2 0 0 1 6.2 15H20" />
    </>,
    props,
  );
}

export function SpinnerIcon(props: IconProps): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

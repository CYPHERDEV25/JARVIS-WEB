import Link from "next/link";

interface StatsCardProps {
  title: string;
  value?: string;
  subtitle?: string;
  progress?: number;
  badge?: string;
  isStatus?: boolean;
  isPlan?: boolean;
  linkText?: string;
  linkHref?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  progress,
  badge,
  isStatus,
  isPlan,
  linkText,
  linkHref,
}: StatsCardProps) {
  return (
    <div className="card flex flex-col justify-between">
      <h3 className="text-sm font-medium text-[#A1A1AA] mb-4">{title}</h3>
      
      <div>
        {value && <div className="text-3xl font-bold text-white mb-1">{value}</div>}
        
        {badge && (
          <div className="mb-2">
            <span className={badge === "ACTIVE" ? "badge-active" : "badge-inactive"}>
              {badge}
            </span>
          </div>
        )}

        {subtitle && <div className="text-sm text-[#A1A1AA]">{subtitle}</div>}
      </div>

      {progress !== undefined && (
        <div className="mt-4 w-full bg-[#27272A] rounded-full h-1.5">
          <div
            className="bg-[#6366F1] h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {isPlan && linkText && linkHref && (
        <div className="mt-4">
          <Link href={linkHref} className="text-sm text-[#6366F1] hover:text-[#818cf8] font-medium transition-colors">
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
}

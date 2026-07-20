type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
}: Props) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <div
          className={`flex items-center gap-3 mb-3 ${
            center ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-gold-500/50" />
          <span className="font-display text-xs tracking-[0.3em] text-gold-400 uppercase">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gold-500/50" />
        </div>
      )}
      <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

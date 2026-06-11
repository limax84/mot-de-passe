export default function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div
      className={`panel inline-flex flex-col items-center ${
        isLg ? "px-10 py-7 gap-3" : "px-5 py-3 gap-1.5"
      }`}
      style={{ borderRadius: isLg ? "1.75rem" : "1rem" }}
    >
      <div
        className={`font-display leading-none text-center ${
          isLg ? "text-5xl sm:text-6xl" : "text-2xl"
        }`}
      >
        <span className="block text-ink drop-shadow-[0_0_18px_rgba(65,214,255,0.55)]">
          MOT&nbsp;DE
        </span>
        <span className="block gold-shine">PASSE</span>
      </div>
      <span className={`dots ${isLg ? "text-xl" : "text-[0.6rem]"}`} aria-hidden>
        <i /><i /><i /><i /><i /><i />
      </span>
    </div>
  );
}

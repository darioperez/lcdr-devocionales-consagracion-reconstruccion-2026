import { getPlan } from "@/lib/plans";

interface EndedMessageProps {
  overline?: string;
  heading?: string;
}

export default function EndedMessage({
  overline = "El plan ha terminado",
  heading,
}: EndedMessageProps) {
  const plan = getPlan();

  return (
    <section className="flex flex-col items-center text-center">
      <p className="rounded-full border border-line bg-cream px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-clay-deep uppercase">
        {overline}
      </p>
      <h1
        tabIndex={-1}
        className="mt-6 font-display text-4xl font-semibold tracking-tight text-balance outline-none sm:text-5xl"
      >
        {heading ?? plan.config.titulo}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
        Gracias por acompañarnos en esta semana de consagración. Muy pronto
        habrá una nueva actividad para hombres: ¡mantente atento!
      </p>
      <p className="mt-6 font-display text-base text-ink/80 italic">
        Primero de rodillas, luego las manos a la obra.
      </p>
    </section>
  );
}

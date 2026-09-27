import ViewLink from "@/components/view-link";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-28 text-center">
      <p className="font-display text-7xl font-semibold text-clay">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        Este día aún no está disponible
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-smoke">
        Cada devocional se desbloquea en la mañana de su fecha. Vuelve entonces,
        o repasa los días anteriores.
      </p>
      <ViewLink
        href="/dias"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-clay px-6 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Ver los 5 días
      </ViewLink>
    </div>
  );
}

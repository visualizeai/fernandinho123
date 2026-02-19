import React, { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  Globe,
  Layers3,
  Mail,
  Sparkles,
  Zap
} from "lucide-react";

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bullets: string[];
};

type Project = {
  title: string;
  tag: string;
  description: string;
  image: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useReducedMotionPref() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12]);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 18, mass: 0.6 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, springX, springY, onMove, onLeave };
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-10 md:mb-14">
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-200 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-neon-400" />
            <span>{eyebrow}</span>
          </div>
        ) : null}
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Reveal({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-white via-neon-400 to-white bg-[length:200%_200%] bg-clip-text text-transparent animate-shimmer">
      {children}
    </span>
  );
}

function Typewriter({
  text,
  className
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotionPref();
  const letters = useMemo(() => text.split(""), [text]);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-flex", className)} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      <motion.span
        aria-hidden="true"
        className="ml-1 inline-block h-[1.05em] w-[2px] rounded-full bg-neon-400/80 align-[-0.15em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}

function BackgroundFX({
  mouseX,
  mouseY
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const reduced = useReducedMotionPref();
  const x = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.6 });

  const bg = useTransform([x, y], ([lx, ly]) => {
    const px = Math.round(lx);
    const py = Math.round(ly);
    return `radial-gradient(700px 420px at ${px}px ${py}px, rgba(124,92,255,0.22), rgba(124,92,255,0.08) 35%, rgba(0,0,0,0) 70%)`;
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-neon-500/10 via-transparent to-transparent" />
      {!reduced ? (
        <motion.div className="absolute inset-0" style={{ backgroundImage: bg }} />
      ) : (
        <div className="absolute inset-0 [background-image:radial-gradient(700px_420px_at_50%_20%,rgba(124,92,255,0.18),rgba(0,0,0,0)_70%)]" />
      )}
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-neon-500/10 blur-3xl" />
      <div className="absolute -right-24 top-64 h-72 w-72 rounded-full bg-neon-500/10 blur-3xl" />
    </div>
  );
}

function GlassCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.06] shadow-sm backdrop-blur-xl",
        "transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

function Navbar() {
  const links = [
    { label: "Serviços", href: "#servicos" },
    { label: "Portfólio", href: "#portfolio" },
    { label: "Contato", href: "#contato" }
  ];

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-sm backdrop-blur-xl md:px-5">
          <a href="#" className="group inline-flex items-center gap-2">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 shadow-sm">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-500/25 to-transparent" />
              <Zap className="relative h-5 w-5 text-neon-400 transition-transform duration-200 group-hover:rotate-12" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-white">Heronfy</div>
              <div className="text-[11px] font-medium text-zinc-300">Marketing de vanguarda</div>
            </div>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contato"
              className="ml-2 inline-flex items-center gap-2 rounded-xl bg-neon-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-neon-400 hover:shadow-glowStrong"
            >
              Falar com a Heronfy
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <a
            href="#contato"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 md:hidden"
          >
            Contato
            <ChevronRight className="h-4 w-4 text-neon-400" />
          </a>
        </div>
      </div>
    </div>
  );
}

function InfiniteLogos() {
  const logos = [
    "Astra",
    "NeonWorks",
    "Orbit",
    "Pulse",
    "Kinetik",
    "Nova",
    "Vertex",
    "Helio",
    "Quanta",
    "Lumen"
  ];

  const row = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

      <motion.div
        className="flex items-center gap-6 py-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        style={{ width: "200%" }}
      >
        {row.map((name, idx) => (
          <div
            key={`${name}-${idx}`}
            className="flex w-[220px] shrink-0 items-center justify-center"
          >
            <div className="group relative w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-center shadow-sm transition-all duration-200 hover:border-neon-400/40 hover:bg-white/[0.07]">
              <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 [background-image:radial-gradient(120px_60px_at_50%_0%,rgba(124,92,255,0.35),transparent_70%)]" />
              <div className="relative text-sm font-semibold tracking-wide text-zinc-200">
                {name}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ServiceCard({ s, index }: { s: Service; index: number }) {
  const { ref, springX, springY, onMove, onLeave } = useTilt();

  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-neon-400/40 hover:shadow-glow md:p-7">
          <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 [background-image:radial-gradient(420px_220px_at_20%_0%,rgba(124,92,255,0.35),transparent_60%)]" />
          <div className="relative" style={{ transform: "translateZ(18px)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-sm">
                <div className="text-neon-400">{s.icon}</div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
                <BadgeCheck className="h-4 w-4 text-neon-400" />
                <span>Alta conversão</span>
              </div>
            </div>

            <h3 className="mt-5 text-lg font-bold tracking-tight text-white md:text-xl">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {s.description}
            </p>

            <ul className="mt-5 space-y-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-zinc-200">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-neon-400/90" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Ver detalhes
              <ArrowRight className="h-4 w-4 text-neon-400 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

function PortfolioCard({ p, index }: { p: Project; index: number }) {
  return (
    <Reveal delay={index * 0.05}>
      <a
        href="#contato"
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-neon-400/40 hover:shadow-glow"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover opacity-90 transition-all duration-200 group-hover:scale-[1.03] group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-100 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-400" />
            {p.tag}
          </div>
        </div>
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white md:text-xl">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {p.description}
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <ArrowRight className="h-4 w-4 text-neon-400 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

function ContactCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-sm backdrop-blur-xl md:p-8">
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(520px_260px_at_20%_0%,rgba(124,92,255,0.35),transparent_60%)]" />
      <div className="relative grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
            <Mail className="h-4 w-4 text-neon-400" />
            <span>Resposta em até 24h</span>
          </div>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Pronto para lançar sua próxima fase?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
            Conte para a Heronfy o que você quer dominar: aquisição, retenção ou
            posicionamento. A gente desenha a estratégia e executa com precisão.
          </p>
        </div>

        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const name = String(data.get("name") || "");
            const email = String(data.get("email") || "");
            const message = String(data.get("message") || "");
            const subject = encodeURIComponent("Contato — Heronfy");
            const body = encodeURIComponent(
              `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
            );
            window.location.href = `mailto:hello@heronfy.com?subject=${subject}&body=${body}`;
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-zinc-200">Nome</label>
              <input
                name="name"
                required
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-neon-400/60 focus:ring-2 focus:ring-neon-500/20"
                placeholder="Seu nome"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-zinc-200">Email</label>
              <input
                name="email"
                type="email"
                required
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-neon-400/60 focus:ring-2 focus:ring-neon-500/20"
                placeholder="voce@empresa.com"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-zinc-200">Mensagem</label>
            <textarea
              name="message"
              required
              rows={4}
              className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-neon-400/60 focus:ring-2 focus:ring-neon-500/20"
              placeholder="Conte rapidamente sobre seu objetivo e prazo."
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neon-500 px-4 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-neon-400 hover:shadow-glowStrong"
          >
            Enviar
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-zinc-400">
            Ao enviar, você abre seu app de email com a mensagem pronta.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  return (
    <div
      className="relative min-h-screen bg-zinc-950 text-zinc-50"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      <BackgroundFX mouseX={mouseX} mouseY={mouseY} />
      <Navbar />

      <main className="relative">
        <header className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 md:px-6 md:pb-16 md:pt-32">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-zinc-200 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-400" />
                <span>Estratégia + Criativo + Performance</span>
              </div>

              <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                <Typewriter text="Marketing que parece o futuro." className="leading-[1.05]" />
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
                A Heronfy cria sistemas de crescimento com estética futurista e execução
                cirúrgica: posicionamento, campanhas e experiências digitais que convertem.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contato"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neon-500 px-5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-neon-400 hover:shadow-glowStrong"
                >
                  Solicitar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#portfolio"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all duration-200 hover:bg-white/10"
                >
                  Ver cases
                  <ChevronRight className="h-4 w-4 text-neon-400" />
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 md:max-w-xl md:grid-cols-3">
                {[
                  { k: "+3.2x", v: "ROAS médio" },
                  { k: "12–21d", v: "tempo de lançamento" },
                  { k: "Full-funnel", v: "da atenção à compra" }
                ].map((m) => (
                  <div
                    key={m.v}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-sm backdrop-blur transition-all duration-200 hover:border-neon-400/30"
                  >
                    <div className="text-lg font-extrabold tracking-tight text-white">
                      <GradientText>{m.k}</GradientText>
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-300">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-neon-500/25 via-transparent to-transparent blur-2xl" />
              <GlassCard className="relative overflow-hidden p-6 md:p-8">
                <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(520px_260px_at_80%_0%,rgba(124,92,255,0.35),transparent_60%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
                      <BrainCircuit className="h-4 w-4 text-neon-400" />
                      <span>Growth Engine</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-400">v2.7</div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {[
                      {
                        icon: <BarChart3 className="h-5 w-5" />,
                        title: "Performance com estética",
                        desc: "Criativos que parecem arte, mas entregam números."
                      },
                      {
                        icon: <Layers3 className="h-5 w-5" />,
                        title: "Sistemas, não campanhas",
                        desc: "Estrutura modular para escalar sem perder consistência."
                      },
                      {
                        icon: <Globe className="h-5 w-5" />,
                        title: "Experiências digitais",
                        desc: "Landing pages e funis com UX premium e velocidade."
                      }
                    ].map((it) => (
                      <div
                        key={it.title}
                        className="group rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all duration-200 hover:border-neon-400/35 hover:bg-white/[0.07]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-neon-400">
                            {it.icon}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{it.title}</div>
                            <div className="mt-1 text-sm leading-relaxed text-zinc-300">
                              {it.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-zinc-300">
                        Sinal de mercado
                      </div>
                      <div className="text-xs font-semibold text-neon-400">ALTO</div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full w-2/3 rounded-full bg-gradient-to-r from-neon-500 to-neon-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "66%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="mt-3 text-xs text-zinc-400">
                      Otimizamos criativo + mídia + página para reduzir CAC e aumentar LTV.
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </header>

        <Section
          id="prova-social"
          eyebrow="Prova social"
          title="Marcas que aceleram com a Heronfy"
          description="De startups a squads internos: entregamos clareza estratégica e execução com padrão premium."
        >
          <Reveal>
            <InfiniteLogos />
          </Reveal>
        </Section>

        <Section
          id="servicos"
          eyebrow="Serviços"
          title="Um stack completo para dominar atenção e conversão"
          description="Do conceito ao lançamento: criamos, testamos e escalamos com consistência visual e performance."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(
              [
                {
                  title: "Brand & Positioning",
                  description:
                    "Narrativa, identidade e sistema visual com presença futurista e coerência em todos os canais.",
                  icon: <Sparkles className="h-5 w-5" />,
                  bullets: ["Arquitetura de marca", "Direção de arte", "Guidelines e kit de assets"]
                },
                {
                  title: "Performance Creative",
                  description:
                    "Criativos orientados a dados com linguagem premium: hooks, motion e variações para escala.",
                  icon: <Zap className="h-5 w-5" />,
                  bullets: ["Ads para Meta/Google", "Testes A/B", "Biblioteca de criativos"]
                },
                {
                  title: "Landing Pages & Funnels",
                  description:
                    "Experiências rápidas, responsivas e persuasivas com UX de alto padrão e copy afiada.",
                  icon: <Layers3 className="h-5 w-5" />,
                  bullets: ["Design + desenvolvimento", "Otimização de conversão", "Instrumentação"]
                },
                {
                  title: "Growth Strategy",
                  description:
                    "Plano de crescimento com foco em aquisição, retenção e expansão — com métricas claras.",
                  icon: <BrainCircuit className="h-5 w-5" />,
                  bullets: ["Pesquisa e insights", "Roadmap trimestral", "Rituais e playbooks"]
                },
                {
                  title: "Analytics & Insights",
                  description:
                    "Dashboards e leitura de funil para decisões rápidas: do clique ao LTV.",
                  icon: <BarChart3 className="h-5 w-5" />,
                  bullets: ["KPIs e eventos", "Cohorts e atribuição", "Relatórios executivos"]
                },
                {
                  title: "Global Launch",
                  description:
                    "Go-to-market para múltiplos idiomas e regiões com consistência e velocidade.",
                  icon: <Globe className="h-5 w-5" />,
                  bullets: ["Localização", "Estratégia por canal", "Operação de lançamento"]
                }
              ] as Service[]
            ).map((s, i) => (
              <ServiceCard key={s.title} s={s} index={i} />
            ))}
          </div>
        </Section>

        <Section
          id="portfolio"
          eyebrow="Portfólio"
          title="Cases com estética neon e resultado real"
          description="Uma seleção de projetos com foco em conversão, velocidade e consistência visual."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(
              [
                {
                  title: "Neon Commerce Sprint",
                  tag: "E-commerce",
                  description:
                    "Landing + criativos modulares para escalar campanhas e reduzir CAC em 28%.",
                  image:
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80"
                },
                {
                  title: "SaaS Launch System",
                  tag: "SaaS",
                  description:
                    "Reposicionamento e funil full-funnel com aumento de 3.1x em trials qualificados.",
                  image:
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80"
                },
                {
                  title: "Creator Brand Engine",
                  tag: "Infoproduto",
                  description:
                    "Identidade + páginas de venda com UX premium e taxa de conversão acima de 6%.",
                  image:
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80"
                },
                {
                  title: "B2B Demand Gen",
                  tag: "B2B",
                  description:
                    "Estratégia e criativos para pipeline: +42% em MQLs com qualidade superior.",
                  image:
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
                },
                {
                  title: "Mobile App Growth",
                  tag: "App",
                  description:
                    "Sistema de anúncios e páginas para aquisição: ROAS consistente e retenção melhorada.",
                  image:
                    "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=80"
                },
                {
                  title: "Web3 Community Launch",
                  tag: "Comunidade",
                  description:
                    "Narrativa e experiência de lançamento com estética glass e engajamento orgânico.",
                  image:
                    "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1400&q=80"
                }
              ] as Project[]
            ).map((p, i) => (
              <PortfolioCard key={p.title} p={p} index={i} />
            ))}
          </div>
        </Section>

        <Section
          id="contato"
          eyebrow="CTA"
          title="Vamos construir sua próxima vantagem competitiva"
          description="Envie uma mensagem e receba um diagnóstico inicial com oportunidades de crescimento e um plano de execução."
        >
          <Reveal>
            <ContactCTA />
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Entrega rápida",
                desc: "Sprints de 12–21 dias com checkpoints e transparência.",
                icon: <Zap className="h-5 w-5" />
              },
              {
                title: "Padrão premium",
                desc: "UI/UX futurista com foco em legibilidade e conversão.",
                icon: <Sparkles className="h-5 w-5" />
              },
              {
                title: "Orientado a dados",
                desc: "Testes, instrumentação e otimização contínua.",
                icon: <BarChart3 className="h-5 w-5" />
              }
            ].map((it, i) => (
              <Reveal key={it.title} delay={i * 0.06}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-sm backdrop-blur transition-all duration-200 hover:border-neon-400/30 hover:bg-white/[0.07]">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-neon-400">
                    {it.icon}
                  </div>
                  <div className="mt-4 text-base font-bold text-white">{it.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-300">{it.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <footer className="relative mx-auto w-full max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <Zap className="h-5 w-5 text-neon-400" />
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-wide text-white">Heronfy</div>
                <div className="text-xs text-zinc-400">
                  © {new Date().getFullYear()} — Marketing de vanguarda
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Serviços", href: "#servicos" },
                { label: "Portfólio", href: "#portfolio" },
                { label: "Contato", href: "#contato" }
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contato"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-neon-400" />
                hello@heronfy.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
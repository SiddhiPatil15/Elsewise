import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MarginAnnotationDemo } from '../components/analysis/MarginAnnotationDemo'
import { Button } from '../components/ui/Button'

const steps = [
  { n: '01', title: 'State your decision', body: 'Whatever you\'re weighing — a purchase, a career move, a plan, a relationship.' },
  { n: '02', title: 'It reads your reasoning', body: 'Not just the decision — what\'s supporting it, and what\'s quietly assumed.' },
  { n: '03', title: 'You get a second opinion', body: 'Counterarguments, blind spots, and questions worth answering before you act.' },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-petal-300/60 bg-petal-50 px-4 py-1.5  "
        >
          <span className="font-display text-sm font-semibold text-petal-600 ">)(</span>
          <span className="text-xs font-medium tracking-wide text-mauve-500 ">Elsewise</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance font-display text-4xl leading-[1.15] text-warm-800 sm:text-6xl "
        >
          You already have{' '}
          <span className="gradient-text-rose">an answer.</span>
          <br />
          Find out what you're missing.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-lg text-lg leading-relaxed text-mauve-500 "
        >
          AI that challenges your thinking instead of simply agreeing with you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button onClick={() => navigate('/new')}>Get My Second Opinion →</Button>
          <a href="#how-it-works">
            <Button variant="ghost">See how it works</Button>
          </a>
        </motion.div>
      </section>

      {/* Live demonstration */}
      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <MarginAnnotationDemo />
        </motion.div>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => navigate('/results/demo-internship')}
            className="text-sm text-mauve-400 underline decoration-petal-400/40 underline-offset-4 transition-colors hover:text-petal-600 dark:text-petal-300"
          >
            Try an Example — see the full analysis →
          </button>
        </div>
      </section>

      {/* What this is not */}
      <section className="border-y border-pink-200/50 bg-gradient-to-r from-blush-100/60 via-mauve-100/30 to-lavender-200/30 py-16 sm:py-20    ">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="font-display text-2xl leading-relaxed text-warm-800 sm:text-[28px] ">
            Most AI tools give you an answer.
            <br />
            <span className="gradient-text-rose">Elsewise examines the answer you already have.</span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-petal-400 ">
          How it works
        </p>
        <h2 className="mb-12 font-display text-3xl text-warm-800 ">Three steps, no account required</h2>
        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <span className="mb-3 block font-display text-3xl font-bold gradient-text">{s.n}</span>
              <h3 className="mb-2 font-display text-lg text-warm-800 ">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-mauve-500 ">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="glass-card rounded-3xl p-8 text-center sm:p-12 bg-gradient-to-br from-blush-50 to-lavender-200/20  ">
          <div className="mb-4 flex justify-center">
            <span className="font-display text-4xl font-bold text-petal-500/40  select-none">)(</span>
          </div>
          <h2 className="mb-3 font-display text-2xl text-warm-800 sm:text-3xl ">
            Bring it something you're uncertain about.
          </h2>
          <p className="mx-auto mb-7 max-w-md text-[15px] text-mauve-500 ">
            No account needed for your first opinion. Already using another AI tool?{' '}
            <Link to="/compare" className="text-petal-600 underline decoration-petal-400/40 underline-offset-4 ">
              Compare two AI opinions instead
            </Link>
            .
          </p>
          <Button onClick={() => navigate('/new')}>Get My Second Opinion →</Button>
        </div>
      </section>
    </div>
  )
}

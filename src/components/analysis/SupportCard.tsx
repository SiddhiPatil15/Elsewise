import { motion } from 'framer-motion'

export function SupportCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg border border-moss-600/25 bg-moss-500/[0.06] p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-moss-600 ">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-moss-500" />
        What supports your thinking
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="text-[15px] leading-relaxed text-ink-700 "
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

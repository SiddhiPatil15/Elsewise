import { motion } from 'framer-motion'
import { PerspectiveFlip } from '../components/think-lab/PerspectiveFlip'
import { BlindSpotGallery } from '../components/think-lab/BlindSpotGallery'
import { RethinkThis } from '../components/think-lab/RethinkThis'
import { ImagineIf } from '../components/think-lab/ImagineIf'
import { TwoSides } from '../components/think-lab/TwoSides'
import { OneMinuteThought } from '../components/think-lab/OneMinuteThought'

export function ThinkLab() {
  return (
    <div className="min-h-screen py-16 px-5 sm:px-8 bg-gradient-to-b from-transparent to-blush-50/30">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 font-bold tracking-tight mb-6">
            THINK LAB
          </h1>
          <p className="text-xl md:text-2xl text-mauve-600 font-medium italic max-w-2xl mx-auto">
            “Ideas that make you pause, question, and see differently.”
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-12"
        >
          {/* Top row: Flip and Blind Spots */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <PerspectiveFlip />
            </div>
            <div className="lg:col-span-7">
              <BlindSpotGallery />
            </div>
          </div>

          <ImagineIf />
          <RethinkThis />
          <TwoSides />
          <OneMinuteThought />
          
        </motion.div>
      </div>
    </div>
  )
}

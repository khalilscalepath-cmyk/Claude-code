import { ArrowRight } from 'lucide-react';

const ROWS = [
  { n: '01', label: 'Conversational' },
  { n: '02', label: 'Connected' },
  { n: '03', label: 'Compliant' },
];

export default function InfoPanel() {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-6">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium">
              What do we do?
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]">
              Conversations that
              <br className="hidden sm:block" />{' '}
              build momentum
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm md:text-[15px] text-[#191919]/70 leading-relaxed">
              Conversational AI built for regulated financial institutions. Agents that hold a real
              conversation, plug into the systems you run, and show their work.
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full" />

        {/* pb-0 on the card: the rows run flush to the bottom edge, so the
            panel reads as continuing below the fold rather than ending. */}
        <div className="grid sm:grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8 pb-0">
          {ROWS.map((r) => (
            <div
              key={r.n}
              className="group flex items-center justify-between bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4"
            >
              <span className="text-sm text-[#191919]">
                <span className="text-[#191919]/40">{r.n}</span>
                <span className="mx-2 text-[#191919]/30">/</span>
                <span className="font-medium">{r.label}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

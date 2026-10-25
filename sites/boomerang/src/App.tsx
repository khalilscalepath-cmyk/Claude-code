import BoomerangVideoBg from './components/BoomerangVideoBg';
import Navbar from './components/Navbar';
import InfoPanel from './components/InfoPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <section className="relative flex flex-col items-center overflow-hidden h-screen">
        <BoomerangVideoBg />

        <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal">
            Build lasting
            <br />
            relationships.
          </h1>

          <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed">
            Conversational AI platform for modern financial institutions — agents that handle the
            full borrower lifecycle across email, SMS, and voice.
          </p>

          <a
            href="#demo"
            className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200"
          >
            Book A Demo
          </a>
        </div>

        <div className="relative z-10 mt-auto w-full flex justify-center">
          <InfoPanel />
        </div>
      </section>
    </div>
  );
}

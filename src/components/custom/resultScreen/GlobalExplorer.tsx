const GlobalExplorer = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-64 px-10 py-12 bg-black min-h-screen">
      <div className="p-[0.5px] rounded-[30px] shrink-0 w-95 bg-[radial-gradient(337.8%_74.4%_at_50%_0%,rgba(222,219,0,0.4)_0%,rgba(92,225,230,0.4)_62.98%,rgba(92,225,230,0.08)_100%)]">
        <div className="flex flex-col items-center text-center w-full rounded-[29.5px] px-6 py-10 bg-[linear-gradient(145deg,#1a1a1a_0%,#0d0d0d_60%,#1c1f0a_100%)]">
          <h2 className="text-white text-lg font-Unbounded tracking-wide m-0 mb-1">
            You are
          </h2>
          <span className="block font-Unbounded leading-tight mb-5 text-[32px] text-[#DEDB00]">
            The Global Explorer
          </span>
          <p className="font-montserrat leading-relaxed m-0 text-sm max-w-75 text-[#c8c8c8]">
            You value global exposure, flexibility, and real-world learning.
            You're ready to go beyond boundaries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalExplorer;
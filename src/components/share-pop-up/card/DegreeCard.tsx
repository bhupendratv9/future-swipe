
type DegreeCardProps = {
  duration: string;
  degree: string;
  bg: string;
};

const DegreeCard = ({ duration, degree, bg }: DegreeCardProps) => {
  return (
    <div
  className={`
    relative min-w-83 h-17.75 rounded-3xl p-4 text-white ${bg}
    flex flex-col justify-end overflow-hidden ml-2

    backdrop-blur-xl

    before:absolute before:inset-0 before:rounded-2xl
    before:border-t before:border-l before:border-white/20
    before:content-['']

    after:absolute after:inset-0 after:rounded-2xl
    after:border-b after:border-r after:border-white/20
    after:content-['']
  `}
>
     
      {/* <div >
        <GradientAnimatedButton
          buttonText={"95% Match"}
          className="w-fit"
          textClassName="text-[11px] px-3 py-[2px]"
          textGradient="linear-gradient(103.25deg, #757404 33.14%, #1483BF 111.12%)"
        />
      </div> */}

    
      <p className="text-[12px] text-[#FFFFFF] font-montserrat relative top-2">
        {duration}
      </p>
        <div className="relative top-3">
            <h2 className="text-[16px] font-unbounded text-[#DEDB00] mb-3 leading-4.5 ">
        {degree}
      </h2>
        </div>
    </div>
  );
};

export default DegreeCard;
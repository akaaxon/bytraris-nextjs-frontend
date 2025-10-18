import Image from "next/image";

const FeaturesSection = () => {
  const features = [
    {
      title: "Fast Deployment",
      description: "Get your solutions up and running quickly with minimal setup.",
    },
    {
      title: "Secure & Reliable",
      description: "We prioritize your security and data protection at every step.",
    },
    {
      title: "AI-Powered",
      description: "Leverage state-of-the-art AI models to boost your business.",
    },
  ];

  return (
    <section className="relative snap-start h-screen w-full overflow-hidden">
      {/* Full-cover background image with dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden">
        <Image
          src="/darktrail.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center px-4 md:px-20 py-8 md:py-16 text-center">
        <div className="flex flex-col md:flex-row justify-center items-stretch w-full gap-4 md:gap-8 px-1">
          {features.map(({ title, description }, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between items-center text-center 
                         md:w-1/3 w-full max-w-xs mx-auto bg-black/40 
                         p-4 md:p-6 rounded-lg h-full"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 leading-tight">
                {title}
              </h1>
              <p className="text-sm font-bold sm:text-base text-neutral-300 mt-2 md:mt-3">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import SectionScroller from "../../components/AnimatedScroller";
import Navbar from "../../components/Navbar";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <div className="relative snap-start h-screen w-full overflow-hidden">
      <Navbar />
      <SectionScroller sections={[
        // E-commerce Solutions
        <section key="ecomSec" className="flex flex-col md:flex-row items-center min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              E-commerce Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Robust and scalable online store solutions tailored to your product and customer base.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/ecommerce.jpg"
              alt="E-commerce Solutions"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              priority
            />
          </div>
        </section>,

        // Finance Solutions
        <section key="financeSec" className="flex flex-col md:flex-row-reverse items-center  min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              Finance Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Secure and efficient financial software to manage transactions, reports, and analytics.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/financeIMG.jpg"
              alt="Finance Solutions"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>,

        // AI Solutions
        <section key="AISec" className="flex flex-col md:flex-row items-center min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              AI Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              We build smart AI voice and text assistants that provide instant, helpful responses.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/AIService.jpg"
              alt="AI Solutions"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>,

        // Booking Systems
        <section key="bookingSec" className="flex flex-col md:flex-row-reverse items-center  min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              Booking Systems
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Streamline your booking process with intuitive and customizable scheduling tools.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/bookingSystem.jpg"
              alt="Booking Systems"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>,

        // CMS Solutions
        <section key="CMSSec" className="flex flex-col md:flex-row items-center  min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              CMS Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Easily manage and publish your website content with powerful CMS platforms.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/CMS.jpg"
              alt="CMS Solutions"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>,

        // Custom Software Development
        <section key="softwareSec" className="flex flex-col md:flex-row-reverse items-center  min-h-screen w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="md:w-1/2 w-full space-y-8 text-center md:text-left px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">
              Custom Software
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Tailored software solutions designed specifically to meet your unique business needs.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center mt-12 md:mt-0">
            <Image
              src="/customSoftwareIMG.jpg"
              alt="Custom Software Development"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>,
      ]} />
    </div>
  );
}
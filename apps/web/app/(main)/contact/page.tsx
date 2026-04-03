import industrial from "@/assets/industrial.png";
import { ContactCard, ContactForm, SplitSection } from "@/components";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Page() {
  return (
    <main>
      <div className="mt-24 w-[85%] mx-auto mb-12">
        <h1 className="md:text-6xl text-3xl leading-relaxed">
          Let’s Power Your Production
        </h1>
        <p className="md:text-base text-sm text-gray-500 w-3/4 mb-8 text-justify">
          Packtok committed to delivering high-performance corrugated and
          packaging machine solution, whether you need advanced machinery,
          quality raw materials, or reliable spare parts. Our team is here to
          assist with product inquiries, custom quotes, technical support, and
          order tracking—anytime you need it.
        </p>

        <SplitSection
          image={industrial}
          title="About Us"
          description="We specialize in corrugated and packaging machinery, raw materials, and spare parts—providing high-quality, reliable solutions for manufacturers and businesses. Since 35 years, we've been committed to delivering performance, precision, and dependable support to keep your operations running at their best."
        />

        <div className="md:mt-8 mt-32">
          <h1 className="md:text-5xl text-2xl text-center md:my-8 my-4">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ContactCard
              icon={<MapPin />}
              title="Dubai Office"
              content={
                "Packtok F.Z.E\nFree Zone, Ajman\nUnited Arab Emirates\nPER No. 169423\nP.O. Box: 932"
              }
            />
            <ContactCard
              icon={<MapPin />}
              title="India Office"
              content={
                "Packtok Machinery Pvt Ltd\nPlot No. 43, Sector 59, HSIIDC\nFaridabad, Ballabgarh\nHaryana 121004"
              }
            />
            <ContactCard
              icon={<Phone />}
              title="Contact Us"
              content={"+971 508 973 241"}
              content2={"+91 987 364 0291"}
            />
            <ContactCard
              icon={<Mail />}
              title="Email"
              content={"packtok01@gmail.com"}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Map Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg h-[250px] md:h-[400px] flex gap-4 flex-col items-center justify-center">
              <div className="relative w-full h-full  rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d449261.7365287328!2d77.01623168527114!3d28.393377218791766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPacktok%20Machinery%20Pvt%20Ltd%20Plot%20No.%2043%2C%20Sector%2059%20HSIIDC%20%2C%20FARIDABAD%20Ballabaghar%2C%20Haryana.%20121004!5e0!3m2!1sen!2sin!4v1760340750757!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <p className="pb-4 font-semibold text-[1.2rem]">India</p>
            </div>

            <div className="bg-muted rounded-lg h-[250px] md:h-[400px] flex gap-4 flex-col items-center justify-center">
              <div className="relative w-full h-full   rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d14415.779737858235!2d55.44319166185102!3d25.40665377010251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sFREE%20ZONE%20AJMAN%2C%20UNITED%20ARAB%20EMIRATES%20ADDRESS%20-%20PER%20NO.%20169423%20P.%20O.%20BOX%20%3A%20932!5e0!3m2!1sen!2sin!4v1760340912744!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <p className="pb-4 font-semibold text-[1.2rem]">Dubai</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

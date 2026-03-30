import NavigationBar from "./components/NavigationBar";
import Header from "./components/Header";
import Attribution from "./components/Attribution";
import HeadingSubheading from "./components/HeadingSubheading";
import Services from "./components/Services";
import CTA from "./components/CTA";
import Process from "./components/Process";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <div className="relative pt-[60px] max-sm:pt-[30px]">
      <NavigationBar />
      <Header className="mt-[70px] max-sm:mt-[40px]" />
      <HeadingSubheading
        className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
        heading="Features"
        subheading="Converse offers a suite of tools designed to make language learning interactive, competitive, and effective through real conversations."
      />
      <Services className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
      <CTA className="mt-[100px] max-sm:mt-[40px]" />
      <HeadingSubheading
        className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px] max-md:flex-col"
        heading="How It Works"
        subheading="Your step-by-step path to fluency"
        subheadingClassName="max-w-[292px]"
      />
      <Process className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
      <Footer className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]" />
      <Attribution />
    </div>
  );
}

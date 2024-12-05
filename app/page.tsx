import ApplicationSteps from "@/components/ApplicationSteps";
import Footer from "@/components/Footer";
import JobListings from "@/components/JobListings";
import JobSearchHero from "@/components/JobSearchHero";
import { MainNav } from "@/components/ui/navigation-menu";

export default function Home() {
  return (
    <div>
      <MainNav/>
      <JobSearchHero/>
      <JobListings/>
      <ApplicationSteps/>
      <Footer/>
    </div>
  );
}

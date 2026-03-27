"use client";

import Link from "next/link";
import HowItWorksCard from "@/components/landing-page/HowItWorrksCard";
import EuropeMap from "@/assets/EuropeMap.png";
import GreenEnergy from "@/assets/GreenEnergy.png";
import RedEnergy from "@/assets/RedEnergy.png";
import TickAndText from "@/components/landing-page/TickAndText";
import NavBar from "@/components/nav-bar/NavBar";

export default function Home() {
  return (
    <div className="relative min-h-screen text-base-900">
      <NavBar />
      <div className="absolute bottom-0 -top-23 left-0 right-0 -z-10">
        <img
          src="/BGimage.svg"
          alt="background"
          className="w-full h-full object-top "
        />
      </div>

      <main>
        <section className="mx-auto min-h-[85vh] flex flex-col justify-center  w-full max-w-6xl px-6 py-16 text-center">
          <div className="flex flex-col items-center space-y-20">
            <div className="flex flex-col items-center space-y-10">
              <h1 className="heading1 text-base-900">
                Run your code where the grid is cleaner
              </h1>

              <p className="paragraph1-light text-base-700 max-w-126">
                GreenWin routes backend workloads to regions and time windows
                with lower carbon intensity, without changing your deployment
                process.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/tasks/new"
                className=" w-92 rounded-sm bg-base-100 border-secondary-900 border px-6 py-4 text-sm body1 text-secondary-900
                 hover:bg-secondary-700 hover:border-secondary-700 hover:text-base-100 ease-out transition duration-300"
              >
                View Stats
              </Link>

              <Link
                href="/tasks"
                className=" w-92 rounded-sm bg-secondary-800 px-6 py-4 text-sm body1 text-base-100 hover:bg-secondary-900 ease-out transition duration-300"
              >
                Add job
              </Link>
            </div>
          </div>
        </section>

        <section
          id="efficiency"
          className="flex flex-col gap-20 rounded-xl bg-base-100 mx-24 w-auto px-26 py-25 shadow-custom"
        >
          <div className="text-center gap-6 flex flex-col items-center justify-center">
            <p className="heading3 text-base-800">Efficiency By Design</p>
            <p className="body2-light text-base-700 max-w-3xl">
              Our intelligent engine continuously monitors global power grids to
              ensure your compute power leaves zero traces.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <HowItWorksCard
              title="Real-time carbon mapping"
              description="Continuously evaluates regions and providers based on cleaner energy mix."
              number={1}
              src="/File.svg"
            />
            <HowItWorksCard
              title="Automatic scheduling"
              description="Decides immediate run or delayed execution windows against your deadlines."
              number={2}
              src="/Analysis.svg"
            />
            <HowItWorksCard
              title="Cost and impact reporting"
              description="Keeps status, region and estimated CO2 savings in one management workspace."
              number={3}
              src="/Flash.svg"
            />
          </div>
        </section>

        <section id="advantages" className="w-auto px-24 py-20">
          <div className="px-10 w-fit">
            <div className="bg-secondary-900 px-10 py-5 rounded-t-lg shadow-custom">
              <p className="heading5 text-base-100">Advantages</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_80px_1fr] items-center">
            <div className="p-12 flex flex-row gap-10 bg-base-100 rounded-lg shadow-custom">
              <div className="flex flex-col gap-4">
                <p className="heading6 text-secondary-900">
                  ESG-Ready Reporting
                </p>
                <p className="paragraph1-light text-base-700">
                  Export detailed reports documenting every kilogram of CO2
                  prevented by your compute operations.
                </p>
              </div>
              <img src="/Stat.svg" alt="Stat" className="w-50" />
            </div>

            <div className="p-12 flex justify-center items-center w-20 h-12 bg-base-100 shadow-custom"></div>

            <div className="p-12 h-full flex flex-row gap-10 justify-center items-center bg-secondary-900 rounded-lg shadow-custom">
              <div className="w-30 h-20 rounded-lg bg-base-100/10 grid place-items-center">
                <img src="/Clock.svg" alt="Clock" className="w-10" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="heading6 text-base-100">Automated Scheduling</p>
                <p className="paragraph1-light text-base-100">
                  Set your deadline, and we’ll find the greenest window before
                  your data is needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-auto px-24">
          <div className="bg-base-100 rounded-xl px-26 py-22 flex flex-row shadow-custom">
            <div className="flex flex-col gap-8">
              <p className="heading5 text-base-900 px-3">
                Real-time Carbon Intensity Mapping
              </p>
              <img src={EuropeMap.src} alt="Europe Map" className="w-200" />
            </div>
            <div className="flex flex-col gap-8 -ml-24">
              <img src={GreenEnergy.src} alt="GreenEnery" />
              <img src={RedEnergy.src} alt="RedEnergy" />
            </div>
          </div>
        </section>

        <section className="w-full bg-primary-200 py-32 pl-24">
          <div className="max-w-137 flex flex-col gap-12">
            <p className="heading2 text-primary-900 max-w-137">
              Integrated With Your Workflow
            </p>
            <p className="body2-light text-base-700">
              Our submission engine fits perfectly into your CI/CD pipelines. No
              complex refactoring—just add a few parameters and let Green Win
              handle the heavy lifting.
            </p>
            <div className="flex flex-col gap-8">
              <TickAndText
                title="Native Kubernetes Integration"
                description="Deploy using standard Helm charts or Operators."
              ></TickAndText>
              <TickAndText
                title="RESTful API Support"
                description="Simple endpoints for any custom integration."
              ></TickAndText>
            </div>
          </div>
        </section>

        <footer className="border-t bg-primary-900 pt-30 pb-16 flex flex-col gap-23 text-xs text-base-100 px-24">
          <div className="text-base-100 flex flex-col gap-6">
            <div className="flex flex-row gap-2">
              <img src="/greenwin-logo.svg" alt="Logo" />
              <p className="heading7 text-base-100">Green Win</p>
            </div>
            <p className="paragraph1-light max-w-55">
              Optimizing the world's compute resources for a sustainable, net-
              zero future.
            </p>
          </div>
          <div className="caption1 text-primary-600  flex w-full flex-wrap items-center justify-between ">
            <p>© 2026 Green Win Inc. All rights reserved.</p>
            <p>Hackathon MVP</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

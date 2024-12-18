import { useState, useEffect, useContext } from "react";
import { FaSort } from "react-icons/fa";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TokenCard from "../components/TokenCard";
import { Drawer } from "vaul";
import { getPeriods, getProjects, getTokenPairs } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { motion } from "framer-motion";
import LaunchModal from "../components/LaunchModal";

interface TokenPair {
  id: number;
  periodId: number;
  voteTokenId: number;
  weight: number;
  minimumCount: number;
}

interface Project {
  id: number;
  periodId: number;
  logoURL: string;
  name: string;
  proposalDesc: string;
  socials: string[];
  proposalStatus: string;
  startAt: string;
  endAt: string;
  currentVotePower: number;
  threshold: number;
  vTokens: TokenPair[];
}

const MyLaunch = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortOrder, setSortOrder] = useState("all");
  const [_showModal, setShowModal] = useState(false);
  const [approveShowModal, setApproveShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const { userId } = useContext(JwtTokenContext);

  useEffect(() => {
    const fetchProjects = async () => {
      const pros = await getProjects();
      const periods = await getPeriods();
      const tokenPairs = await getTokenPairs();

      if (
        pros.success === true &&
        periods.success === true &&
        tokenPairs.success === true
      ) {
        setProjects(
          pros.projects
            .filter(
              (e: any) => e.owner === userId && e.proposalStatus !== "DECLINED"
            )
            .map((e: any) => {
              const period = periods.periods.filter(
                (item: any) => item.id === e.periodId
              );

              if (!period) return null;
              return {
                id: e.id,
                logoURL: e.logoURL,
                name: e.name,
                proposalDesc: e.proposalDesc,
                proposalStatus: e.proposalStatus,
                socials: [e.twitter, e.website],
                startAt: period[0].startAt,
                endAt: period[0].endAt,
                currentVotePower: e.currentVotePower,
                threshold: period[0].votePowerLimit,
                vTokens: tokenPairs.tokenPairs.filter(
                  (item: any) => item.periodId === e.periodId
                ),
              };
            })
        );
      }
    };

    fetchProjects();
  }, [approveShowModal]);

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  // Sort projects based on status
  const filteredProjects = projects.filter((project) => {
    if (sortOrder === "VOTING") {
      return project.proposalStatus === "VOTING";
    } else if (sortOrder === "APPROVED") {
      return project.proposalStatus === "APPROVED";
    } else if (sortOrder === "LAUNCHED") {
      return project.proposalStatus === "LAUNCHED";
    } else {
      if (project.proposalStatus === "PENDING") false;
      return true; // Default to show all projects
    }
  });

  return (
    <section className="pt-16 bg-radial-gradient dark:bg-bg">
      <div className="flex justify-center min-h-screen">
        <div className="min-h-screen p-2 text-textclr2">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              staggerChildren: 0.3,
            }}
          >
            <h1 className="my-4 mb-4 text-4xl text-center font-primaryBold">
              My Projects
            </h1>
            <p className="mb-4 text-center text-textclr">
              Check the status of your added tokens & confirm if they are ready
              to launch post-approval.
              <br />
            </p>
            {/*  -- Sort Dropdown --  */}
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center mx-2 border-lg btn text-textclr2 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
              >
                <FaSort className="inline mr-2" /> Sort
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-[1] card card-compact w-64 p-1 shadow bg-primary/60 text-primary-content"
              >
                <ul className="rounded-lg shadow-lg menu bg-base-300 shadow-slate-800 text-textclr2">
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "VOTING"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("VOTING")}
                    >
                      <EventIcon className="inline mr-2" /> Voted
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "APPROVED"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("APPROVED")}
                    >
                      <EventAvailableIcon className="inline mr-2" /> Approved
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "LAUNCHED"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("LAUNCHED")}
                    >
                      <EventAvailableIcon className="inline mr-2" /> Launched
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "all" ? "text-textclr" : "text-textclr2"
                      }`}
                      onClick={() => handleSort("all")}
                    >
                      <CalendarMonthIcon className="inline mr-2" /> All
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => {
                // if (project.proposalStatus == "LAUNCHED") return null;
                return (
                  <TokenCard
                    key={index}
                    projectId={project.id}
                    projectName={project.name}
                    projectLogo={project.logoURL}
                    projectDesc={project.proposalDesc}
                    socials={project.socials}
                    status={
                      project.proposalStatus as
                        | "PENDING"
                        | "VOTING"
                        | "APPROVED"
                        | "LAUNCHED"
                        | "DECLINED"
                    }
                    startAt={project.startAt}
                    endAt={project.endAt}
                    votePower={project.currentVotePower}
                    voteThreshold={project.threshold}
                    // vTokens={project.vTokens}
                    isVote={false}
                    setShowModal={setShowModal}
                    setApproveShowModal={setApproveShowModal}
                    setSelectedId={setSelectedId}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      {/* // Pagination  */}
      <div className="flex justify-center p-2">
        <div className="join ">
          <button className="join-item btn btn-active text-textclr2">1</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">2</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">3</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">4</button>
        </div>
      </div>
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <div className="flex items-center justify-center">
            <div className="btn btn-ghost text-textclr2/40 hover:text-textclr/20">
              Disclaimer
            </div>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80" />
          <Drawer.Content className="bg-gray-700/80 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-2 rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-btnbg mb-2" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="mb-4 text-2xl text-center text-textclr font-primaryBold">
                  Disclaimer
                </Drawer.Title>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 rounded-e-badge font-primaryRegular border-textclr2 text-textclr2 text-pretty">
                  <i>
                    The information provided about tokens is for informational
                    purposes only & should not be considered financial advice.
                    Investing in tokens carries risks, including market
                    volatility & potential loss of investment. It's crucial to
                    conduct thorough research and seek professional advice
                    before investing. Please ensure you review all the details
                    of each project before casting your vote.
                  </i>
                </p>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 text-textclr2 font-primaryRegular rounded-e-badge border-textclr2">
                  <i>
                    We <b>"PRNT"</b> do not endorse the accuracy of token claims
                    or investment opportunities mentioned. Users should exercise
                    caution when engaging in its related activities.
                  </i>
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      {approveShowModal && (
        <LaunchModal
          setApproveShowModal={setApproveShowModal}
          projectId={selectedId}
        />
      )}
    </section>
  );
};

export default MyLaunch;

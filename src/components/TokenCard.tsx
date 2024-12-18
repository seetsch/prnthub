import React from "react";
import PollIcon from "@mui/icons-material/Poll";
import BallotTwoToneIcon from "@mui/icons-material/BallotTwoTone";
import { toast } from "react-toastify";

interface TokenCardProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApproveShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedId: React.Dispatch<React.SetStateAction<number>>;
  projectId: number;
  projectLogo: string;
  projectName: string;
  projectDesc: string;
  socials: string[];
  status:
  | "PENDING"
  | "VOTING"
  | "APPROVED"
  | "LAUNCHED"
  | "DECLINED"
  | "PREPENDING"
  | "ENDED";
  startAt: string;
  endAt: string;
  votePower: number;
  isVote: boolean;
  voteThreshold: number;
}

const TokenCard: React.FC<TokenCardProps> = ({
  setShowModal,
  setApproveShowModal,
  setSelectedId,
  projectId,
  projectLogo,
  projectName,
  projectDesc,
  socials,
  status,
  startAt,
  endAt,
  votePower,
  voteThreshold,
  isVote,
}) => {
  let bgStyle =
    "bg-[#AAAAAA] hover:bg-textclr2 cursor-progress text-slate-700/90 font-primaryRegular";
  if (status === "VOTING") {
    const curTime = new Date();
    const endTime = new Date(endAt);

    if (curTime > endTime || votePower >= voteThreshold) {
      status = "ENDED";
      bgStyle =
        "bg-[#F2844E] hover:bg-textclr2 cursor-progress text-textclr font-primaryRegular";
    } else
      bgStyle =
        "bg-[#34D399] hover:bg-textclr2 cursor-progress text-textclr font-primaryRegular";
  } else if (status === "APPROVED")
    bgStyle =
      "bg-[#3333FF] hover:bg-textclr2 cursor-progress text-textclr font-primaryRegular";
  else if (status === "LAUNCHED")
    bgStyle =
      "bg-[#33FFFF] hover:bg-textclr2 cursor-progress text-textclr font-primaryRegular";
  else if (status === "DECLINED")
    bgStyle =
      "bg-[#FF3333] hover:bg-textclr2 cursor-progress text-textclr font-primaryRegular";

  return (
    <>
      <div className="relative flex flex-col justify-between p-4 gap-4 mx-4 border rounded-lg shadow-2xl min-w-[10rem] min-h-[20rem] border-textclr2 card bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-textclr2 transition duration-300 ease-in-out">
        <div className="flex items-center mb-4 cursor-pointer">
          <div className="flex items-center">
            <img
              src={projectLogo}
              alt={projectName}
              className="w-12 h-12 mr-4 rounded-full ring-2 ring-textclr2/70"
            />
            <h3 className="text-textclr2 font-primaryBold">{projectName}</h3>{" "}
          </div>
          <div className="flex-1" />
          <div
            className={`text-sm px-2 py-1 ml-[130px] border-textclr2 border-2 rounded-full ${bgStyle}`}
          >
            {status}
          </div>
        </div>
        <div className="flex-1">
          <span className="min-h-0 mt-2 overflow-auto text-sm text-balance text-textclr">
            {projectDesc}
          </span>
        </div>
        {/* //Voting Period from date to date */}
        <div className="flex items-center px-2 py-2 my-2 text-sm rounded-md shadow-sm cursor-pointer bg-textclr2/30 hover:bg-textclr2/40 hover:text-textclr font-primaryRegular">
          <PollIcon className="inline mr-4 text-textclr2" />
          {status === "PENDING" ? (
            <></>
          ) : (
            <div className="flex flex-col">
              <span className="text-textclr font-primaryRegular">
                Voting Period :
              </span>
              <span className="text-textclr font-primaryRegular">
                {new Date(startAt).toLocaleString()}
              </span>
              <span className="text-textclr2 font-primaryRegular">
                {new Date(endAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        {/* Votes Calculation */}
        <div className="flex items-center px-2 py-2 my-2 text-sm text-center rounded-md shadow-sm cursor-pointer bg-textclr2/50 hover:bg-textclr2/60 hover:text-textclr font-primaryRegular">
          <BallotTwoToneIcon className="inline mr-4 text-textclr2" />
          <div className="flex flex-row gap-1">
            <span className=" text-textclr font-primaryRegular">
              Votes Received
            </span>
            <span className="px-[0.5rem] py-[0.4] rounded-lg text-textclr2 font-primaryRegular bg-bg">
              {votePower}
            </span>
          </div>
        </div>

        {/* Votes Threshold calc */}
        <span className="flex flex-col px-2 py-2 text-sm rounded-md cursor-pointer text-textclr bg-textclr2/30 hover:bg-textclr2/60 hover:text-textclr font-primaryRegular">
          <div className="flex items-center justify-between w-full">
            <span>Votes Threshold</span>
            <span className="text-sm text-textclr">
              {(votePower / voteThreshold) * 100}%
            </span>
          </div>
          <progress
            className="w-full mt-2 progress progress-success"
            value={voteThreshold}
            max="100"
          ></progress>
        </span>

        {/* Socials */}
        <div className="flex pt-2 mt-auto space-x-2">
          {socials.map((social, index) => (
            <a key={index} href={social} className="text-textclr2">
              {social.includes("twitter") ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ccf769"
                    d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#ccf769"
                    d="M1.019 8a6.46 6.46 0 0 0 1.003 3h2.382a14.5 14.5 0 0 1-.396-3zm0-1h2.989c.033-1.078.172-2.094.396-3H2.022a6.46 6.46 0 0 0-1.003 3M13.98 8h-2.989a14.5 14.5 0 0 1-.396 3h2.382a6.46 6.46 0 0 0 1.003-3m0-1a6.46 6.46 0 0 0-1.003-3h-2.382c.224.906.363 1.922.396 3zM5.008 8c.037 1.107.195 2.127.429 3h4.126c.234-.873.392-1.893.429-3zm0-1h4.984a13.4 13.4 0 0 0-.429-3H5.437a13.4 13.4 0 0 0-.429 3M.016 8H0V7h.016a7.5 7.5 0 0 1 14.968 0H15v1h-.016A7.5 7.5 0 0 1 .016 8m2.794 4a6.5 6.5 0 0 0 2.717 1.695A7.3 7.3 0 0 1 4.7 12zm9.38 0H10.3c-.23.657-.51 1.23-.827 1.695A6.5 6.5 0 0 0 12.19 12m-6.428 0c.484 1.24 1.132 2 1.738 2s1.254-.76 1.738-2zM2.81 3H4.7c.23-.657.51-1.23.827-1.695A6.5 6.5 0 0 0 2.81 3m9.38 0a6.5 6.5 0 0 0-2.717-1.695c.317.465.597 1.038.827 1.695zM5.762 3h3.476C8.754 1.76 8.106 1 7.5 1s-1.254.76-1.738 2"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>
        {isVote === true ? (
          <button
            onClick={() => {
              const curTime = new Date();
              const startTime = new Date(startAt);
              const endTime = new Date(endAt);
              if (curTime < startTime) {
                toast.error("Vote is not started yet!");
                return;
              }
              if (curTime > endTime || votePower >= voteThreshold) {
                toast.error("Voting ended!");
                return;
              }

              if (status === "VOTING") {
                setSelectedId(projectId);
                setShowModal(true);
              }
            }}
            className={`py-2 mt-4 tracking-wider rounded-md btn text-bg font-primaryRegular ${status === "PENDING"
                ? "!bg-slate-500/30 !text-white/70 !cursor-not-allowed"
                : status === "ENDED"
                  ? "!bg-gray-500/30 !text-white/70 !cursor-not-allowed"
                  : "bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
              }`}
            disabled={status === "PENDING" || status === "ENDED"}
          >
            {status === "PENDING"
              ? "Pending Approval"
              : status === "ENDED"
                ? "Voting Ended"
                : "Vote"}
          </button>
        ) : (
          <>
            {status === "APPROVED" ? (
              <button
                onClick={() => {
                  setSelectedId(projectId);
                  setApproveShowModal(true);
                }}
                className="py-2 mt-4 tracking-wider rounded-md btn text-bg font-primaryRegular bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
              >
                Launch
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default TokenCard;

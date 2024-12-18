import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import * as React from "react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { getProjects, getPoolTokens } from "../api/apis";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { createPresale } from "../solana/transaction";
import { PublicKey } from "@solana/web3.js";
import { getBalance } from "../utils/WebIntegration";

interface Project {
  id: number;
  symbol: string;
  proposalStatus: string;
  mint: string;
  decimals: number;
};

interface PoolToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
};

const TokenSetup = () => {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { userId } = useContext(JwtTokenContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [quoteTokenAddress, setQuoteTokenAddress] = useState("");
  const [salePrice, setSalePrice] = useState(0);
  const [minimumBuy, setMinimumBuy] = useState(0);
  const [maximumBuy, setMaximumBuy] = useState(0);
  const [hardCap, setHardCap] = useState(0);
  const [sendTokenCount, setSendTokenCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const launchPrice = 0;
  const softCap = 0;

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    if (pros.success === true) {
      setProjects(
        pros.projects
          .filter((e: any) => e.owner === userId && e.proposalStatus === "LAUNCHED")
          .map((e: Project) => ({
            id: e.id,
            proposalStatus: e.proposalStatus,
            symbol: e.symbol,
            decimals: e.decimals,
            mint: e.mint,
          }))
      );
    }

    // set quote token
    const pTokens = await getPoolTokens();
    if (pros.success === true) {
      setPoolTokens(
        pTokens.pooltokens.map((e: PoolToken) => ({
          id: e.id,
          name: e.name,
          decimals: e.decimals,
          tokenMint: e.tokenMint,
        }))
      );
    }
  }, [setProjects, setPoolTokens]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleBaseTokenSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }
    if (!wallet) {
      toast.error("Wallet connect error!");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      return;
    }

    const baseToken = e.target.value;
    setBaseTokenAddress(baseToken);
  };

  const handleQuoteTokenSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }
    if (!wallet) {
      toast.error("Wallet connect error!");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      return;
    }

    const quoteToken = e.target.value;
    setQuoteTokenAddress(quoteToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      toast.error("Wallet connect error!");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      return;
    }
    if (!baseTokenAddress) {
      toast.error("Base Token error!");
      return;
    }
    if (!quoteTokenAddress) {
      toast.error("Quote Token error!");
      return;
    }
    if (minimumBuy > maximumBuy) {
      toast.error("Minimum Buy must lower than Maximum Buy!");
      return;
    }
    if (startDate > endDate) {
      toast.error("Start Date or End Date error!");
      return;
    }

    setLoading(true);

    const baseBalance = await getBalance(wallet, baseTokenAddress);
    if (baseBalance < hardCap / salePrice) {
      setLoading(false);
      toast.error(`Base Token balance is not enough! (balance=${baseBalance})`);
      return;
    }

    const res = await createPresale(
      anchorWallet,
      new PublicKey(baseTokenAddress),
      new PublicKey(quoteTokenAddress),
      minimumBuy,
      maximumBuy,
      hardCap,
      softCap,
      salePrice,
      launchPrice,
      new Date(startDate).getTime(),
      new Date(endDate).getTime()
    );

    if ( res.success === false )
      toast.error(`Create Presale Error! ${res.error}`);
    else
      toast.success("Create Presale Success!");
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen p-4 bg-radial-gradient pt-20">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-primaryBold text-textclr2">
            Token Setup
          </h1>
          <p className="text-lg text-textclr2/50 font-primaryRegular">
            Setup a token presale.
          </p>
        </motion.div>
        <motion.div
          className="px-6 py-6 mx-auto mt-4 border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-primaryBold text-textclr2">
            Create Token Presale
          </h1>
          <div className="p-6 mx-auto rounded-lg shadow-2xl bg font-primaryRegular">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="sale-token"
                  >
                    Sale Token :
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg border-textclr2 focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    id="base-token"
                    onChange={handleBaseTokenSelect}
                    defaultValue="Select Base Token"
                  >
                    <option disabled>Select Base Token</option>
                    {projects.map((e) => (
                      <option value={e.mint}>{e.symbol}</option>
                    ))}
                  </select>
                  <Link
                    to="/tokenSubmit"
                    className="inline-block mt-1 text-sm text-textclr2"
                  >
                    Don't have a token ? Submit it here
                  </Link>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="payment-currency"
                  >
                    Payment Currency :
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg border-textclr2 focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    id="quote-token"
                    onChange={handleQuoteTokenSelect}
                    defaultValue="Select Quote Token"
                  >
                    <option disabled>Select Quote Token</option>
                    {poolTokens.map((e) => (
                      <option value={e.tokenMint}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="sale-price"
                  >
                    Sale Price :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="sale-price"
                    placeholder="Set token price for presale"
                    onChange={(e) => {
                      setSalePrice(parseFloat(e.target.value));
                      setSendTokenCount(hardCap / parseFloat(e.target.value));
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="hardcap"
                  >
                    Hardcap ({poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name}) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="hardcap"
                    defaultValue="0"
                    onChange={(e) => {
                      setHardCap(parseInt(e.target.value));
                      setSendTokenCount(parseInt(e.target.value) / salePrice);
                    }}
                  />
                  <p className="text-sm text-textclr2">
                    Hardcap for maximum amount of {poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name} to raise
                  </p>
                </div>
                {/* <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="lp-launch-price"
                  >
                    LP Launch Price :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="lp-launch-price"
                    placeholder="Set token price for Liquidity pool"
                    onChange={(e) => setLaunchPrice(parseFloat(e.target.value))}
                  />
                </div> */}
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="minimum-buy"
                  >
                    Minimum Buy ({poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name}) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="minimum-buy"
                    defaultValue="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric values including decimals
                      const parsedValue = parseFloat(value);
                      if (!isNaN(parsedValue)) {
                        setMinimumBuy(parsedValue);
                      }
                    }}
                  />

                  <p className="text-sm text-textclr2">
                    Minimum {poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name} quantity that user can buy
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="maximum-buy"
                  >
                    Maximum Buy ({poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name}) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="maximum-buy"
                    defaultValue="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric values including decimals
                      const parsedValue = parseFloat(value);
                      if (!isNaN(parsedValue)) {
                        setMaximumBuy(parsedValue);
                      }
                    }}
                  />

                  <p className="text-sm text-textclr2">
                    Maximum {poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name} quantity that user can buy
                  </p>
                </div>
              </div>

              {/* <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="softcap"
                  >
                    Softcap (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="softcap"
                    defaultValue="0"
                    onChange={(e) => setSoftCap(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-textclr2">
                    Softcap for minimum amount of SOL to raise
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="hardcap"
                  >
                    Hardcap (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="hardcap"
                    defaultValue="0"
                    onChange={(e) => {
                      setHardCap(parseInt(e.target.value));
                      setSendTokenCount(parseInt(e.target.value) / salePrice);
                    }}
                  />
                  <p className="text-sm text-textclr2">
                    Hardcap for maximum amount of SOL to raise
                  </p>
                </div>
              </div> */}

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="softcap"
                  >
                    Start Date :
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block px-3 py-2 mt-1 border border-gray-200 rounded-md shadow-sm w-fit focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
                  />
                  <p className="text-sm text-textclr2">Start Date of presale</p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="hardcap"
                  >
                    End Date :
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block px-3 py-2 mt-1 border border-gray-200 rounded-md shadow-sm w-fit focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
                  />
                  <p className="text-sm text-textclr2">End Date of presale</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-textclr2 font-primaryBold">
                  Sending Tokens :
                </p>
                <span className="text-textclr">{sendTokenCount} Tokens</span>
                <p className="text-textclr2 font-primaryBold"> Sale Rate :</p>
                <span className="text-textclr">1 / {salePrice} Tokens/{poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name}</span>
                <p className="mt-2 text-center text-textclr2">
                  <span className="font-primaryBold"> Prnthub Fee : </span>
                  <span className="text-textclr">2.5%</span>
                  <p className="mt-1 text-center text-textclr2">
                    <span className="font-primaryBold"> Total Fees : </span>
                    <span className="text-textclr">
                      {" "}
                      {(hardCap / 100) * 2.5} {poolTokens.find(e => e.tokenMint === quoteTokenAddress)?.name}
                    </span>
                  </p>
                </p>
                <button
                  type="submit"
                  className="px-4 py-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        {loading && (
          <>
            <div style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "1000"
            }}>
              <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Oval
                  height="80"
                  visible={true}
                  width="80"
                  color="#CCF869"
                  ariaLabel="oval-loading"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TokenSetup;

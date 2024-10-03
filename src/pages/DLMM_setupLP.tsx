import { useCallback, useEffect, useState } from "react";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import FAQ from "../components/DLMM_FAQ";
import { getPoolTokens, getProjects } from "../api/apis";
import { toast } from "react-toastify";
import { createPoolAndLockLiquidity, getBalance } from "../utils/WebIntegration";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Oval } from "react-loader-spinner";

interface Project {
  id: number;
  symbol: string;
  proposalStatus: string;
  mint: string;
  decimals: number;
}

interface PoolToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
}

interface Token {
  id: number;
  name: string;
  mint: string;
  decimals: number;
}

const DLMM_setupLP = () => {
  const wallet = useWallet();
  // const { jwtToken } = useContext(JwtTokenContext);
  const [memecoin, setMemecoin] = useState("");
  const [pairedToken, setPairedToken] = useState("");
  const [baseCount, setBaseCount] = useState("");
  const [quoteCount, setQuoteCount] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [dummyMemecoins, setDummyMemecoins] = useState([]);
  const [dummyPairedTokens, setDummyPairedTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    if (pros.success === true) {
      setDummyMemecoins(
        pros.projects
          .filter((e: any) => e.proposalStatus === "LAUNCHED")
          .map((e: Project) => ({
            id: e.id,
            name: e.symbol,
            decimals: e.decimals,
            mint: e.mint,
          }))
      );
    }

    // set quote token
    const pTokens = await getPoolTokens();
    if (pros.success === true) {
      setDummyPairedTokens(
        pTokens.pooltokens.map((e: PoolToken) => ({
          id: e.id,
          name: e.name,
          decimals: e.decimals,
          mint: e.tokenMint,
        }))
      );
    }
  }, [setDummyMemecoins, setDummyPairedTokens]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleBaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }

    const baseToken = e.target.value;
    setMemecoin(baseToken);
  };

  const handleQuoteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }

    const quoteToken = e.target.value;
    setPairedToken(quoteToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!wallet) {
      toast.error("Wallet connect error!");
      setLoading(false);
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      setLoading(false);
      return;
    }

    console.log({ memecoin, pairedToken, initialPrice, baseCount, quoteCount });

    let baseBalance, quoteBalance;
    try {
      baseBalance = await getBalance(wallet, memecoin);
      // baseBalance = await getBalance(wallet, 'H9gF5UQaYrWLy1GmXq82Ga13B8kmYcRT3dokcBmjG7PH');
    } catch (error) {
      toast.error("Get Base balance error!");
      setLoading(false);
      return;
    }
    
    try {
      quoteBalance = await getBalance(wallet, pairedToken);
    } catch (error) {
      toast.error("Get Quote balance error!");
      setLoading(false);
      return;
    }

    if (baseBalance < parseFloat(baseCount) || 
        quoteBalance < parseFloat(quoteCount)) {
      toast.error("Balance is not enough!")
      setLoading(false);
      return;
    }

    const baseToken : Token | undefined = dummyMemecoins.find((e: Token) => e.mint === memecoin ) as Token | undefined;
    const quoteToken : Token | undefined = dummyPairedTokens.find((e: Token) => e.mint === pairedToken ) as Token | undefined;

    if ( !baseToken || !quoteToken ) {
      toast.error("Get Token Error!");
      setLoading(false);
      return;
    }

    const config = new PublicKey('21PjsfQVgrn56jSypUT5qXwwSjwKWvuoBCKbVZrgTLz4');
    let allocations = [
      {
        address: new PublicKey('9Keg5CgCSSudKKuXJcEMvyksGLbbqgrtaYjoM18uyaGQ'),
        percentage: 80,
      },
      {
        address: new PublicKey('DQjkNZFKXZCxmuRcTqEzAV4CqgePqd9TJ7Xe3a1KLn4q'),
        percentage: 20,
      },
    ];

    const poolRes = await createPoolAndLockLiquidity(
      wallet, 
      new PublicKey(memecoin), 
      new PublicKey(pairedToken), 
      new BN(parseFloat(baseCount) * (10 ** baseToken.decimals)),
      new BN(parseFloat(quoteCount) * (10 ** quoteToken.decimals)),
      config,
      allocations
    )

    if ( poolRes.success === false ) {
      toast.error("Create Liqudity pool error!");
      setLoading(false);
      return;
    }

    toast.success("Create Liqudity pool success!");
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen p-4 pt-20 pb-16 bg-radial-gradient">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-5xl tracking-wide text-center font-primaryBold text-textclr2">
          Memecoin DLMM Pool Creation
        </h1>
        <p className="mb-8 text-xl tracking-tight text-center font-primaryRegular text-textclr2/70">
          To create a dynamic pool, please follow the steps outlined below. It's
          important to note that the assets in your pool may be distributed to
          lending platforms that support the assets you've selected. Read more{" "}
          <a
            href="https://docs.meteora.ag/liquidity-primitives/dynamic-amm-pools/permissionless-dynamic-pools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 transition-colors hover:text-green-400"
          >
            here
          </a>
        </p>

        <motion.form
          onSubmit={handleSubmit}
          className="p-8 mb-16 shadow-2xl bg-white/10 backdrop-blur-md rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="grid gap-2">
              <DropdownField
                label="Your memecoin"
                onChange={handleBaseSelect}
                options={dummyMemecoins}
              />
              <input
                type="number"
                value={baseCount}
                onChange={(e) => setBaseCount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <DropdownField
                label="Paired with"
                onChange={handleQuoteSelect}
                options={dummyPairedTokens}
              />
              <input
                type="number"
                value={quoteCount}
                onChange={(e) => setQuoteCount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="block mb-2 text-md font-primaryRegular text-textclr2">
              Initial Price
              <Tooltip
                title="Please verify that this price matches the current market price to avoid losing initial liquidity."
                arrow
                placement="top"
              >
                <InfoOutlinedIcon className="ml-1 text-sm text-textclr2/70" />
              </Tooltip>
            </label>
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
              required
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center text-textclr2/70">
              <LockOutlinedIcon className="mr-2 text-sm" />
              <p className="text-sm">
                Liquidity will be permanently locked but you will still earn
                trading fees. Fees will be dynamic and set by the protocol.{" "}
                <button
                  type="button"
                  className="text-green-500 hover:text-green-400 focus:outline-none"
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                >
                  {showMoreInfo ? "Show less" : "More info"}
                </button>
              </p>
            </div>

            <AnimatePresence>
              {showMoreInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 mt-4 rounded-lg bg-white/5"
                >
                  <h3 className="mb-2 text-lg font-semibold text-textclr2">
                    Claiming Fees
                  </h3>
                  <p className="mb-4 text-sm text-textclr2/70">
                    Only this wallet can claim fees from the locked liquidity.
                    To claim fees with another wallet, add liquidity using your
                    preferred wallet.
                  </p>
                  <h3 className="mb-2 text-lg font-semibold text-textclr2">
                    Fees
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-textclr2/70">
                      Dynamic Fee
                      <Tooltip
                        title="The trading fee for this pool is dynamic and will be set by the protocol."
                        arrow
                        placement="top"
                      >
                        <InfoOutlinedIcon className="ml-1 text-xs" />
                      </Tooltip>
                    </span>
                    <span className="text-sm text-textclr2">
                      0.15%-15% (Current: 15%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-textclr2/70">
                      Volume Referral Fee
                      <Tooltip
                        title="The % of Dynamic Fee that goes to trading bots and integrations that refer volume to this pool."
                        arrow
                        placement="top"
                      >
                        <InfoOutlinedIcon className="ml-1 text-xs" />
                      </Tooltip>
                    </span>
                    <span className="text-sm text-textclr2">
                      20% of Dynamic Fee
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center py-4">
            <button 
              className="px-4 py-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
              onClick={handleSubmit}
            >
              Create Liquidity Pool
            </button>
          </div>
        </motion.form>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FAQ />
          {/* Powered by Meteora */}
          <motion.footer
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-4 bg-gradient-to-t from-black/40 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="flex items-center text-xl tracking-wider font-primaryBold text-textclr2/70">
              Powered by
              <img
                src="/logo-meteora-with-text-onDark.png"
                alt="Meteora Logo"
                className="h-8 ml-2"
              />
            </span>
          </motion.footer>
        </motion.div>
      </motion.div>

      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Oval
            height={80}
            width={80}
            color="#CCF869"
            visible={true}
            ariaLabel="oval-loading"
          />
        </motion.div>
      )}
    </div>
  );
}

interface DropdownFieldProps {
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Token[];
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  onChange,
  options,
}) => (
  <div>
    <label className="block mb-2 text-md font-primaryRegular text-textclr2">
      {label}
    </label>
    <div className="relative">
      <select
        onChange={onChange}
        className="w-full p-3 pr-10 border border-gray-300 rounded-lg appearance-none text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20"
        defaultValue="Select token"
        required
      >
        <option value="">Select token</option>
        {options.map((option: Token) => (
          <option key={option.mint} value={option.mint}>
            {option.name}
          </option>
        ))}
      </select>
      <KeyboardArrowDownIcon className="absolute transform -translate-y-1/2 pointer-events-none text-textclr2/70 right-3 top-1/2" />
    </div>
  </div>
);

export default DLMM_setupLP;

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { FaFileAlt, FaPlus, FaMinus } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

const MemecoinSubmit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    solAmount: "",
    description: "",
    tokenIcon: null as File | null,
    socials: [] as string[],
  });

  const [calculatedValues, setCalculatedValues] = useState({
    initialTokenPrice: 0,
    initialMarketCap: 0,
    initialLiquidity: 0,
  });

  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [socials, setSocials] = useState({
    twitter: "",
    telegram: "",
    discord: "",
    website: "",
  });

  useEffect(() => {
    // Dummy logic for calculating values based on SOL amount
    // TODO: Replace with actual calculation logic
    const solAmount = parseFloat(formData.solAmount) || 0;
    setCalculatedValues({
      initialTokenPrice: solAmount * 0.1,
      initialMarketCap: solAmount * 1000,
      initialLiquidity: solAmount * 2,
    });
  }, [formData.solAmount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, tokenIcon: file }));
  };

  const removeTokenIcon = () => {
    setFormData((prev) => ({ ...prev, tokenIcon: null }));
    // Reset the file input
    const fileInput = document.getElementById(
      "tokenIconInput"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
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
          Launch Your Memecoin
        </h1>
        <p className="mb-8 text-xl tracking-tight text-center font-primaryRegular text-textclr2/70">
          Submit your memecoin details and join the Meteora ecosystem!
        </p>

        <motion.form
          onSubmit={handleSubmit}
          className="p-8 mb-16 shadow-2xl bg-white/10 backdrop-blur-md rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <InputField
              label="Token Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter token name"
              required
            />
            <Tooltip
              title="The ticker symbol for your token, typically 3-4 characters long Eg: $PRNT"
              arrow
              placement="top"
            >
              <div>
                <InputField
                  label="Symbol"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleChange}
                  placeholder="Enter symbol"
                  required
                />
              </div>
            </Tooltip>
            <Tooltip
              title="The amount of SOL you want to provide as initial liquidity for your token"
              arrow
              placement="top"
            >
              <div>
                <label className="block mb-2 text-md font-primaryRegular text-textclr2">
                  How much SOL to allocate to the pool
                </label>
                <div className="relative flex items-center">
                  <div className="absolute flex items-center pointer-events-none left-3">
                    <img
                      src="https://solana.com/_next/static/media/solanaLogoMark.17260911.svg"
                      alt="Solana Logo"
                      width={24}
                      height={24}
                    />
                    <span className="ml-2 font-primaryBold text-textclr2">
                      SOL
                    </span>
                  </div>
                  <input
                    type="number"
                    name="solAmount"
                    value={formData.solAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full py-3 pl-24 pr-4 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
                    required
                  />
                </div>
              </div>
            </Tooltip>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2">
                Token Icon
              </label>
              <input
                id="tokenIconInput"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20"
              />
              {formData.tokenIcon && (
                <div className="flex items-center mt-2 text-textclr2">
                  <FaFileAlt className="mr-2" />
                  <span>{formData.tokenIcon.name}</span>
                </div>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-textclr2/70">
                  PNG, JPG (max. 800×800px)
                </p>
                {formData.tokenIcon && (
                  <button
                    type="button"
                    onClick={removeTokenIcon}
                    className="p-1 text-red-500 transition-colors duration-300 border border-red-500 rounded-full hover:bg-red-500 hover:text-white"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <h2 className="mt-8 mb-4 text-2xl font-bold text-textclr2">
            {/* Token Economics */}
          </h2>
          <div className="grid gap-8 p-6 py-6 md:grid-cols-3 bg-white/10 rounded-3xl backdrop-blur-md">
            <DisplayField
              label="Initial Token Price"
              value={`$${calculatedValues.initialTokenPrice.toFixed(4)}`}
            />
            <DisplayField
              label="Initial Market Cap"
              value={`$${calculatedValues.initialMarketCap.toFixed(2)}`}
            />
            <DisplayField
              label="Initial Liquidity"
              value={`$${calculatedValues.initialLiquidity.toFixed(2)}`}
            />
          </div>

          <div className="mt-8">
            <label className="block mb-2 text-md font-primaryRegular text-textclr2">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your memecoin project"
              className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
              rows={4}
              required
            />
          </div>

          {/* add Social Media  */}
          <motion.div className="mt-8" layout>
            <div className="flex items-center justify-between mb-2">
              <label className="text-md font-primaryRegular text-textclr2">
                Social Media
              </label>
              <motion.button
                type="button"
                className="flex items-center text-sm text-textclr2 hover:text-textclr2/80"
                onClick={() => setShowSocialOptions(!showSocialOptions)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showSocialOptions ? (
                  <>
                    <FaMinus className="mr-1" /> Hide options
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-1" /> Show options
                  </>
                )}
              </motion.button>
            </div>
            <AnimatePresence>
              {showSocialOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    className="grid gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <InputField
                      label="Twitter"
                      name="twitter"
                      value={socials.twitter}
                      onChange={handleSocialChange}
                      placeholder="Enter Twitter URL"
                    />
                    <InputField
                      label="Telegram"
                      name="telegram"
                      value={socials.telegram}
                      onChange={handleSocialChange}
                      placeholder="Enter Telegram URL"
                    />
                    <InputField
                      label="Website"
                      name="website"
                      value={socials.website}
                      onChange={handleSocialChange}
                      placeholder="Enter Website URL"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="submit"
            className="px-8 py-3 mt-8 transition-all duration-300 border rounded-full shadow-lg font-primaryRegular border-lime-500 text-textclr bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none focus:ring-2 focus:ring-btnbg focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Memecoin
          </motion.button>
        </motion.form>
      </motion.div>

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

      {/* Meteorboy image */}
      {/* <motion.img
        src="/meteorboy.png"
        alt="Meteorboy"
        className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      /> */}

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

      {success && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="p-8 text-2xl font-bold text-center text-textclr2 bg-white/10 backdrop-blur-md rounded-3xl">
            Memecoin submitted successfully!
          </div>
        </motion.div>
      )}
    </div>
  );
};

const InputField = ({
  label,
  ...props
}: {
  label: string;
  [key: string]: any;
}) => (
  <div>
    <label className="block mb-2 text-md font-primaryRegular text-textclr2">
      {label}
    </label>
    <input
      className="w-full p-3 border border-gray-300 rounded-lg text-textclr2 focus:outline-none focus:ring-2 focus:ring-textclr2 bg-white/20 placeholder-textclr2/50"
      {...props}
    />
  </div>
);

const DisplayField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block mb-2 text-md font-primaryRegular text-textclr2">
      {label}
    </label>
    <div className="w-full p-3 rounded-lg text-textclr2 bg-white/20">
      {value}
    </div>
  </div>
);

export default MemecoinSubmit;

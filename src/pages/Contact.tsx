import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <>
      <div className="h-screen px-12 py-10 pt-20 bg-radial-gradient">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-2xl font-primaryBold text-textclr2">
            Reach out to us!
            <p className="italic font-primaryRegular">
              Send your queries to us at{" "}
              <a href="mailto:rishee.sds@gmail.com" className="text-textclr">
                Team
              </a>
            </p>
          </h1>
          {/* <form className="mt-8">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Let us know how we can help you!"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md btn text-slate-500 bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
            >
              Submit
            </button>
          </form> */}
        </motion.div>
      </div>
    </>
  );
};

export default ContactPage;

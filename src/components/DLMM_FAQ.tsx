import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full p-4 text-left rounded-lg bg-white/10 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-primaryRegular text-textclr2">
          {question}
        </span>
        <KeyboardArrowDownIcon
          className={`text-textclr2 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 rounded-b-lg bg-white/5">
          <p
            className="text-sm text-textclr2/70"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
};

const DLMM_FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "What is a DLMM Pool?",
      answer:
        "A DLMM (Dynamic Liquidity Market Maker) Pool is a type of liquidity pool that automatically adjusts its parameters based on market conditions. It aims to provide better capital efficiency and reduced impermanent loss compared to traditional AMMs.",
    },
    {
      question: "Why am I creating this pool?",
      answer:
        "You're creating this pool to provide liquidity for your memecoin paired with another token. This allows traders to buy and sell your memecoin, potentially increasing its liquidity and adoption.",
    },
    {
      question: "What happens to my tokens when I create a pool?",
      answer:
        "When you create a pool, your tokens are locked in the pool contract. They provide liquidity for traders and earn you trading fees in return. However, the liquidity is permanently locked, meaning you can't withdraw your initial tokens.",
    },
    {
      question: "How do I earn from this pool?",
      answer:
        "You earn from trading fees generated by the pool. The fees are dynamic and set by the protocol, ranging from 0.15% to 15% of each trade. You can claim these fees periodically.",
    },
    {
      question: "What is the initial price for?",
      answer:
        "The initial price sets the starting price ratio between your memecoin and the paired token. It's crucial to set this close to the current market price to avoid immediate arbitrage opportunities that could drain your pool.",
    },
    {
      question: "How are fees calculated in a DLMM pool?",
      answer:
        "Fees in a DLMM pool are dynamic, meaning they adjust based on market volatility. The fee range is typically between 0.15% to 15% per trade. Higher volatility usually results in higher fees to compensate liquidity providers for increased risk.",
    },
    {
      question: "Where do the fees come from?",
      answer:
        "Fees are collected from traders who use the pool to swap tokens. Every time a trade occurs, a small percentage (the dynamic fee) is deducted from the trade amount and distributed to liquidity providers.",
    },
    {
      question: "When should I claim my fees?",
      answer:
        "You can claim your fees at any time, but it's often more cost-effective to claim less frequently due to transaction costs. Consider claiming when the accumulated fees are significant enough to justify the transaction cost.",
    },
    {
      question: "Can I compound my fees?",
      answer:
        "Currently, fees don't auto-compound. After claiming, you can manually add the claimed fees back into the pool as additional liquidity to compound your returns. However, remember that initial liquidity is permanently locked.",
    },
    {
      question: "What is impermanent loss?",
      answer:
        "Impermanent loss occurs when the price ratio of the paired tokens changes compared to when you added liquidity. It represents the difference between holding tokens in a liquidity pool versus holding them separately. The 'impermanent' aspect comes from the fact that the loss (or gain) only becomes realized when you withdraw your liquidity.",
    },
    {
      question: "How can I mitigate impermanent loss?",
      answer:
        "DLMM pools are designed to reduce impermanent loss compared to traditional AMMs. However, you can further mitigate it by:<br /><br />• Providing liquidity for pairs with correlated price movements<br />• Being prepared to hold long-term, allowing fees to potentially offset losses<br />• Regularly monitoring and rebalancing your position if necessary",
    },
    {
      question: "What's the best strategy for managing my DLMM pool?",
      answer:
        "The best strategy depends on your specific goals, risk tolerance, and market conditions. Some general tips include:<br /><br />• Start with a small amount to understand how the pool behaves<br />• Monitor your pool's performance regularly<br />• Be prepared for long-term holding<br />• Diversify across different pools or strategies<br /><br />Always remember to DYOR (Do Your Own Research) and consider consulting with financial advisors for personalized strategies.",
    },
  ];

  return (
    <div className="mt-16">
      <h2 className="mb-6 text-3xl text-center font-primaryBold text-textclr2">
        Frequently Asked Questions
      </h2>
      {faqItems.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default DLMM_FAQ;

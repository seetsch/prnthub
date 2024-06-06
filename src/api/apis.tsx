
import axios from "axios";

export const getProjects = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/token",
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await axios.request(config);
      return { success: true, projects: response.data };
    } catch (error) {
      return { success: false };
    }
};

export const getPeriods = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/period",
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await axios.request(config);
      return { success: true, periods: response.data };
    } catch (error) {
      return { success: false };
    }
};

export const getVTokens = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/vtoken",
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await axios.request(config);
      return { success: true, vtokens: response.data };
    } catch (error) {
      return { success: false };
    }
};

export const createVToken = async (jwtToken: string | null, name: string, mint: string , decimals: number) => {
    const data = {
        'name': name,
        'tokenMint': mint,
        'decimals': decimals.toString()
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/vtoken",
      headers: {
        "Authorization": "Bearer " + jwtToken,
        "Content-Type": "application/json"
      },
      data: data,
    };

    try {
        await axios.request(config);
        return { success: true }
    } catch (error) {
        return { success: false };
    }
};

export const createVotePeriod = async (jwtToken: string | null, projectId: number, startAt: string, endAt: string , votingtitle: string, votePowerLimit: number) => {
  const data = {
      'projectId': projectId,
      'startAt': new Date(startAt).toISOString(),
      'endAt': new Date(endAt).toISOString(),
      'votingtitle': votingtitle,
      'votePowerLimit': votePowerLimit
  };

  console.log("data = ", data);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.prnthub.com/period",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
      const response = await axios.request(config);
      return { success: true, period: response.data }
  } catch (error) {
      return { success: false };
  }
};

export const createTokenPair = async (jwtToken: string | null, periodId: number, voteTokenId: number , weight: number) => {
  const data = {
      'periodId': periodId,
      'voteTokenId': voteTokenId,
      'weight': weight,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.prnthub.com/tokenpair",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
      await axios.request(config);
      return { success: true }
  } catch (error) {
      return { success: false };
  }
};
import axios from "axios";

export const youtubeAPI = {

  // FIXED: correct argument order (token first, query second)
  search: async (token, query) => {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          maxResults: 25
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  },

  history: async (token) => {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/activities",
      {
        params: {
          mine: true,
          part: "snippet,contentDetails",
          maxResults: 25
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  },

  likeVideo: async (videoId, token) => {
    await axios.post(
      "https://www.googleapis.com/youtube/v3/videos/rate",
      {},
      {
        params: {
          id: videoId,
          rating: "like"
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return { success: true };
  }
};

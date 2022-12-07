const axios = require("axios").default;

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const geniusAxios = axios.create({
  baseURL: process.env.GENIUS_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.GENIUS_CLIENT_ACCESS_TOKEN}`,
  },
});

async function geniusGetLyrics(api_path) {
  try {
    const { data } = await geniusAxios.get(api_path);
    if (data.meta.status != 200) return "";
    const { embed_content } = data.response.song;
    if (!embed_content) return ""
    return embed_content
  } catch (error) {
    return "";
  }
}

async function searchLyrics(query) {
  try {
    const { data } = await geniusAxios.get(
      `/search?q=${encodeURIComponent(query)}`
    );
    if (data.meta.status != 200) return null;
    if (data.response.hits.length == 0) return null;
    const {
      type,
      result: { lyrics_state, api_path, id, path, full_title },
    } = data.response.hits[0];
    if (type != "song") return null;
    if (!lyrics_state) return null;
    if (lyrics_state != "complete") return null;

    let isExist = await geniusGetLyrics(api_path);
    if (!isExist) return null;
    let { data: lyrics_data } = await axios.get(`https://genius.com/songs/${id}/embed.js`);
    if (!lyrics_data) return null;

    let resFetch = `
    <div id="rg_embed_link_${id}" 
      class="rg_embed_link" 
      data-song-id="${id}">Read <a class="custom-link" href="https://genius.com${path}">
        ${full_title}</a> on Genius
    </div>`
    return {
      id, resFetch
    };

  } catch (error) {
    return null;
  }
}

module.exports = {
  isValidHttpUrl,
  searchLyrics,
};

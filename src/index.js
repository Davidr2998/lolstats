import {
  fetchByName,
  fetchDivision,
  getSummonerMatchList,
  getHistoryDetails,
} from "./utils/fetchByUserName.js";

import dotenv from "dotenv";
import express from "express";

const app = express();
const port = process.env.PORT || 3030;

dotenv.config();

app.get("/user/:username/:region", async (req, res) => {
  const { username, region } = req.params;
  const summoner = await fetchByName(region, encodeURIComponent(username));

  if (summoner.status) {
    return res.status(404).send(summoner.status);
  }

  const { id, accountId, puuid, revisionDate, profileIconId, ...userData } =
    summoner;

  const summonerInfo = {
    ...userData,
    iconURL: `http://ddragon.leagueoflegends.com/cdn/${process.env.DDRAGON_VERSION}/img/profileicon/${profileIconId}.png`,
  };

  const rankedDivision = await fetchDivision(id, region);
  const matchList = await getSummonerMatchList(puuid, region);
  const matchHistory = await getHistoryDetails(matchList, region, username);

  res.send({ summonerInfo, rankedDivision, matchHistory });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

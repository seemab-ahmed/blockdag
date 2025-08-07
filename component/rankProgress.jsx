"use client";
import React from "react";

const RankProgress = ({ current, next, leveltoUp, profile }) => {
  const currentRank = current;
  const nextRank = next;
  const progress = profile["progress bar"]; // 0% progress
  const coinsNeeded = leveltoUp;
  const currentLevel = 1;
  const nextLevel = 2;

  return (
    <div className="style_ranks__h5xNB">
      <div className="style_top__MRlcG">
        <span className="style_text__Z44aT style_md__ZQhe4">
          You need{" "}
          <span className="style_text__Z44aT style_md__ZQhe4 style_primary__o7qgw">
            <a href="/dashboard" className="cursor-pointer">
              {coinsNeeded} more BDAG
            </a>
          </span>{" "}
          coins to level up.
        </span>
      </div>

      <div className="style_rankArea__BLRsg">
        {/* Current Rank */}
        <div className="style_infos__4vMZr">
          <img
            alt={currentRank}
            loading="lazy"
            width="70"
            height="70"
            decoding="async"
            className="rankImg"
            src={`https://purchase3.blockdag.network/images/ranks/${currentRank?.toLowerCase()}.svg`}
            style={{ color: "transparent" }}
          />
          <div className="style_infoContent__QZi4X">
            <h5>{currentRank}</h5>
            <p>Current Rank</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="style_barArea__YpLrb">
          <div className="style_bar__8d8hZ">
            <div
              className="style_barProgress__O8z9l"
              style={{ width: `${progress}%` }}
            >
              <div className="style_barCurrent__tuGTi">{currentLevel}</div>
              <div className="style_barCount__CgdIZ" translate="no">
                {progress}
              </div>
            </div>
          </div>
          <div className="style_barNext__pBGZs">{nextLevel}</div>
        </div>

        {/* Next Rank */}
        <div className="style_infos__4vMZr">
          <img
            alt={nextRank}
            loading="lazy"
            width="70"
            height="70"
            decoding="async"
            className="rankImg"
            src={`https://purchase3.blockdag.network/images/ranks/${nextRank?.toLowerCase()}.svg`}
            style={{ color: "transparent" }}
          />
          <div className="style_infoContent__QZi4X">
            <h5>{nextRank}</h5>
            <p>Next Rank</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankProgress;

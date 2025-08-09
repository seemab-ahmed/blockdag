import React from "react";

const ProfileChart = ({ purchase }) => {
  // Ensure value is between 0–100
  const purchasePercent = Math.max(0, Math.min(purchase, 100));
  const bonusPercent = 100 - purchasePercent;

  const radius = 150;
  const center = 0;

  // Calculate point on circumference for given percent
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent) * radius;
    const y = Math.sin(2 * Math.PI * percent) * radius;
    return [x, y];
  };

  // Generate arc path for given start/end percentages
  const createArc = (startPercent, endPercent) => {
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  // First slice: Purchase
  const purchasePath = createArc(0, purchasePercent / 100);
  // Second slice: Bonus
  const bonusPath = createArc(purchasePercent / 100, 1);

  return (
    <div className="profile_chartArea__vsPCc">
      <div className="profile_chart__R3bOy">
        <div className="style_chart__4Dhsv">
          <svg
            className="style_donut__h_f_T"
            width="300"
            height="300"
            viewBox="-150 -150 300 300"
          >
            <defs>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A1C000"></stop>
                <stop offset="100%" stopColor="#FF923B"></stop>
              </linearGradient>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#421C81"></stop>
                <stop offset="100%" stopColor="#8E57E7"></stop>
              </linearGradient>
            </defs>

            {/* Purchase Slice */}
            <path
              d={purchasePath}
              fill="url(#orangeGradient)"
              stroke="#000"
              strokeWidth="1"
            ></path>
            <text
              x={50}
              y={0}
              fill="#FFF"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {purchasePercent.toFixed(1)}%
            </text>

            {/* Bonus Slice */}
            <path
              d={bonusPath}
              fill="url(#purpleGradient)"
              stroke="#000"
              strokeWidth="1"
            ></path>
            <text
              x={-50}
              y={0}
              fill="#FFF"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {bonusPercent.toFixed(1)}%
            </text>

            {/* Inner Circle */}
            <circle cx="0" cy="0" r="75" fill="#000"></circle>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="profile_labels__AajJF">
        <div className="profile_label__GWloT">
          <span className="profile_icon__p61hL"></span>
          <p className="style_text__Z44aT style_md__ZQhe4">Purchase</p>
        </div>
        <div className="profile_label__GWloT">
          <span className="profile_icon__p61hL"></span>
          <p className="style_text__Z44aT style_md__ZQhe4">Bonus</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileChart;

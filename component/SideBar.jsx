'use client'
import React, {useState} from 'react'

export const SideBar = () => {
   const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`style_sidebar__FlOrd${collapsed ? ' style_collapsed__W42on' : ''}`}>
    <div className="style_logoArea__bCOmk">
      <div className="style_hamburger__Rzhn3 d-sm" 
      onClick={() => setCollapsed(true)}
        style={{ cursor: "pointer" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M9 18H21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
      <a className="__className_665d18 style_logo__4uOOG" href="/">
        <img alt="cube" loading="lazy" width="54" height="54" decoding="async" data-nimg="1" className="d-md" style={{color:"transparent"}} src="https://purchase3.blockdag.network/bdag.gif" /> 
        <span>BlockDAG</span>
      </a>
      <div className="style_hamburger__Rzhn3 d-md " 
      onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 14.1663L10.8333 9.99967L15 5.83301M9.16667 14.1663L5 9.99967L9.16667 5.83301" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>
    <div className="style_quickArea__wwwUV d-sm">
      <div className="style_levelprogress__ItXuz">
        <div className="style_progress__40Zve">
          <div className="style_circle__DLGMX" style={{background:"conic-gradient(var(--primary) undefined%, #ffffff10 undefined% 100%)"}}></div>
          <div className="style_level__gAnH1 __className_665d18"><span></span></div>
        </div>
      </div>
      <div className="style_button__D_Zxp">
        <img alt="logout" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" style={{color:"transparent"}} src="https://purchase3.blockdag.network/icons/notification.svg" />
        <span className="style_notCount__NlAKO style_active__XzDfO">1</span>
      </div>
      <a className="style_button__D_Zxp style_early__0esFG" href="/#buy">
        <img alt="easter" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="style_easter__vHJvf" style={{color:"transparent"}} src="https://purchase3.blockdag.network/3d.gif" />
      </a>
      <a className="style_button__D_Zxp style_wallet__AMv1L d-sm" href="/#buy">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 14H16.51M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7L5 7C3.89543 7 3 6.10457 3 5ZM3 5C3 3.89543 3.89543 3 5 3H17M17 14C17 14.2761 16.7761 14.5 16.5 14.5C16.2239 14.5 16 14.2761 16 14C16 13.7239 16.2239 13.5 16.5 13.5C16.7761 13.5 17 13.7239 17 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </a>
    </div>
    <ul className="style_nav__VkM8c">
      <li>
        <a className="style_active__XzDfO" href="/">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 17.4965H16M11.0177 3.26052L4.23539 8.53565C3.78202 8.88827 3.55534 9.06458 3.39203 9.28538C3.24737 9.48097 3.1396 9.7013 3.07403 9.93557C3 10.2 3 10.4872 3 11.0616V18.2965C3 19.4166 3 19.9767 3.21799 20.4045C3.40973 20.7808 3.71569 21.0868 4.09202 21.2785C4.51984 21.4965 5.07989 21.4965 6.2 21.4965H17.8C18.9201 21.4965 19.4802 21.4965 19.908 21.2785C20.2843 21.0868 20.5903 20.7808 20.782 20.4045C21 19.9767 21 19.4166 21 18.2965V11.0616C21 10.4872 21 10.2 20.926 9.93557C20.8604 9.7013 20.7526 9.48097 20.608 9.28538C20.4447 9.06458 20.218 8.88827 19.7646 8.53565L12.9823 3.26052C12.631 2.98727 12.4553 2.85064 12.2613 2.79812C12.0902 2.75178 11.9098 2.75178 11.7387 2.79812C11.5447 2.85064 11.369 2.98727 11.0177 3.26052Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Home </span>
        </a>
      </li>
      <li>
        <a className="" href="/#buy">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L9 12M12 15C13.3968 14.4687 14.7369 13.7987 16 13M12 15V20C12 20 15.03 19.45 16 18C17.08 16.38 16 13 16 13M9 12C9.53214 10.6194 10.2022 9.29607 11 8.05C12.1652 6.18699 13.7876 4.65305 15.713 3.5941C17.6384 2.53514 19.8027 1.98637 22 2C22 4.72 21.22 9.5 16 13M9 12H4C4 12 4.55 8.97 6 8C7.62 6.92 11 8 11 8M4.5 16.5C3 17.76 2.5 21.5 2.5 21.5C2.5 21.5 6.24 21 7.5 19.5C8.21 18.66 8.2 17.37 7.41 16.59C7.02131 16.219 6.50929 16.0046 5.97223 15.988C5.43516 15.9714 4.91088 16.1537 4.5 16.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Buy Now </span>
        </a>
      </li>
      <li>
        <a className="" href="/calculator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 6.5L6.5 17.5M8.5 10.5V6.5M6.5 8.5H10.5M13.5 15.5H17.5M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Roi Calculator </span>
        </a>
      </li>
      <li>
        <a className="" href="/dev-releases">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 9H2M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3L6.8 3C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Dev Releases </span>
        </a>
      </li>
      <li>
        <a className="" href="/buyer-battles">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_113_850)">
              <path d="M12 0C6.95986 0 2.85938 4.10048 2.85938 9.14062C2.85938 12.37 4.54275 15.2136 7.07812 16.84V23.2969C7.07812 23.5562 7.22086 23.7945 7.44947 23.9168C7.67812 24.0392 7.95553 24.0257 8.17125 23.8819L12 21.3294L15.8287 23.8819C16.0444 24.0257 16.3218 24.0392 16.5505 23.9168C16.7791 23.7945 16.9219 23.5562 16.9219 23.2969V16.84C19.4573 15.2136 21.1406 12.37 21.1406 9.14062C21.1406 4.10048 17.0401 0 12 0ZM15.5156 21.9831L12.39 19.8993C12.1538 19.7419 11.8461 19.7419 11.61 19.8993L8.48438 21.9831V17.5777C9.56719 18.0306 10.7548 18.2812 12 18.2812C13.2452 18.2812 14.4328 18.0306 15.5156 17.5777V21.9831ZM12 16.875C7.73527 16.875 4.26562 13.4054 4.26562 9.14062C4.26562 4.87589 7.73527 1.40625 12 1.40625C16.2647 1.40625 19.7344 4.87589 19.7344 9.14062C19.7344 13.4054 16.2648 16.875 12 16.875Z" fill="white"></path>
              <path d="M17.5915 7.49573C17.5093 7.239 17.2876 7.05188 17.0207 7.014L13.983 6.58303L12.6275 3.90155C12.5079 3.66488 12.2652 3.51562 12 3.51562C11.7348 3.51562 11.4922 3.66488 11.3725 3.90155L10.0171 6.58303L6.97937 7.014C6.71247 7.05188 6.4907 7.239 6.40848 7.49573C6.32626 7.75247 6.39812 8.03362 6.5934 8.21948L8.78134 10.3018L8.26562 13.2377C8.21945 13.5006 8.32609 13.767 8.54097 13.9253C8.75579 14.0837 9.04178 14.1067 9.27925 13.9849L12 12.5883L14.7208 13.9849C14.9587 14.107 15.2447 14.0835 15.4591 13.9253C15.6739 13.767 15.7805 13.5006 15.7344 13.2377L15.2187 10.3018L17.4066 8.21953C17.6019 8.03363 17.6738 7.75252 17.5915 7.49573ZM13.9762 9.54295C13.8057 9.70523 13.7277 9.94209 13.7684 10.1739L14.1047 12.088L12.3211 11.1725C12.1195 11.069 11.8805 11.069 11.6789 11.1725L9.89537 12.088L10.2316 10.1739C10.2723 9.94209 10.1943 9.70523 10.0238 9.54295L8.61512 8.20228L10.5778 7.92384C10.8054 7.89155 11.0029 7.75003 11.1066 7.54491L12 5.77734L12.8934 7.54486C12.9971 7.75003 13.1946 7.89155 13.4222 7.9238L15.3849 8.20223L13.9762 9.54295Z" fill="white"></path>
            </g>
            <defs>
              <clipPath id="clip0_113_850">
                <rect width="24" height="24" fill="white"></rect>
              </clipPath>
            </defs>
          </svg> 
          <span>Buyer Battles <span className="style_new__1O6o_">NEW</span></span>
        </a>
      </li>
      <li>
        <a className="" href="/referral">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6824 6.17531H7.31713M11.9997 9.72311V6.24001M11.9997 16.4771V12.0902M14.4248 9.22995C16.8441 9.44698 18.5554 9.98236 18.5554 10.6084C18.5554 11.4268 15.6314 12.0902 12.0244 12.0902C8.4174 12.0902 5.49337 11.4268 5.49337 10.6084C5.49337 9.98236 7.20472 9.44698 9.62397 9.22995M22.5884 10.9883L11.9993 21.3228L1.41113 10.9883L5.52512 2.67578H18.4744L22.5884 10.9883Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Referral <span className="style_new__1O6o_">NEW</span></span>
        </a>
      </li>
      <li>
        <a className="" href="/leaderboard">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 13V17M16 11V17M12 7V17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Leaderboard </span>
        </a>
      </li>
      <li>
        <a className="" href="/transactions">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L8 4M8 4L6 2M8 4H6C3.79086 4 2 5.79086 2 8M18 18L16 20M16 20L18 22M16 20H18C20.2091 20 22 18.2091 22 16M10.189 6.5C10.8551 3.91216 13.2042 2 16 2C19.3137 2 22 4.68629 22 8C22 10.7957 20.0879 13.1449 17.5001 13.811M14 16C14 19.3137 11.3137 22 8 22C4.68629 22 2 19.3137 2 16C2 12.6863 4.68629 10 8 10C11.3137 10 14 12.6863 14 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Transaction </span>
          <svg className="style_chevron__hCvte" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.28137 7.5L10.2814 12.5L15.2814 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.28137 7.5L10.2814 12.5L15.2814 7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.28137 7.5L10.2814 12.5L15.2814 7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.28137 7.5L10.2814 12.5L15.2814 7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M5.28137 7.5L10.2814 12.5L15.2814 7.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </a>
        <ul className="style_dropdown__vcLG7">
          <li><a className="" href="/transactions"><span>My Transactions</span></a></li>
          <li><a className="" href="/transactions/live-transactions"><span>Live Transactions</span></a></li>
        </ul>
      </li>
      <li>
        <a className="" href="/achievements">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12.3789H20M19.071 19.45L17.6567 18.0358M4 12.3789H2M6.34292 6.72207L4.92871 5.30786M12 4.37891V2.37891M17.6567 6.72207L19.071 5.30786M12 22.3789V20.3789M4.92871 19.45L6.34292 18.0358M12 7.37891L13.545 10.5089L17 11.0139L14.5 13.4489L15.09 16.8889L12 15.2639L8.91 16.8889L9.5 13.4489L7 11.0139L10.455 10.5089L12 7.37891Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Achievements </span>
        </a>
      </li>
      <li>
        <a className="" href="/profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg> 
          <span>Profile </span>
        </a>
      </li>
      <div className="style_sideFoot__l4hez">
        <a target="_blank" className="style_button__D_Zxp d-md" href="https://blockdag.network/">
          <span>blockdag.network</span>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 7.5L7.5 17.5M7.5 17.5H17.5M7.5 17.5V7.5" stroke="currentColor" strokeWidth="2.20542" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </a>
        <div className="style_profileBox__OgRkH">
          <p className="style_text__Z44aT style_md__ZQhe4 style_currentRank__UE4lp">Your Current Rank</p>
          <div className="style_rank__6tJax">
            <img alt="Crab" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" className="style_rankImg__mh24N" style={{color:"transparent"}} src="https://purchase3.blockdag.network/favicon.png" />
            <span className="style_text__Z44aT style_md__ZQhe4 style_rankText__pq6dx">No Rank</span>
          </div>
        </div>
      </div>
    </ul>
  </div>
  )
}

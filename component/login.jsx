'use client'
import React, { useEffect, useState } from 'react'
import ConnectOnly from './ConnectOnly';

export const Login = () => {

  const [position, setPosition] = useState({ x: 395, y: 25 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // const [sheetData, setSheetData] = useState([]);

  // const getData =() => {
  //   fetch('/api/sheet')
  //     .then(res => res.json())
  //     .then(data => setSheetData(data));
  // };

  // console.log({sheetData});
  return (
     <div className="login_login__J2ObG __className_ee1788 modalActive">
  <div className="login_loginBox___rC_f">
    <div className="login_logo__vPwTd">
      <span className="logo_logo__cZ2yZ login_logoImg__DF9Mz">
        <img alt="BlockDAG Logo" loading="lazy" width="163" height="41" decoding="async" data-nimg="1" className="darkorlight dark-mode-visible" src="https://purchase3.blockdag.network/bdag-logo-xl.png" style={{ color: "transparent" }} />
        <img alt="BlockDAG Logo" loading="lazy" width="163" height="41" decoding="async" data-nimg="1" className="darkorlight light-mode-visible" src="https://purchase3.blockdag.network/bdag-logo-xl.png" style={{ color: "transparent" }} />
      </span>
      <img alt="BlockDAG Verified" loading="lazy" width="32" height="32" decoding="async" data-nimg="1" className="login_verified__syDJW" src="https://purchase3.blockdag.network/verified.png" style={{ color: "transparent" }} />
    </div>
    <h1>Welcome to BlockDAG Dashboard</h1>
    <p className="style_text__Z44aT style_md__ZQhe4">To reach dashboard connect your wallet first!</p>
    <div className="login_buttons__sptOO">
      <a className="style_button__C9H72 style_transparent-dark__hThHh" href="/">
        Go Home<span className="style_wrap__yFGLp"></span>
      </a>
      {/* <button onClick={getData} className="style_button__C9H72 style_primary__FoPQF">
        Connect Wallet<span className="style_wrap__yFGLp"></span>
      </button> */}
      <ConnectOnly />
    </div>
  </div>
  <div className="login_overlay__2wnae" 
  style={{
    position: 'fixed',
    left: position.x,
    top: position.y,
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)', 
      }}
  ></div>
  <div className="login_bg__t9gTO">
    <span className="logo_logo__cZ2yZ login_bgLogo__6YCSU">
      <img alt="BlockDAG Logo" loading="lazy" width="1630" height="410" decoding="async" data-nimg="1" className="darkorlight dark-mode-visible" src="https://purchase3.blockdag.network/bdag-logo-xl.png" style={{ color: "transparent" }} />
      <img alt="BlockDAG Logo" loading="lazy" width="1630" height="410" decoding="async" data-nimg="1" className="darkorlight light-mode-visible" src="https://purchase3.blockdag.network/bdag-logo-xl.png" style={{ color: "transparent" }} />
    </span>
  </div>
</div>
  )
}

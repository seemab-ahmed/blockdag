import React from 'react';

const BeatVestingModal = ({ onClose }) => {
  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    // Close only if clicking directly on the overlay background
    if (e.target === e.currentTarget || e.target.classList.contains('modal_StyledOverlayClose__4o6fb')) {
      onClose?.();
    }
  };

  return (
    <div id="modal-root" className="__className_ee1788">
      <div 
        className="modal_ModalOverlay__K1uoH modal_register__vj0e5" 
        onClick={handleOverlayClick}
      >
        <div 
          className="modal_StyledOverlayClose__4o6fb modal_register__vj0e5"
          onClick={handleOverlayClick}
        ></div>
        <div className="modal_StyledModal__sHsFE">
          <div className="modal_StyledModalBody__cmbvZ modalhere">
             <div 
              className="modal_StyledCloseIcon__zqnAj" 
              onClick={handleClose}
              style={{ cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="style_doubleupPopup__hLys3">
              <div className="style_head__R1ASv">
                BEAT VESTING!
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M18 6L6 18M6 6L18 18" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </div>
              <img 
                alt="BlockDAG" 
                loading="lazy" 
                width="90" 
                height="90" 
                decoding="async" 
                className="style_gif__2rpWn" 
                src="https://purchase3.blockdag.network/bdag.gif" 
                style={{ color: "transparent" }} 
              />
              <p className="style_title___arg6 __className_665d18">
                BlockDAG<br />🎟 <span>BEAT VESTING — LIVE NOW! PRESALE FINISHING</span>
              </p>
              <p className="style_countdown__hv24i">Limited Time</p>
              <p className="style_note__ZKONY">
                Every buyer who purchases BDAG at <b> $0.0016</b> gets ⚡ <b>100%</b> of coins unlocked on DAY 1 of Launch! <br />
                (Skip the usual 40% — this is your fast track to the moon.)
              </p>
              <p className="style_note__ZKONY">⏳ Act now&nbsp;or&nbsp;miss&nbsp;out.</p>
              <div className="style_btns__BAOLE">
                <a className="style_button__C9H72 style_primary__FoPQF" href="/dashboard">
                  JOIN NOW<span className="style_wrap__yFGLp"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatVestingModal;
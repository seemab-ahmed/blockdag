import React from 'react';

const Popup = ({ message, title }) => {
  return (
     <div id="modal-root" className="__className_ee1788">
          <div 
            className="modal_ModalOverlay__K1uoH modal_register__vj0e5" 
          >
            <div 
              className="modal_StyledOverlayClose__4o6fb modal_register__vj0e5"
            ></div>
            <div className="modal_StyledModal__sHsFE">
              <div className="modal_StyledModalBody__cmbvZ modalhere">
                 <div 
                  className="modal_StyledCloseIcon__zqnAj" 
                 
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
                    {title}
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
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Popup;
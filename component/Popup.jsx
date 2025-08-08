import React from "react";

const Popup = ({ message, title, onClose, type }) => {
  // Prevent click inside modal from closing
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      id="modal-root"
      className="__className_ee1788"
      style={{ zIndex: 9999, position: "fixed", inset: 0 }}
    >
      <div
        className="modal_ModalOverlay__K1uoH modal_register__vj0e5"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      >
        <div
          className="modal_StyledOverlayClose__4o6fb modal_register__vj0e5"
          style={{ position: "absolute", inset: 0, zIndex: 9999 }}
        ></div>
        <div
          className="modal_StyledModal__sHsFE"
          onClick={handleModalClick}
          style={{ position: "relative", zIndex: 10000 }}
        >
          <div className="modal_StyledModalBody__cmbvZ modalhere">
            <div
              className="modal_StyledCloseIcon__zqnAj"
              style={{ cursor: "pointer", zIndex: 99999 }}
              onClick={onClose}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                {title && title}
                <span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
              {type === "paymenterror" ? (
                <>
                  <img
                    alt="waiting"
                    loading="lazy"
                    width={125}
                    height={125}
                    decoding="async"
                    className="statusPopup_waitingImg___AFKu"
                    src="https://purchase3.blockdag.network/images/failed.png"
                    style={{ color: "transparent" }}
                  />
                </>
              ) : type === "paymentloading" ? (
                <>
                  <img
                    alt="waiting"
                    loading="lazy"
                    width={125}
                    height={125}
                    decoding="async"
                    className="statusPopup_waitingImg___AFKu"
                    src="https://purchase3.blockdag.network/images/waiting.png"
                    style={{ color: "transparent" }}
                  />
                </>
              ) : type === "success" ? (
                
                <>
                <img
                    alt="waiting"
                    loading="lazy"
                    width={125}
                    height={125}
                    decoding="async"
                    className="statusPopup_waitingImg___AFKu"
                    src="https://purchase3.blockdag.network/images/success.png"
                    style={{ color: "transparent" }}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
              <p className="style_title___arg6 __className_665d18">
                {type === "paymenterror" ? (
                  <>Transaction Failed!</>
                ) : type === "paymentloading" ? (
                  <>Pending Action ...</>
                ) : type === "success" ? (
                  <>Payment Successfully Transfered !</>
                ) : (
                  <>{message}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;

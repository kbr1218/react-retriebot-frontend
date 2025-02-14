// watch_now.jsx
import React, { useEffect, useState } from "react";
import styles from "./watchNow.module.css";

const WatchNowModal = ({ isOpen, onClose, selectedMovie, socket }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const handlePurchase = () => {
    if (!selectedMovie || !socket || socket.readyState !== WebSocket.OPEN) {
      console.error("---웹소켓이 연결되지 않았거나 선택된 영화 정보가 없음");
      return;
    }

    // 시청 요청 데이터 생성
    const WatchNowPayload = {
      event: "watch_now",
      asset_id: selectedMovie.asset_id,
    }
    // 웹소켓 요청 전송
    socket.send(JSON.stringify(WatchNowPayload));
    console.log(">>>>>> 시청 요청 전송: ", WatchNowPayload);
    
    onClose();
  };

  useEffect(() => {
    if (!socket) return;

    // 서버 응답 처리
    const handleSocketMessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log(">>>>>> 서버 응답 수신:", response);

        if (response.message) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else if (response.error) {
          setShowError(true);
          setTimeout(() => setShowError(false), 5000);
        }
      } catch (error) {
        console.error(">>>>>> 서버 응답 처리 오류:", error);
      }
    };
    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);

  if (!isOpen) return null;

  return (
    <>
      {/* 모달 배경 */}
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>📢 시청하시려면 구매하셔야 합니다.<br />구매하시겠습니까?</p>
          <div className={styles.modalButtons}>
            <button className={styles.buyBtn} onClick={handlePurchase}>구매</button>
            <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          </div>
        </div>
      </div>

      {/* 구매 완료 메시지 */}
      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successBox}> 구매가 완료되었습니다. </div>
        </div>
      )}

      {/* 시청 기록 저장 실패 메시지 */}
      {showError && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorBox}>
            오류가 발생했습니다. 다시 시도해주세요.
          </div>
        </div>
      )}      
    </>
  );
};

export default WatchNowModal;

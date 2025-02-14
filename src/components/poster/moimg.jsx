// moimg.jsx
import React, { useState } from "react";
import styles from "./img.module.css";
import WatchNowModal from "../../modal/watch_now";

const Moimg = ({ selectedMovie, socket, isWaitingForResponse  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!selectedMovie) {
    return null;
  }

  // 포스터 이미지 URL 설정
  const posterUrl = selectedMovie.poster_path
    ? selectedMovie.poster_path.startsWith("http")
      ? selectedMovie.poster_path
      : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
    : null;

  return (
    <>
    <div className={styles.poster_container}>
      {selectedMovie.poster_path? (
        <img
          src={posterUrl}
          alt={selectedMovie.title}
          className={styles.poster_img}
        />
      ) : (
        <div className={styles.poster_placeholder}>
          {selectedMovie.title}
        </div>
      )}
      <button className={styles.watch_btn}
        onClick={() => setIsModalOpen(true)}
        disabled={isWaitingForResponse}>
        시청하기
      </button>
    </div>

      {/* 시청하기 모달 */}
      <WatchNowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedMovie={selectedMovie}
        socket={socket} 
      />
    </>
  );
};

export default Moimg;

// movie_background.jsx
import React from "react";
import styles from "./movieBackground.module.css";

const MovieBackground = ({ selectedMovie }) => {
  return (
    <div 
      className={styles.background}
      style={{
        backgroundImage: selectedMovie?.backdrop_path
        ? `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
        : "none"
      }}
    >
      {/* 전체적으로 어두운 배경을 적용할 오버레이 */}
      <div className={styles.darkOverlay}></div>
      {/* 배경이 적용된 상태에서 그라데이션 오버레이 추가 */}
      <div className={styles.overlay}></div>
    </div>
  );
};

export default MovieBackground;

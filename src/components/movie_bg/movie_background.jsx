// movie_background.jsx
import React from "react";
import styles from "./movieBackground.module.css";

const MovieBackground = ({ selectedMovie }) => {
  if (!selectedMovie) return null;

  // 배경 이미지 URL 설정 (backdrop_path > poster_path 우선순위)
  let backgroundUrl = "none";

  if (selectedMovie.backdrop_path) {
    backgroundUrl = selectedMovie.backdrop_path.startsWith("http")
      ? selectedMovie.backdrop_path
      : `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`;
  }

  return (
    <div 
      className={styles.background}
      style={{
        backgroundImage: backgroundUrl !== "none" ? `url(${backgroundUrl})` : "none" }}
    >
      {/* 전체적으로 어두운 배경을 적용할 오버레이 */}
      <div className={styles.darkOverlay}></div>
      {/* 배경이 적용된 상태에서 그라데이션 오버레이 추가 */}
      <div className={styles.overlay}></div>
    </div>
  );
};

export default MovieBackground;

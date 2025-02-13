// moimg.jsx
import React from "react";
import styles from "./img.module.css";

const Moimg = ({ selectedMovie }) => {
  if (!selectedMovie) {
    return null;
  }

  // 포스터 이미지 URL 설정
  const posterUrl = selectedMovie.poster_path?.startsWith("http")
    ? selectedMovie.poster_path
    : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`;

  return (
    <div class={styles.poster_container}>
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
      <button className={styles.watch_btn}>시청하기</button>
    </div>
  );
};

export default Moimg;

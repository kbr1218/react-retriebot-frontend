// moimg.jsx
import React from "react";
import styles from "./img.module.css";

const Moimg = ({ selectedMovie }) => {
  if (!selectedMovie) {
    return null;
  }

  return (
    <div class={styles.poster_container}>
      {selectedMovie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
          alt={selectedMovie.title}
          className={styles.poster_img}
        />
      )}
      <button className={styles.watch_btn}>시청하기</button>
    </div>
  );
};

export default Moimg;

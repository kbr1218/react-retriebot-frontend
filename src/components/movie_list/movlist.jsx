// movlist.jsx
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useState } from "react";
import styles from "./molist.module.css";


const Movierec = ({ movie_list, onMovieSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // `movie_list`가 배열인지 확인 후 변환
  const movies = Array.isArray(movie_list) && movie_list.length > 0
  ? movie_list.slice(0, 5)
  : [];

  useEffect(() => {
    if (movies.length > 0 && selectedIndex === null) {
      setSelectedIndex(0);        // 첫번째 영화를 미리 선택해놓음
      onMovieSelect(movies[0])
    }
  }, [movies, onMovieSelect, selectedIndex]);


  const handlePosterClick = (index) => {
    setSelectedIndex(index);
    onMovieSelect(movies[index]);
  };

  return (
    <div className={styles.movie_recommendation}>
      <div className={styles.box_container}>
        {/* 영화가 있을 때만 버튼 표시 */}
        {movies.length > 0 && (
          <button className={`${styles.btn_left} ${styles.show}`}>
            <IoIosArrowBack />
          </button>
        )}

        {movies.length > 0 && (
          movies.map((movie, index) => (
            <div
              key={movie.asset_id || index}
              className={`${styles.box} ${selectedIndex === index ? styles.selected : ""}`}
              onClick={() => handlePosterClick(index)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* 포스터 이미지 출력 */}
              {movie.poster_path ? (
                <img
                  src={movie.poster_path?.startsWith("http")
                    ? movie.poster_path
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || "영화 포스터"}
                  className={styles.poster_path}
                />
              ) : (
                <div className={styles.poster_placeholder}>
                  {movie.title}
                </div>
              )}
            </div>
          ))
        )}

        {/* 영화가 있을 때만 버튼 표시 */}
        {movies.length > 0 && (
          <button className={`${styles.btn_right} ${styles.show}`}>
            <IoIosArrowForward />
          </button>
        )}
      </div>
    </div>
  );
};

export default Movierec;

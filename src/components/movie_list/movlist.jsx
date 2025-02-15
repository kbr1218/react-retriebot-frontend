// movlist.jsx
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect, useState } from "react";
import styles from "./molist.module.css";


const Movierec = ({ movie_list, onMovieSelect, isModalOpen }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // `movie_list`가 배열인지 확인 후 변환
  const movies = Array.isArray(movie_list) && movie_list.length > 0
  ? movie_list.slice(0, 5)
  : [];

  useEffect(() => {
    if (movies.length > 0) {
      setSelectedIndex(0);        // 첫번째 영화를 미리 선택해놓음
      onMovieSelect(movies[0])
    }
  }, [movie_list]);


  const handlePosterClick = (index) => {
    if (isModalOpen) return;        // 모달이 열려 있으면 선택 불가
    setSelectedIndex(index);
    onMovieSelect(movies[index]);
  };

  // 왼쪽 버튼 클릭 시 이동
  const handleLeftClick = () => {
    if (movies.length === 0) return;
    const newIndex = selectedIndex === 0 ? movies.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    onMovieSelect(movies[newIndex]);
  };

  // 오른쪽 버튼 클릭 시 이동
  const handleRightClick = () => {
    if (movies.length === 0) return;
    const newIndex = selectedIndex === movies.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    onMovieSelect(movies[newIndex]);
  };

  return (
    <div className={`${styles.movie_recommendation} ${isModalOpen ? styles.modalActive : ""}`}>
      <div className={styles.box_container}>
        {/* 영화가 있을 때만 버튼 표시 */}
        {movies.length > 0 && (
          <button className={`${styles.btn_left} ${styles.show}`}
                  disabled={isModalOpen}
                  onClick={handleLeftClick}>
            <IoIosArrowBack />
          </button>
        )}

        {movies.length > 0 && (
          movies.map((movie, index) => (
            <div
              key={movie.asset_id}
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
          <button className={`${styles.btn_right} ${styles.show}`}
                  disabled={isModalOpen}
                  onClick={handleRightClick}>
            <IoIosArrowForward />
          </button>
        )}
      </div>
    </div>
  );
};

export default Movierec;

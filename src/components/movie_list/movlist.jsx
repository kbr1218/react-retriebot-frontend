/*import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useState } from "react";
import styles from "./molist.module.css";

const Movierec = ({ response = [], onMovieSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // response가 배열이 아닐 경우 빈 배열 반환하고, 최대 5개로 제한
  const movies = Array.isArray(response) ? response.slice(0, 5) : [];

  const handlePosterClick = (index) => {
    setSelectedIndex(index);
    onMovieSelect(movies[index]);
  };

  // 영화가 없을 때는 랜더링 x
  if (movies.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.box_container}>
        <button className={styles.btn_left}>
          <IoIosArrowBack />
        </button>

        {movies.map((movie, index) => (
          <div
            key={movie.asset_id || index}
            className={`${styles.box} ${selectedIndex === index ? styles.selected : ""}`}
            onClick={() => handlePosterClick(index)}
          >
            <span className={styles.num}>{index + 1}</span>
            <img
              src={`//image.tmdb.org/t/p/original${movie.poster_path}`}
              //alt={movie.title || '영화 포스터'}
              className={styles.poster_path}
            />
          </div>
        ))}

        <button className={styles.btn_right}>
          <IoIosArrowForward />
        </button>
      </div>
      <button className={styles.restart_btn}>다시 추천하기</button>
    </>
  );
}
export default Movierec;
*/

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useState } from "react";
import styles from "./molist.module.css";

const Movierec = ({ response = [], onMovieSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // response가 배열이 아닐 경우 빈 배열 반환하고, 최대 5개로 제한
  const movies = Array.isArray(response) ? response.slice(0, 5) : [];

  const handlePosterClick = (index) => {
    setSelectedIndex(index);
    onMovieSelect(movies[index]);
  };

  // 기본 이미지 URL 설정
  const defaultPoster = "https://via.placeholder.com/300x450?text=No+Image";

  // 영화가 없을 때는 랜더링 x
  if (movies.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.box_container}>
        <button className={styles.btn_left}>
          <IoIosArrowBack />
        </button>

        {movies.map((movie, index) => (
          <div
            key={movie.asset_id || index}
            className={`${styles.box} ${selectedIndex === index ? styles.selected : ""}`}
            onClick={() => handlePosterClick(index)}
          >
            {/*<span className={styles.num}>{index + 1}</span> */}
            
            <img
              src={movie.poster_path ? `//image.tmdb.org/t/p/original${movie.poster_path}` : defaultPoster}
              alt={movie.title || "영화 포스터"}
              className={styles.poster_path}
            />
          </div>
        ))}

        <button className={styles.btn_right}>
          <IoIosArrowForward />
        </button>
      </div>
      <button className={styles.restart_btn}>다시 추천하기</button>
    </>
  );
};

export default Movierec;

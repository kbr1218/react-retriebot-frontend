import styles from "./img.module.css";

const Moimg = ({ response  }) => {
  if (!response) {
    return null;
  }

  return (
    <>
      {response.backdrop_path && (
        <div className={styles.backdrop_path}>
          <img
            src={`//image.tmdb.org/t/p/original${response.backdrop_path}`}
            //alt="영화 배경"
          />
        </div>
      )}
      
      {response.poster_path && (
        <div className={styles.poster_path}>
          <img
            src={`//image.tmdb.org/t/p/original${response.poster_path}`}
            //alt="영화 포스터"
          />
        </div>
      )}
    </>
  );
};

export default Moimg;

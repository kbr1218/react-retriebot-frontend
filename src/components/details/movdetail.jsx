// movdetail.jsx
import React, { useState, useEffect } from "react";
import styles from "./dtail.module.css";

const Mdetail = ({ selectedMovie }) => {
  const [showFullOverview, setShowFullOverview] = useState(false); // 줄거리 확장 상태

  // "더보기" 상태
  useEffect(() => {
    setShowFullOverview(false);
  }, [selectedMovie]);

  // 선택된 영화가 없으면 아무것도 렌더링하지 않음
  if (!selectedMovie) {
    return null;
  }

  // 전체 화면을 감싸는 overlay 클릭 시 원래 상태로 이동
  const handleOverlayClick = () => {
    setShowFullOverview(false)
  }

  // 개봉일 포맷
  const formattedReleaseDate = selectedMovie?.release_year
    ? selectedMovie.release_month && selectedMovie.release_day
      ? `${selectedMovie.release_year}-${selectedMovie.release_month.toString().padStart(2, "0")}-${selectedMovie.release_day.toString().padStart(2, "0")}`
      : `${selectedMovie.release_year}`
    : "-";


  // 상영 시간을 "n시간 n분" 형식으로 변환
  const formatRuntime = (minutes) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  // 평점 소수점 둘째 자리 반올림
  const formatVoteAverage = (vote) => {
    return vote ? vote.toFixed(2) : "-";
  };

  const truncateActors = (actors) => {
    if (!actors) return "-";
    return actors.length > 40 ? `${actors.slice(0, 40)}...` : actors;
  };

  // 영화 정보가 없다면 "-" 반환
  const getVaildData = (value) => (value ? value: "-");

  return (
    <>
      {/* 전체화면 오버레이 (더보기 버튼 눌렀을 때) */}
      {showFullOverview && (
        <div className={styles.full_screen_overlay} onClick={() => setShowFullOverview(false)}></div>
      )}

      <div className={`${styles.m_container} ${showFullOverview ? styles.full_screen_overlay_active : ""}`}>
      {/* 영화 제목 및 추가 정보 (출시 연도, 원제, 장르) */}
        <div className={styles.title_container}>
          <div className={styles.title}>{getVaildData(selectedMovie?.title)}</div>
          <div className={styles.sub_info}>
            <span>{getVaildData(selectedMovie?.release_year)}</span>  |  
            <span>{getVaildData(selectedMovie?.original_title)}</span>  |
            <span>{getVaildData(selectedMovie?.genre)}</span>
          </div>
        </div>

        {/* 본문 내용 (줄거리 및 기타 정보) */}
        <div className={styles.overview}>
          <p>
          {showFullOverview || selectedMovie?.overview.length <= 150 ? (
            selectedMovie?.overview
          ) : (
            <>
              {selectedMovie?.overview.slice(0, 100)}...
              <button
                className={styles.readmore_btn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullOverview(true);
                }}
              >
                ...더보기
              </button>
            </>
          )}
          </p>
        </div>

      <div className={styles.info_box}>
          <div>개봉일: {formattedReleaseDate}</div>
          <div>상영 시간: {formatRuntime(selectedMovie?.runtime)}</div>
          <div>감독: {getVaildData(selectedMovie?.director)}</div>
          <div>출연: {truncateActors(selectedMovie?.actors)}</div>
          <div>평점: {formatVoteAverage(selectedMovie?.vote_average)}</div>
          <div>제작 국가: {getVaildData(selectedMovie?.orgnl_cntry)}</div>
          <div>언어: {getVaildData(selectedMovie?.original_language)}</div>
        </div>
      </div>
    </>
  );
};

export default Mdetail;

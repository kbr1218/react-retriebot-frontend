import React, { useState, useEffect, useRef } from "react";
import styles from "./dtail.module.css";

const Mdetail = ({ response }) => {
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 상태
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showFullOverview, setShowFullOverview] = useState(false); // 줄거리 확장 상태
  const socketRef = useRef(null);

  // WebSocket 연결 설정
  useEffect(() => {
    socketRef.current = new WebSocket("ws://192.168.0.159:8001/user000001/chat");

    socketRef.current.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && Array.isArray(data.movies)) {
          setMovies(data.movies); // 영화 추천 데이터 설정
          setSelectedMovie(data.movies[0]); // 첫 번째 영화 선택
        }
      } catch (error) {
        console.error("WebSocket 데이터 처리 오류:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // 초기 response 처리
  useEffect(() => {
    if (response && Array.isArray(response) && response.length > 0) {
      setMovies(response); // 추천된 영화 배열 업데이트
      setSelectedMovie(response[0]); // 첫 번째 영화를 선택
    }
  }, [response]);

  // 포스터 클릭 핸들러
  const handlePosterClick = (movie) => {
    setSelectedMovie(movie); // 선택된 영화 상태 업데이트
    setShowFullOverview(false); // 다른 영화를 클릭하면 줄거리 축소
  };

  const handleWatchNow = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && selectedMovie) {
      const jsonData = {
        event: "watch_now",
        asset_id: selectedMovie.asset_id,
        runtime: selectedMovie.runtime,
      };
      socketRef.current.send(JSON.stringify(jsonData));

      setPurchaseMessage("구매 완료!");
      setTimeout(() => setPurchaseMessage(""), 3000);
      setShowPopup(false);
    } else {
      console.log("WebSocket이 열려 있지 않거나 선택된 영화 데이터가 없습니다.");
    }
  };

  const handleDontBuy = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const Popup = ({ handleWatchNow, handleDontBuy }) => (
    <div className={styles.popup}>
      <div className={styles.popup_content}>
        <p>
          시청하시려면 구매를 하셔야 합니다.
          <br />
          구매하시겠습니까?
        </p>
        <div className={styles.popup_buttons}>
          <button onClick={handleWatchNow}>구매</button>
          <button onClick={handleDontBuy}>취소</button>
        </div>
      </div>
    </div>
  );

  const PurchaseMessage = ({ message }) => (
    <div className={styles.popup}>
      <div className={styles.popup_content}>
        <p>{message}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.m_container}>
      {movies.length > 0 ? (
        <>
          {/* 선택된 영화 정보 출력 */}
          <h1 className={styles.name}>{selectedMovie?.title}</h1>

          {/* 줄거리 부분 */}
          <div className={styles.overview}>
            {showFullOverview || selectedMovie?.overview.length <= 150 ? (
              <p>{selectedMovie?.overview}</p>
            ) : (
              <>
                <p>{selectedMovie?.overview.slice(0, 100)}...</p>
                <button
                  className={styles.readmore_btn}
                  onClick={() => setShowFullOverview(true)}
                >
                  더보기
                </button>
              </>
            )}
          </div>

          <div className={styles.info_box}>
            <div className={styles.group}>
              <div className={styles.release_date}>
                <strong>날짜:</strong> {selectedMovie?.release_day}
              </div>
              <div className={styles.original_language}>
                <strong>언어:</strong> {selectedMovie?.original_language}
              </div>
              <div className={styles.genre}>
                <strong>장르:</strong> {selectedMovie?.genre}
              </div>
              <div className={styles.popularity}>
                <strong>인기:</strong> {selectedMovie?.popularity}
              </div>
              <div className={styles.original_title}>
                <strong>원래 제목:</strong> {selectedMovie?.original_title}
              </div>
              <div className={styles.orgnl_cntry}>
                <strong>국가:</strong> {selectedMovie?.orgnl_cntry}
              </div>
            </div>

            <div className={styles.group2}>
              <div className={styles.director}>
                <strong>감독:</strong> {selectedMovie?.director}
              </div>
              <div className={styles.runtime}>
                <strong>상영 시간:</strong> {selectedMovie?.runtime}분
              </div>
              <div className={styles.vote_average}>
                <strong>평점:</strong> {selectedMovie?.vote_average}
              </div>
              <div className={styles.vote_count}>
                <strong>투표 수:</strong> {selectedMovie?.vote_count}
              </div>
              <div className={styles.actor_disp}>
                <strong>출연 배우:</strong> {selectedMovie?.actors}
              </div>
            </div>
          </div>

          <button className={styles.watch_btn} onClick={handleOpenPopup}>Watch now</button>

          {purchaseMessage && <PurchaseMessage message={purchaseMessage} />}

          {showPopup && <Popup handleWatchNow={handleWatchNow} handleDontBuy={handleDontBuy} />}

          {/* 포스터 목록 */}
          <div className={styles.poster_container}>
            {movies.map((movie) => (
              <img
                key={movie.asset_id}
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                className={`${styles.poster} ${
                  selectedMovie?.asset_id === movie.asset_id ? styles.selected : ""
                }`}
                onClick={() => handlePosterClick(movie)} // 클릭 이벤트
              />
            ))}
          </div>
        </>
      ) : (
        <p className={styles.wait_message}></p> 
      )}
    </div>
  );
};
export default Mdetail;


/*import React, { useState, useEffect, useRef } from "react";
import styles from "./dtail.module.css";

const Mdetail = ({ response }) => {
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화 상태
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [movies, setMovies] = useState([]);
  const socketRef = useRef(null);

  // WebSocket 연결 설정
  useEffect(() => {
    socketRef.current = new WebSocket("ws://192.168.0.159:8001/user000001/chat");

    socketRef.current.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && Array.isArray(data.movies)) {
          setMovies(data.movies); // 영화 추천 데이터 설정
          setSelectedMovie(data.movies[0]); // 첫 번째 영화 선택
        }
      } catch (error) {
        console.error("WebSocket 데이터 처리 오류:", error);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // 초기 response 처리
  useEffect(() => {
    if (response && Array.isArray(response) && response.length > 0) {
      setMovies(response); // 추천된 영화 배열 업데이트
      setSelectedMovie(response[0]); // 첫 번째 영화를 선택
    }
  }, [response]);

  // 포스터 클릭 핸들러
  const handlePosterClick = (movie) => {
    setSelectedMovie(movie); // 선택된 영화 상태 업데이트
  };

  const handleWatchNow = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && selectedMovie) {
      const jsonData = {
        event: "watch_now",
        asset_id: selectedMovie.asset_id,
        runtime: selectedMovie.runtime,
      };
      socketRef.current.send(JSON.stringify(jsonData));

      setPurchaseMessage("구매 완료!");
      setTimeout(() => setPurchaseMessage(""), 3000);
      setShowPopup(false);
    } else {
      console.log("WebSocket이 열려 있지 않거나 선택된 영화 데이터가 없습니다.");
    }
  };

  const handleDontBuy = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const Popup = ({ handleWatchNow, handleDontBuy }) => (
    <div className={styles.popup}>
      <div className={styles.popup_content}>
        <p>
          시청하시려면 구매를 하셔야 합니다.
          <br />
          구매하시겠습니까?
        </p>
        <div className={styles.popup_buttons}>
          <button onClick={handleWatchNow}>구매</button>
          <button onClick={handleDontBuy}>취소</button>
        </div>
      </div>
    </div>
  );

  const PurchaseMessage = ({ message }) => (
    <div className={styles.popup}>
      <div className={styles.popup_content}>
        <p>{message}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.m_container}>
      {movies.length > 0 ? (
        <>
          //선택된 영화 정보 출력 
          <h1 className={styles.name}>{selectedMovie?.title}</h1>
          <p className={styles.overview}>{selectedMovie?.overview}</p>

          <div className={styles.info_box}>
            <div className={styles.group}>
              <div className={styles.release_date}>
                <strong>날짜:</strong> {selectedMovie?.release_day}
              </div>
              <div className={styles.original_language}>
                <strong>언어:</strong> {selectedMovie?.original_language}
              </div>
              <div className={styles.genre}>
                <strong>장르:</strong> {selectedMovie?.genre}
              </div>
              <div className={styles.popularity}>
                <strong>인기:</strong> {selectedMovie?.popularity}
              </div>
              <div className={styles.original_title}>
                <strong>원래 제목:</strong> {selectedMovie?.original_title}
              </div>
              <div className={styles.orgnl_cntry}>
                <strong>국가:</strong> {selectedMovie?.orgnl_cntry}
              </div>
            </div>

            <div className={styles.group2}>
              <div className={styles.director}>
                <strong>감독:</strong> {selectedMovie?.director}
              </div>
              <div className={styles.runtime}>
                <strong>상영 시간:</strong> {selectedMovie?.runtime}분
              </div>
              <div className={styles.vote_average}>
                <strong>평점:</strong> {selectedMovie?.vote_average}
              </div>
              <div className={styles.vote_count}>
                <strong>투표 수:</strong> {selectedMovie?.vote_count}
              </div>
              <div className={styles.actor_disp}>
                <strong>출연 배우:</strong> {selectedMovie?.actors}
              </div>
            </div>
          </div>

          <button className={styles.watch_btn} onClick={handleOpenPopup}>Watch now</button>

          {purchaseMessage && <PurchaseMessage message={purchaseMessage} />}

          {showPopup && <Popup handleWatchNow={handleWatchNow} handleDontBuy={handleDontBuy} />}

          //포스터 목록 
          <div className={styles.poster_container}>
            {movies.map((movie) => (
              <img
                key={movie.asset_id}
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                className={`${styles.poster} ${
                  selectedMovie?.asset_id === movie.asset_id ? styles.selected : ""
                }`}
                onClick={() => handlePosterClick(movie)} // 클릭 이벤트
              />
            ))}
          </div>
        </>
      ) : (
        <p className={styles.wait_message}></p>  // 여기 추천 기다리는 중 지웠습니다요
      )}
    </div>
  );
};
export default Mdetail;
*/


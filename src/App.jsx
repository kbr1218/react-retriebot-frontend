// App.jsx
import React, { useState } from "react"; 
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Chat from './components/chatbot/chat';
import Mdetail from './components/details/modetail';
import Movierec from './components/movie_list/movlist';
import Moimg from './components/poster/moimg';

import './App.css';

function App() {
    // 추천 영화 목록을 저장할 상태
    const [movies, setMovies] = useState([]);
    // 선택된 영화 정보를 저장할 상태
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Chat에서 받은 영화 추천 데이터를 저장하는 함수
    const onMovieRecommendation = (responseData) => {
        console.log("📩 Chat에서 전달받은 영화 데이터 (app.jsx):", responseData);

        // setResponse(responseData); // 서버 응답을 받아 상태에 저장
        if (Array.isArray(responseData) && responseData.length > 0) {
            setMovies(responseData);
          } else {
            console.warn("🚨 잘못된 영화 데이터 형식:", responseData);
          }
    };

    // 영화 선택 시 호출되는 함수
    const onMovieSelect = (movie) => {
        setSelectedMovie(movie); // 선택된 영화 정보를 상태에 저장
    };

    return (
        <Router>
            <Routes>
                <Route path="/:user_id" element={
                    <div className="container">
                        {/* 왼쪽 채팅 화면 */}
                        <div className="chats_part">
                            <Chat onMovieRecommendation={onMovieRecommendation} />
                        </div>

                        {/* 오른쪽 영화 정보 화면 */}
                        <div className="movie_info_part">
                            <div className="detail_part">
                                <Mdetail />
                            </div>

                            {/*  선택된 영화의 포스터 */}
                            <div className="moimg_part">
                                <Moimg response={selectedMovie} />
                            </div>

                            {/* 영화 추천 목록 (movlist) => 가장 하단으로 이동 */}
                            <div className="movie_part">
                                <Movierec movie_list={movies} onMovieSelect={setSelectedMovie} />
                            </div>

                        </div>
                    </div>
                }/>
            </Routes>
        </Router>
    );
}

export default App;

// App.jsx
import React, { useEffect, useState } from "react"; 
import { Route, Routes, useParams } from 'react-router-dom';
import Chat from './components/chatbot/chat';
import Mdetail from './components/details/movdetail';
import Movierec from './components/movie_list/movlist';
import Moimg from './components/poster/moimg';
import MovieBackground from "./components/movie_bg/movie_background";
import WatchNowModal from "./modal/watch_now";

import './App.css';

function AppWrapper() {
    const { user_id } = useParams();
    return <App user_id={user_id} />;
}

function App( {user_id} ) {
    // 추천 영화 목록을 저장할 상태
    const [movies, setMovies] = useState([]);
    // 선택된 영화 정보를 저장할 상태
    const [selectedMovie, setSelectedMovie] = useState(null);
    // watch now 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 로딩 상태 (버튼 못 누르게)
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    // 웹소켓
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user_id) return;

        const serverUrl = `ws://localhost:8001/${user_id}/chat`;
        const ws = new WebSocket(serverUrl);
        setSocket(ws);

        ws.onopen = () => console.log(`>>>>>> 웹소켓 연결 성공: ${serverUrl}`);
        ws.onmessage = (event) => console.log(">>>>>> 메시지 수신:", event.data);
        ws.onerror = (error) => console.error(">>>>>> 웹소켓 에러:", error);
        ws.onclose = () => console.log(">>>>>> 웹소켓 연결 종료");

        return () => ws.close();
    }, [user_id]);

    // Chat에서 받은 영화 추천 데이터를 저장하는 함수
    const onMovieRecommendation = (responseData) => {
        console.log("📩 Chat에서 전달받은 영화 데이터 (app.jsx):", responseData);

        if (Array.isArray(responseData) && responseData.length > 0) {
            setMovies(responseData);
            setSelectedMovie(responseData[0]);
          } else {
            console.warn("🚨 잘못된 영화 데이터 형식:", responseData);
          }
    };

    // 영화 선택 시 호출되는 함수
    const onMovieSelect = (movie) => {
        if (!isModalOpen) {
            setSelectedMovie(movie); // 선택된 영화 정보를 상태에 저장
        }
    };

    return (
        <Routes>
            <Route path="/:user_id" element={<AppWrapper />} />
                <Route path="/" element={
                    <div className="container">
                        {/* 왼쪽 채팅 화면 */}
                        <div className="chats_part">
                            <Chat onMovieRecommendation={onMovieRecommendation}
                            socket={socket}
                            isWaitingForResponse={isWaitingForResponse}
                            setIsWaitingForResponse={setIsWaitingForResponse}/>
                        </div>

                        {/* 오른쪽 영화 정보 화면 */}
                        <div className="movie_info_part">

                            {/* 🎬 배경 이미지 설정 */}
                            <MovieBackground selectedMovie={selectedMovie} />

                            {/* 🎬 영화 상세 정보 */}
                            <div className="detail_part">
                                <div className="text_part">
                                    <Mdetail selectedMovie={selectedMovie} />
                                </div>
                                <div className="poster_part">
                                    <Moimg
                                        selectedMovie={selectedMovie}
                                        socket={socket}
                                        isWaitingForResponse={isWaitingForResponse}
                                        setIsModalOpen={setIsModalOpen}
                                    />
                                </div>
                            </div>
                            {/* 영화 추천 목록 (movlist) */}
                            <div className="movie_part">
                                <Movierec movie_list={movies}
                                          onMovieSelect={onMovieSelect}
                                          isModalOpen={isModalOpen}/>
                            </div>
                        </div>
                        {/* 구매 모달 */}
                        <WatchNowModal isOpen={isModalOpen}
                                       onClose={()=> setIsModalOpen(false)}
                                       selectedMovie={selectedMovie}
                                       socket={socket}/>
                    </div>
            } />
            </Routes>
        );
}

export default App;

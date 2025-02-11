import React, { useState } from "react"; 
import { BrowserRouter } from 'react-router-dom';
import Chat from './components/chatbot/chat';
import Mdetail from './components/details/modetail';
import Movierec from './components/movie_list/movlist';
import Moimg from './components/poster/moimg';

import './App.css';

function App() {
    // 추천 영화 목록을 저장할 상태
    const [response, setResponse] = useState([]);
    // 선택된 영화 정보를 저장할 상태
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Chat에서 받은 영화 추천 데이터를 저장하는 함수
    const onMovieRecommendation = (responseData) => {
        setResponse(responseData); // 서버 응답을 받아 상태에 저장
    };

    // 영화 선택 시 호출되는 함수
    const onMovieSelect = (movie) => {
        setSelectedMovie(movie); // 선택된 영화 정보를 상태에 저장
    };

    return (
        <BrowserRouter>
            <div className="container">
                
                <div className="chats_part">
                    <Chat onMovieRecommendation={onMovieRecommendation} />
                </div>

                <div className="movie_info_part">
                    <div className="movie_part">
                        <Movierec response={response} onMovieSelect={onMovieSelect} />
                    </div>

                    <div className="detail_part">
                        <Mdetail />
                    </div>

                    <div className="moimg_part">
                        <Moimg response={selectedMovie} />
                    </div>
                </div>

            </div>
        </BrowserRouter>
    );
}

export default App;

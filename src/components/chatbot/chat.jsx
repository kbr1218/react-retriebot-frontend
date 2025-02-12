// chat.jsx
import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"

import "./chat.css"
import "./chat_bubbles.css"

import Mdetail from "../details/modetail"
import Moimg from "../poster/moimg"

const Chat = ({onMovieRecommendation}) => {
  const { user_id } = useParams();
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)

  // 스크롤 제어
  const messagesEndRef = useRef(null);
  const serverUrl = `ws://192.168.0.159:8001/${user_id}/chat`

  useEffect(() => {
    if (!user_id) return;

    const ws = new WebSocket(serverUrl);

    // 웹소켓 연결 요청
    ws.onopen = () => {
      console.log(`웹소켓 연결 성공, ${serverUrl}`)
      setSocket(ws)

      // 리트리봇의 첫 메시지
      const initialMessage = {
        text: `안녕하세요.  \n저는 **영화를 추천하는 리트리봇**이에요! 
          \n🎥오늘은 어떤 영화를 보고싶으세요?  
          \n보고싶은 영화에 대해 설명해주시면 제가 영화를 물어올게요 멍멍!🐶`,
        isBot: true,
      }
      setMessages([initialMessage]);
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        console.log("서버 응답:", response)

        // 응답에 추천받은 영화가 있다면
        if (response.movies) {
          // 추천 영화 목록 반환
          const moviesArray = Object.values(response.movies); // 객체를 배열로 변환
          console.log("🎬 변환된 movies 배열 (chat.jsx):", moviesArray);

          setMovies(moviesArray);
          onMovieRecommendation(moviesArray);
        }
        
        if (response.answer) {
          const botMessage = response.answer;
          const time = getCurrentTime();

          setMessages((prevMessages) => [
            ...prevMessages,
            {text: botMessage, isBot: true, timestamp: time}
          ]);
        }
      } catch (error) {
        console.error("메시지 처리 중 오류 발생", error)
      }
    };

    ws.onerror = (error) => {
      console.error("웹소켓 에러:", error);
    };
    ws.onclose = () => {
      console.log("웹소켓 연결 종료")
    }

    return () => {
      ws.close();
    };
  }, [serverUrl, user_id]);

  // 메시지가 추가될 때 스크롤을 가장 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 현재 시간을 저장하는 함수
  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}`
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        user_input: inputMessage,
      };
      
      // 시간 출력
      const time = getCurrentTime();

      socket.send(JSON.stringify(messagePayload));                        // Send data
      setMessages([...messages,
                  { text: inputMessage, isBot: false , timestamp: time},
      ]);  // Append user message
      setInputMessage("");  // Clear input
    }
  };

  return (
    <div className="chatbox">
      <div className="header">
        <img className="hellovision_logo" src="/img/CI_White.png" alt="hellovision_logo"/>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}
            className={`message ${message.isBot ? "received" : "sent"}`}>
            {message.isBot && (<img className="avatar" src="img/retriebot.png" alt="RetrieBot" />)}
            <div className="message_container">
              <div className="content">
                {message.isBot ? <ReactMarkdown>{message.text}</ReactMarkdown> : message.text}
              </div>
              <span className={`time ${message.isBot ? "bot_time" : "user_time"}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 자동 스크롤 */}
      </div>

      <div className="input">
        <button className="mic_btn">
          <FaMicrophone />
        </button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="리트리봇에게 메시지를 보내세요."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
        />
        <button className="send_btn" onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  )
}

export default Chat


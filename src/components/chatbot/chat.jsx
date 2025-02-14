// chat.jsx
import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"

import "./chat.css"
import "./chat_bubbles.css"
import "./chat_loading.css"

const Chat = ({onMovieRecommendation, socket, isWaitingForResponse, setIsWaitingForResponse }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  // 스크롤 제어
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleSocketOpen = () => {
      console.log(">>>>>> 웹소켓 연결됨, 첫 메시지 전송");

      const initialMessage = {
        text: `안녕하세요.  \n저는 **영화를 추천하는 리트리봇**이에요! 
        \n🎥 오늘은 어떤 영화를 보고 싶으세요?  
        \n보고 싶은 영화에 대해 설명해 주시면 제가 추천해드릴게요! 🐶`,
        isBot: true,
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, initialMessage]);
    };

    const handleMessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        console.log(">>>>>> 수신된 데이터:", response);

        // 응답에 추천받은 영화가 있다면
        if (response.movies) {
          // 추천 영화 목록 반환
          const moviesArray = Object.values(response.movies); // 객체를 배열로 변환
          console.log(">>>>>> 변환된 movies 배열 (chat.jsx):", moviesArray);

          // setMovies(moviesArray);
          onMovieRecommendation(moviesArray);
        }
        
        if (response.answer) {
          const botMessage = {
            text: response.answer,
            isBot: true,
            timestamp: getCurrentTime(),
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
        setIsWaitingForResponse(false);  // 응답을 받으면 다시 입력 가능하도록
      } catch (error) {
        console.error("메시지 처리 중 오류 발생", error)
        setIsWaitingForResponse(false);  // 오류 발생 시 다시 입력이 가능하도록 복구
      }
    };
    socket.addEventListener("open", handleSocketOpen);
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleSocketOpen);
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

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
      socket.send(JSON.stringify(messagePayload));                        // Send data

      const userMessage = {
        text: inputMessage,
        isBot: false,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");  // Clear input
      setIsWaitingForResponse(true);
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
                {message.isBot ? <ReactMarkdown breaks={true}>{message.text}</ReactMarkdown> : message.text}
              </div>
              <span className={`time ${message.isBot ? "bot_time" : "user_time"}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        {/* 로딩중 */}
        {isWaitingForResponse && (
          <div className="loader-container">
            <div className="loader"></div>
              <p className="loader-text">리트리봇이 영화를 물고 오는 중...🦴</p>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* 자동 스크롤 */}
      </div>

      <div className="input">
        <button className="mic_btn" disabled={isWaitingForResponse}>
          <FaMicrophone />
        </button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="리트리봇에게 메시지를 보내세요."
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isWaitingForResponse) {
              handleSendMessage()
            }
          }}
          disabled={isWaitingForResponse}     // 입력필드 비활성화
        />
        <button className="send_btn" onClick={handleSendMessage} disabled={isWaitingForResponse}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  )
}

export default Chat


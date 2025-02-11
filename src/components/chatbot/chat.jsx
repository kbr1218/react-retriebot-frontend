// chat.jsx
import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"

import "./chat.css"
import "./chat_bubbles.css"

import Mdetail from "../details/modetail"
import Movierec from "../movie_list/movlist"
import Moimg from "../poster/moimg"

const Chat = ({onMovieRecommendation}) => {
  const { user_id } = useParams();
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)

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
        text: "안녕하세요. 저는 영화를 물어다 줄 리트리봇이에요! 오늘은 어떤 영화를 보고싶으세요? 보고싶은 영화에 대해 설명해주시면 제가 찾아올게요  멍🐶",
        isBot: true,
      }
      setMessages([initialMessage]);
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        console.log("서버 응답:", response)

        if (response.movies) {
          onMovieRecommendation(response)
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
        console.erroe("메시지 처리 중 오류 발생", error)
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
  // const onMovieRecommendation = (response) => {
  //   if (response && response.movies) {
  //     const moviesList = Object.values(response.movies)
  //     setMovies(moviesList)
  //   }
  // }
        // const time = getCurrentTime()
        // let botMessage = ""

        // if (response.answer && typeof response.answer === "string" && response.answer.trim()) {
        //   botMessage = response.answer
        // } else if (response.movies) {
        //   botMessage = "추천된 영화 목록이 있습니다."
        // } else {
        //   console.error("response answer:", response)
        //   return
        // }

    //     setMessages((prevMessages) => [...prevMessages, { text: botMessage, isBot: true, timestamp: time }])
    //   } catch (error) {
    //     console.error("메시지 처리 중 오류 발생:", error, "응답 데이터:", event.data)
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { text: "서버 응답을 처리하는 중 문제가 발생했습니다.", isBot: true, timestamp: getCurrentTime() },
    //     ])
    //   }
    // }


  // const handleSendMessage = () => {
  //   if (inputMessage.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
  //     const time = getCurrentTime()
  //     const newMessage = { text: inputMessage, isBot: false, timestamp: time }
  //     setMessages((prevMessages) => [...prevMessages, newMessage])

  //     const messagePayload = {
  //       event: "send_message",
  //       user_input: inputMessage,
  //       user_id: userId,
  //     }

  //     try {
  //       socket.send(JSON.stringify(messagePayload))
  //       setInputMessage("")

  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: "추천을 분석 중이에요.! 조금만 기다려 주세요..", isBot: true, timestamp: time, isLoading: true },
  //       ])
  //     } catch (error) {
  //       console.error("메시지 전송 중 오류 발생:", error)
  //     }
  //   }
  // }

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
              <div className="content">{message.text}</div>
              <span className={`time ${message.isBot ? "bot_time" : "user_time"}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
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

      {movies.length > 0 && (
        <>
          <Mdetail response={movies} />
          <Movierec response={movies} onMovieSelect={setSelectedMovie} />
          {movies[0] && <Moimg response={movies[0]} />}
        </>
      )}
    </div>
  )
}

export default Chat


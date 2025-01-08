import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// 영화 상영 스케줄 조회
export const getSchedule = async (movieId) => {
    try {
      // 영화 ID로 상영 스케줄을 조회하는 GET 요청
      const response = await axios.get(`${API_BASE_URL}/schedule`, {
        params: { movieId } // movieId를 쿼리 파라미터로 전송
      });
      return response.data; // 상영 스케줄 목록 반환
    } catch (error) {
      console.error('영화 상영 스케줄을 가져오는 데 실패했습니다:', error);
      throw new Error('영화 상영 스케줄을 가져오는 데 실패했습니다.');
    }
  };
  
  // 특정 상영 스케줄의 예약된 좌석 조회
  export const getReservedSeats = async (scheduleId) => {
    try {
      // scheduleId로 예약된 좌석을 조회하는 GET 요청
      const response = await axios.get(`${API_BASE_URL}/reservedSeat`, {
        params: { scheduleId } // scheduleId를 쿼리 파라미터로 전송
      });
      return response.data; // 예약된 좌석 목록 반환
    } catch (error) {
      console.error('예약된 좌석을 가져오는 데 실패했습니다:', error);
      throw new Error('예약된 좌석을 가져오는 데 실패했습니다.');
    }
  };
  
  // 영화 예약 처리
  export const makeReservation = async (reservationData) => {
    try {
      // 영화 예약을 처리하는 POST 요청
      const response = await axios.post(`${API_BASE_URL}/reserve`, reservationData);
      return response.data; // 예약 성공 메시지 또는 실패 메시지 반환
    } catch (error) {
      console.error('영화 예약 처리 중 오류가 발생했습니다:', error);
      throw new Error('영화 예약에 실패했습니다.');
    }
  };
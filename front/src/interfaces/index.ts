import { CreateMeetingRoom } from "@/base/addmeeting";
import { UpdateMeetingRoom } from "@/base/updatemeeting";
import { RegisterUser } from "@/view/register";
import { SearchBooking } from "@/view/reservationManagement";
import axios from "axios";
import dayjs from "dayjs";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if(accessToken) {
      config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})

// 添加请求拦截器
axiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
      const { data, config } = error.response;

      if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {
          
          const res = await refreshToken();

          if(res.status === 200 || res.status === 201) {
              return axiosInstance(config);
          } else {
              alert(res.data);

              setTimeout(() => {
                  window.location.href = '/login';
              }, 1500);
          }
          
      } else {
          return error.response;
      }
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('No response received:', error.request);
    } else {
      // 在设置请求时发生了一些事情，触发了错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);


// 登录接口
export async function login(username: string, password: string) {
  return await axiosInstance.post('/user/admin/login', {
      username, password
  });
}

// 注册验证码接口
export async function registerCaptcha(email: string) {
  return await axiosInstance.get('/user/register-captcha', {
      params: {
          address: email
      }
  });
}

// 注册接口
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/register', registerUser);
}


async function refreshToken() {
  const res = await axiosInstance.get('/user/admin/refresh', {
      params: {
        refresh_token: localStorage.getItem('refresh_token')
      }
  });
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res;
}

// 用户列表接口
export async function userSearch(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
  return await axiosInstance.get('/user/list', {
      params: {
          username,
          nickName,
          email,
          pageNo,
          pageSize
      }
  });
}


// 会议室列表接口
export async function meetingRoomList(name: string, capacity: number, equipment: string, pageNo: number, pageSize: number) {
  return await axiosInstance.get('/meeting-room/list', {
      params: {
          name,
          capacity,
          equipment,
          pageNo,
          pageSize
      }
  });
}

//添加会议室接口
export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
  return await axiosInstance.post('/meeting-room/create', meetingRoom);
}

//删除会议室接口
export async function deleteMeetingRoom(id: number) {
  return await axiosInstance.delete('/meeting-room/' + id);
}


export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
  return await axiosInstance.put('/meeting-room/update', meetingRoom);
}

export async function findMeetingRoom(id: number) {
  return await axiosInstance.get('/meeting-room/' + id);
}


export async function bookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {

  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;
  
  if(searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
      const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
      const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
      bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()
  }

  if(searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
      const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
      const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
      bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()
  }

  return await axiosInstance.get('/booking/list', {
      params: {
          username: searchBooking.username,
          meetingRoomName: searchBooking.meetingRoomName,
          meetingRoomPosition: searchBooking.meetingRoomPosition,
          bookingTimeRangeStart,
          bookingTimeRangeEnd,
          pageNo: pageNo,
          pageSize: pageSize
      }
  });
}

export async function apply(id: number) {
  return await axiosInstance.get('/booking/apply/' + id);
}

export async function reject(id: number) {
  return await axiosInstance.get('/booking/reject/' + id);
}

export async function unbind(id: number) {
  return await axiosInstance.get('/booking/unbind/' + id);
}


export async function freeze(id: number) {
  return await axiosInstance.get('/user/freeze', {
      params: {
          id
      }
  });
}

export async function meetingRoomUsedCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/meetingRoomUsedCount', {
      params: {
          startTime,
          endTime
      }
  });
}

export async function userBookingCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/userBookingCount', {
      params: {
          startTime,
          endTime
      }
  });
}

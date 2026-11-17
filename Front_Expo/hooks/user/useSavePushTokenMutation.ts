import { savePushToken } from "@/api/user/savePushToken";
import { useMutation } from "@tanstack/react-query";

export function useSavePushTokenMutation() {
  return useMutation({
    mutationFn: savePushToken,
    onSuccess: () => {
      console.log("FCM 디바이스 푸시 토큰이 장고 서버에 동기화되었습니다.");
    },
    onError: (err: any) => {
      console.log(err.response?.data || err.message);
    },
  });
}

import { client } from "@/api/client";
import { SocialLoginData } from "@/types/SocialLoginData";

export async function socialLoginApi(socialData: SocialLoginData) {
  const response = await client.post(`user/${socialData.provider}/login/`, {
    token: socialData.token,
  });
  return response.data;
}

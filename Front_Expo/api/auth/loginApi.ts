import { client } from "@/api/client";
import { LoginData } from "@/types/LoginData";



export async function loginApi(loginData: LoginData) {
  const response = await client.post("user/login/", loginData);
  return response.data;
}
import { client } from "@/api/client"; 
import { SignupData } from "@/types/SignupData";


export async function signupApi(signupData: SignupData) {
  const response = await client.post("user/signup/", signupData);
  return response.data;
}
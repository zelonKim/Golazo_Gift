import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId:
      "520508328364-1mhi8jtom62gn4kvhlupbm08hpa92n29.apps.googleusercontent.com",
    iosClientId:
      "520508328364-371ttf20f36iumci7k0q2lht6om5g0u3.apps.googleusercontent.com",
    offlineAccess: true,
  });
}

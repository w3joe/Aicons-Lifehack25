import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user");
    if (jsonValue != null) {
      const user = JSON.parse(jsonValue);
      return user;
    }
    return null;
  } catch (e) {
    console.error("Error retrieving user from storage:", e);
    return null;
  }
};

export const getRoleFromToken = (savedToken : string) => {
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        return payload.role;
      } catch (error) {
        console.error("Token çözülürken hata oluştu:", error);
      }
    }
    return null;
  };
  
  export default getRoleFromToken;
  
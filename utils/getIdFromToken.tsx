const getIdFromToken = (savedToken: string) => {
  if(savedToken){
    try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        return payload.sub;
    } catch (error) {
        console.error("Token çözülemedi:", error);
    }
  }
  return null;
};

export default getIdFromToken;


const AuthBackground = () => {
  const background = 'https://th.bing.com/th/id/OIP.hCvXOC0lqFz7PqIkqmAXfQHaES?w=560&h=324&rs=1&pid=ImgDetMain';

  return (
    <img
      src={background}
      alt="Background"
      style={{
        position: 'absolute',
        filter: 'blur(5px)',
        zIndex: -1,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        objectFit: 'cover'
      }}
    />
  );
};

export default AuthBackground;
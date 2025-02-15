const LoadingSpinner = ({ size = "1.5rem" }) => {
  return (
    <center>
      <div
        className="spinner-border"
        style={{
          width: size,
          height: size,
          borderRightColor: "transparent",
        }}
        role="status"
      />
    </center>
  );
};

export default LoadingSpinner;

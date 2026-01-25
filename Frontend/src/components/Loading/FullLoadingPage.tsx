import { useLottie } from "lottie-react";
import loadingAnimation from "../../assets/Loader.json";

const FullLoadingPage = () => {
  const options = {
    animationData: loadingAnimation,
    loop: true,
    style: {
      height: 100,
      width: 100,
    },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="flex h-full w-full justify-center items-center text-slate-800">
      {View}
    </div>
  );
};

export default FullLoadingPage;

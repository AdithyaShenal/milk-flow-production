import { Loader } from "lucide-react";

const LoadingPage = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10"></Loader>
      </div>
    </>
  );
};

export default LoadingPage;

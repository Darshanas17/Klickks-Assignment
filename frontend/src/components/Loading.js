import { BeatLoader } from "react-spinners";
import "../App.css";

const Loading = () => (
  <div className="loading-container">
    <BeatLoader color="#1a73e8" loading={true} size={15} />
  </div>
);

export default Loading;

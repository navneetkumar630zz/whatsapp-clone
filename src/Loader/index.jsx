import { CircularProgress } from "@material-ui/core";
import "./style.css";

function Loader() {
  return (
    <div className='loader'>
      <div className='loader__container'>
        <div className='loader__logo'>
          <img src='/logo192.png' alt='logo' />
        </div>
        <div className='loader__progress'>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
}

export default Loader;

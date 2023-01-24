import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useDispatch } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';
import { HomeBackground, Button, Polygon } from '../components';
import useLoading from '../hooks/useLoading';
import useGameConsole from '../hooks/useGameConsole';
import '../style/home.scss';
import { SET_ROOM_ID } from '../redux/reducer/gameConsoleReducer';

export default function Home() {
  const navigate = useNavigate();
  const { startLoading } = useLoading();
  const gameConsole = useGameConsole();
  const dispatch = useDispatch();

  const startParty = async () => {
    await startLoading();
    try {
      const roomId = await gameConsole.starParty();
      console.log(`[ startParty ] roomId : `, roomId);
      dispatch(SET_ROOM_ID(roomId));

      // 開啟派對成功 跳轉console
      navigate('/console');
    } catch (error) {
      console.error(`[ startParty ] err : `, error);
      toast.error('建立派對失敗');
    }
  };

  return (
    <>
      <HomeBackground className="absolute inset-0">
        <Polygon
          className="bg-polygon-lt"
          size="50rem"
          fill="fence"
          shape="square"
          rotate="30deg"
          opacity="0.1"
          color="#e09c48"
        />
        <Polygon
          className="bg-polygon-rb"
          size="80rem"
          fill="spot"
          shape="round"
          rotate="30deg"
          opacity="0.1"
          color="#f0a53c"
        />
      </HomeBackground>
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-20">
        <Button
          onClick={startParty}
          className="menu-btn"
          label="建立派對"
          labelHoverColor="#ff9a1f"
          strokeColor="#856639"
          strokeHoverColor="white"
          buttonContentStyle="btn-content absolute inset-0"
        >
          <Polygon
            className="absolute btn-polygon-lt"
            size="14rem"
            shape="round"
            fill="spot"
          />
          <SportsEsportsIcon
            className="absolute game-icon"
            sx={{ color: 'white', fontSize: '8rem' }}
          />
        </Button>
        <Button
          className="menu-btn"
          label="加入遊戲"
          labelHoverColor="#ff9a1f"
          strokeColor="#856639"
          strokeHoverColor="white"
          buttonContentStyle="btn-content absolute inset-0"
        >
          <Polygon
            className="absolute btn-polygon-lt"
            size="14rem"
            rotate="144deg"
            shape="pentagon"
          />
          <PersonAddIcon
            className="absolute join-icon"
            sx={{ color: 'white', fontSize: '7.8rem' }}
          />
        </Button>
      </div>
    </>
  );
}

import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Background, Button, Polygon } from '../components';
import useLoading from '../hooks/useLoading';
import '../style/home.scss';
import useSocket from '../hooks/useSocket';

export default function Home() {
  const navigate = useNavigate();
  const { startLoading } = useLoading();
  const { connect } = useSocket();

  const startParty = async () => {
    await startLoading();
    connect('game-console');
    navigate('/console');
  };

  return (
    <>
      <Background className="absolute inset-0">
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
      </Background>
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-20">
        <Button
          onClick={startParty}
          className="menu-btn"
          label="建立派對"
          labelHoverColor="#ff9a1f"
          strokeColor="#856639"
          strokeHoverColor="white"
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

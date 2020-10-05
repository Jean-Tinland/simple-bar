import { MicOn, MicOff } from './Icons.jsx';
import { run } from 'uebersicht'

const Mic = ({ output }) => {
  if (!output) return;
  const { volume } = output;

  const Icon =
    volume !== '0' ? MicOn : MicOff;

  const toggleMode = () => {
    if (volume === '0') {
      run('osascript -e \'set volume input volume 100\'')
    } else {
      run('osascript -e \'set volume input volume 0\'')
    }
  }

  return (
    <div className="mic" onClick={toggleMode}>
      <Icon className="mic__icon" />
      {volume}%
    </div>
  );
};

export default Mic;

import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { StatusBar } from './statusBar';
import { Spotlight } from './spotlight';

function App() {
  return (
    <div style={{ background: '#060910', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <StatusBar />
      <Spotlight />
    </div>
  );
}

export default App;
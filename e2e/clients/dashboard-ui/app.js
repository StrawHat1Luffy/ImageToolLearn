import ImageToolLearn from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import RemoteSources from '@ImageToolLearn/remote-sources'
import Webcam from '@ImageToolLearn/webcam'
import ScreenCapture from '@ImageToolLearn/screen-capture'
import GoldenRetriever from '@ImageToolLearn/golden-retriever'
import ImageEditor from '@ImageToolLearn/image-editor'
import DropTarget from '@ImageToolLearn/drop-target'
import Audio from '@ImageToolLearn/audio'
import Compressor from '@ImageToolLearn/compressor'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

const COMPANION_URL = 'http://companion.ImageToolLearn.io'

const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, { target: '#app', inline: true })
  .use(RemoteSources, { companionUrl: COMPANION_URL })
  .use(Webcam, {
    target: Dashboard,
    showVideoSourceDropdown: true,
    showRecordingLength: true,
  })
  .use(Audio, {
    target: Dashboard,
    showRecordingLength: true,
  })
  .use(ScreenCapture, { target: Dashboard })
  .use(ImageEditor, { target: Dashboard })
  .use(DropTarget, { target: document.body })
  .use(Compressor)
  .use(GoldenRetriever, { serviceWorker: true })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn

import ImageToolLearn from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import Compressor from '@ImageToolLearn/compressor'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, {
    target: document.body,
    inline: true,
  })
  .use(Compressor, {
    mimeType: 'image/webp',
  })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn

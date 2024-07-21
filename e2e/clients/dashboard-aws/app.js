import { ImageToolLearn } from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import AwsS3 from '@ImageToolLearn/aws-s3'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, { target: '#app', inline: true })
  .use(AwsS3, {
    limit: 2,
    companionUrl: process.env.VITE_COMPANION_URL,
  })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn

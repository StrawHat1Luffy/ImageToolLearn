/* eslint-disable react/react-in-jsx-scope */
import ImageToolLearn from '@ImageToolLearn/core'
/* eslint-disable-next-line no-unused-vars */
import React, { useState } from 'react'
import { Dashboard, DashboardModal, DragDrop } from '@ImageToolLearn/react'
import ThumbnailGenerator from '@ImageToolLearn/thumbnail-generator'
import RemoteSources from '@ImageToolLearn/remote-sources'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'
import '@ImageToolLearn/drag-drop/dist/style.css'

export default function App () {
  const RemoteSourcesOptions = {
    companionUrl: 'http://companion.ImageToolLearn.io',
    sources: ['GoogleDrive', 'OneDrive', 'Unsplash', 'Zoom', 'Url'],
  }
  const ImageToolLearnDashboard = new ImageToolLearn({ id: 'dashboard' }).use(RemoteSources, { ...RemoteSourcesOptions })
  const ImageToolLearnModal = new ImageToolLearn({ id: 'modal' })
  const ImageToolLearnDragDrop = new ImageToolLearn({ id: 'drag-drop' }).use(ThumbnailGenerator)
  const [open, setOpen] = useState(false)

  // drag-drop has no visual output so we test it via the ImageToolLearn instance
  window.ImageToolLearn = ImageToolLearnDragDrop

  return (
    <div style={{ maxWidth: '30em', margin: '5em 0', display: 'grid', gridGap: '2em' }}>
      <button type="button" id="open" onClick={() => setOpen(!open)}>
        Open Modal
      </button>

      <Dashboard id="dashboard" ImageToolLearn={ImageToolLearnDashboard} />
      <DashboardModal id="modal" open={open} ImageToolLearn={ImageToolLearnModal} />
      <DragDrop id="drag-drop" ImageToolLearn={ImageToolLearnDragDrop} />
    </div>
  )
}

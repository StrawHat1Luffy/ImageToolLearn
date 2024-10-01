describe('@ImageToolLearn/react', () => {
  beforeEach(() => {
    cy.visit('/react')
    cy.get('#dashboard .ImageToolLearn-Dashboard-input:first').as('dashboard-input')
    cy.get('#modal .ImageToolLearn-Dashboard-input:first').as('modal-input')
    cy.get('#drag-drop .ImageToolLearn-DragDrop-input').as('dragdrop-input')
  })

  it('should render Dashboard in React and show thumbnails', () => {
    cy.get('@dashboard-input').selectFile(
      [
        'cypress/fixtures/images/kit.jpg',
        'cypress/fixtures/images/traffic.jpg',
      ],
      { force: true },
    )
    cy.get('#dashboard .ImageToolLearn-Dashboard-Item-previewImg')
      .should('have.length', 2)
      .each((element) => expect(element).attr('src').to.include('blob:'))
  })

  it('should render Dashboard with Remote Sources plugin pack', () => {
    const sources = [
      'My Device',
      'Google Drive',
      'OneDrive',
      'Unsplash',
      'Zoom',
      'Link',
    ]
    cy.get('#dashboard .ImageToolLearn-DashboardTab-name').each((item, index, list) => {
      expect(list).to.have.length(6)
      // Returns the current element from the loop
      expect(Cypress.$(item).text()).to.eq(sources[index])
    })
  })

  it('should render Modal in React and show thumbnails', () => {
    cy.get('#open').click()
    cy.get('@modal-input').selectFile(
      [
        'cypress/fixtures/images/kit.jpg',
        'cypress/fixtures/images/traffic.jpg',
      ],
      { force: true },
    )
    cy.get('#modal .ImageToolLearn-Dashboard-Item-previewImg')
      .should('have.length', 2)
      .each((element) => expect(element).attr('src').to.include('blob:'))
  })

  it('should render Drag & Drop in React and create a thumbail with @ImageToolLearn/thumbnail-generator', () => {
    const spy = cy.spy()

    // eslint-disable-next-line
    // @ts-ignore fix me
    cy.window().then(({ ImageToolLearn }) => ImageToolLearn.on('thumbnail:generated', spy))
    cy.get('@dragdrop-input').selectFile(
      [
        'cypress/fixtures/images/kit.jpg',
        'cypress/fixtures/images/traffic.jpg',
      ],
      { force: true },
    )
    // not sure how I can accurately wait for the thumbnail
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000).then(() => expect(spy).to.be.called)
  })
})

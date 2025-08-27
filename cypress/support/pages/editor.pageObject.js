import PageObject from '../PageObject';

class EditorPageObject extends PageObject {
  url = '/#/editor';

  get titleField() { return cy.getByDataCy('editor-title'); }
  get aboutField() { return cy.getByDataCy('editor-description'); }
  get bodyField() { return cy.getByDataCy('editor-body'); }
  get tagsField() { return cy.getByDataCy('editor-tags'); }
  get publishBtn() { return cy.getByDataCy('editor-publish'); }

  typeTitle(v){ this.titleField.clear().type(v); }
  typeAbout(v){ this.aboutField.clear().type(v); }
  typeBody(v){ this.bodyField.clear().type(v); }
  typeTags(v){ this.tagsField.clear().type(v); }
  publish(){ this.publishBtn.click(); }
}
export default EditorPageObject;

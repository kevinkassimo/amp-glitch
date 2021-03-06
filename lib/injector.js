const {By, until, ThenableWebDriver} = require('selenium-webdriver');
const helper = require('./helper');

/**
 * Inject DOM attributes that gives hint about whether an amp-img has finished loading
 */
class AmpImgInjector {
  /**
   * Create the injector
   * @param {ThenableWebDriver} browser driver
   */
  constructor(browser) {
    this.browser = browser;
    this.SIG_ATTR = 'amper-amp-img-loaded';
  }

  /**
   * Inject load script that helps create DOM attribute for observation
   */
  async injectLoadScript() {
    await this.browser.executeScript(function () {
      // On image load event, install test-loaded attribute
      document.body.addEventListener('load', function(event) {
        if (event.target.tagName === 'IMG') {
          let img = event.target;
          window.requestAnimationFrame(function() {
            img.setAttribute('amper-amp-img-loaded', true);
          });
        }
      }, true); // Notice this is capture

      var imgs = [].slice.call(document.querySelectorAll('img'));
      imgs.filter(function(img) {
        return img.naturalWidth > 0;
      }).forEach(function(img) {
        let _img = img;
        window.requestAnimationFrame(function() {
          _img.setAttribute('amper-amp-img-loaded', true);
        });
      });
    });
  }

  /**
   * Wait for img inside of AmpImg to actually load
   * @param {string} selector CSS selector for the element
   */
  async waitForLoad(selector) {
    await this.browser.wait(until.elementLocated(By.css(`${selector} [${this.SIG_ATTR}]`)));
    await helper.wait.whileLocated(this.browser, `${selector} [placeholder]`);
  }
}

module.exports = {
  AmpImgInjector,
};

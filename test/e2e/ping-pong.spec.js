describe('users should communicate', function() {
  it('should do something with two browser', function() {
      this.timeout(60000);
      myChromeBrowser.url('http://localhost:3000');
      console.log(myChromeBrowser.getTitle()); // returns {myChromeBrowser: 'Google', myFirefoxBrowser: 'Google'}
      myChromeBrowser.setValue('.usernameInput', 'chrome');
      myChromeBrowser.keys('Return');
      myChromeBrowser.waitForExist('.log', 15000);
      myChromeBrowser.waitUntil(function() {
        return myChromeBrowser.getText('.log').join(' ').indexOf('participant') >= 0;
      }, 15000, 'expected myChromeBrowser to join');
      myFirefoxBrowser.url('http://localhost:3000');
      console.log(myFirefoxBrowser.getTitle()); // return 'Yahoo'
      myFirefoxBrowser.setValue('.usernameInput', 'firefox');
      myFirefoxBrowser.keys('Return');
      myFirefoxBrowser.waitForExist('.log', 15000);
      myChromeBrowser.waitUntil(function() {
        return myChromeBrowser.getText('.log').join(' ').indexOf('firefox joined') >= 0;
      }, 15000, 'expected firefox to join');
  });
});

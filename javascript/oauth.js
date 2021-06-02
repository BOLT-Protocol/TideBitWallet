window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token);
    });
  });

  //Listen for authorization success
  document.addEventListener('AppleIDSignInOnSuccess', (data) => {
    //handle successful response
    console.log('success:', data);
  });
  //Listen for authorization failures
  document.addEventListener('AppleIDSignInOnFailure', (error) => {
    //handle error.
    console.log('error:', error);
  });
};
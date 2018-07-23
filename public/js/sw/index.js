self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response.status === 404) {
        // TODO: instead, respond with the gif at
        // /imgs/dr-evil.gif
        // using a network request
        return fetch('/imgs/dr-evil.gif');
        // .then(function(img) {  // this part is not really needed; fetch returns a promise
        //   return img;          // whose resolved value will be passed to the outer promise
        // });
      }
      return response;
    }).catch(function() {
      return new Response("Uh oh, that totally failed!");
    })
  );
});

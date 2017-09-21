(function() { // outer IIFE

  var delay = (function(){ // Closure for shared timer
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  document.querySelector('#search').addEventListener('input', function() {
    var that = this;
    delay(function() {
      var params = {
        q: that.value,
        projection: 'lite',
        printType: 'books',
        maxResults: '30'
      };

      var query = encodeParams(params);
      var url = 'https://www.googleapis.com/books/v1/volumes?' + query;

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
          var json = JSON.parse(this.responseText);
          renderBooks(json);
        }
      };

      xhr.open("GET", url, true);
      xhr.send();

    }, 400);
  });

  var suggestions = document.querySelector('#suggestions');

  function renderBooks(json) {
    console.log(json);
    suggestions.innerHTML = '';
    var frag = document.createDocumentFragment();

    json.items.forEach(function(book) {
      var info = book.volumeInfo;
      var col = document.createElement('div');
      col.classList.add('col-6');
      col.classList.add('col-sm-4');
      col.classList.add('col-md-3');
      col.classList.add('col-xl-2');

      var card = document.createElement('div');
      card.classList.add('card');
      card.classList.add('mb-2');

      var img = document.createElement('img');
      img.classList.add('card-img-top');
      img.setAttribute('src', (info.imageLinks ? info.imageLinks.thumbnail : '/images/book.jpeg'));
      img.setAttribute('alt', info.title);

      var body = document.createElement('div');
      body.classList.add('card-body');

      var title = document.createElement('h6');
      title.classList.add('card-title');
      title.innerHTML = info.title + (info.authors ? ('<br/><small class="text-muted">by ' + info.authors.join(', ') + ' </small>') : '');

      var button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('btn-primary');
      button.setAttribute('data-title', info.title);
      button.setAttribute('data-authors', JSON.stringify(info.authors));
      button.setAttribute('data-thumbnail', (info.imageLinks ? info.imageLinks.thumbnail : '/images/book.jpeg'));
      button.setAttribute('data-selfLink', book.selfLink);
      button.innerHTML = 'Add book';
      button.addEventListener('click', addBook);

      body.appendChild(title);
      body.appendChild(button);

      card.appendChild(img);
      card.appendChild(body);

      col.appendChild(card);
      frag.appendChild(col);

    });

    suggestions.appendChild(frag);
  };

  function addBook(e) {
    var xhr = new XMLHttpRequest;
    var url = '/add';
    xhr.open('POST', url, true);

    var query = encodeParams({
      title: e.target.getAttribute('data-title'),
      authors: JSON.parse(e.target.getAttribute('data-authors')),
      thumbnail: e.target.getAttribute('data-thumbnail'),
      selfLink: e.target.getAttribute('data-selfLink')
    });

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var id = JSON.parse(this.responseText)['id'];
        window.location.replace('/user/' + id);
      }
    }
    xhr.send(query);
  }

  function encodeParams(params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map(function(k) {return esc(k) + '=' + esc(params[k]);})
      .join('&');
    return query;
  }

})();

var GIPHY_API_URL = 'http://api.giphy.com';
var GIPHY_PUB_KEY = 'q4k1xiFfyXHFEVGeG4SYB8VJsIA5OtQu';

App = React.createClass ({
  
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  handleSearch: function(searchingText) {  //pobiera na wejsciu wpisany tekst
    this.setState ({
      loading: true  // zaczal sie proces ladowania
    });
    var self = this;
    this.getGif(searchingText)
    
      .then(function(gif) {  //Rozpoczyna pobieranie gifa
        self.setState ({  //Na zakonczene pobierania:
          loading: false,  //przestaje sygnalizowac ladowanie
          gif: gif,  //ustawia nowego gifa z wyniku pobierania
          searchingText: searchingText  //ustawia nowy stan dla wyszukiwanego tekstu
        });
      })

      .catch(function(error){;
        console.log(error);
  });
},
  
	getGif: function(searchingText){
		return new Promise (
		function(resolve, reject){
			var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url);
			xhr.onload = function(){
				if (xhr.status === 200){
					var data =JSON.parse(xhr.responseText).data; 
					if (data.type === 'gif'){							
							var gif = {
								url: data.fixed_width_downsampled_url,
								sourceUrl: data.url
							};
						resolve(gif);
					} else {
						reject (new Error('Gif not found'));	
					}
				} else {
					reject (new Error(this.statustext));	
				}
			};
			xhr.send();
		});	
},

  render: function() {

    var styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '90%'
    };

  return (
    <div style={styles}>
        <h1>Wyszukiwarka GIFów</h1>
        <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciśnij enter aby pobrać kolejne gify.</p>
      <Search
        onSearch={this.handleSearch} 
      />
      <Gif
        loading={this.state.loading}
        url={this.state.gif.url}
        sourceUrl={this.state.gif.sourceUrl} 
      />
    </div>
    );
  }
});
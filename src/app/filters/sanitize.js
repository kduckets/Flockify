module.exports = function($sce) {

        return function(htmlCode){
        	//TODO: look for pasted link and hyperlink (use embed filter)


        	 //    var options = {
          //           link      : true,
          //           linkTarget: '_self'
          //       };
        	 // var urlRegex = /\b(?:(https?|ftp|file):\/\/|www\.)[-A-Z0-9+()&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;
          //    var protocolRegex = /^[a-z]+\:\/\//i;
          //    if(htmlCode.indexOf('<img') <= -1){
          //     var strReplaced = htmlCode.replace(urlRegex, function (text) {
          //        var url = text;
          //          if (!protocolRegex.test(text))
          //             {
          //              url = 'http://' + text;
          //              }
          //               htmlCode = '<a href="' + url + '" target="' + options.linkTarget + '">' + text + '</a>';
          //              }
          //           );
          // }
           var p = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
            if(htmlCode.match(p)){
              htmlCode = htmlCode.replace(p,"");
            }

            return $sce.trustAsHtml(htmlCode);
          
        }
    };
module.exports = function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    };
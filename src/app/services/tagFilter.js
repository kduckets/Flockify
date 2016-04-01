module.exports = function () {
 return function (posts, tags) {
        var items = {
            tags: tags,
            out: []
        };
        angular.forEach(posts, function (post, key) {
            if (this.tags[post] === true) {
                this.out.push(post);
            }
        }, items);
        return items.out;
    };
};
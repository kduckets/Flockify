/**
 * Created by davidmerritt on 3/14/16.
 */

var fs = require('fs');
var _ = require('underscore');

// post_info mapper by content_type
content_types = {
  album: {
    spotify_uri: 'share_uri',
    album: 'album',
    artist: 'artist',
    release_date: 'release_date'
  },
  podcast: {
    external_link: 'share_uri',
    link: 'share_uri',
    album: 'name',
    artist: 'producer',
    title: 'title',
    description: 'description',
    release_date: 'release_date'
  },
  ebook: {
    link: 'share_uri',
    title: 'title',
    artist: 'author',
    release_date: 'release_date' // exists?
  },
  'movie/film': {
    album: 'title',
    artist: 'director',
    genre: 'genre',
    imdb_id: 'imdb_id',
    imdb_rate: 'imdb_rating',
    tomato_meter: 'tomato_meter',
    tomato_url: 'tomato_url',
    link: "share_uri",
    release_date: 'release_date'
  }
}

var make_comments_foreign_keys = function(model, model_id, foreign_key) {
  var resp = {};
  var matching_idxs = _.filter(Object.keys(old_db[foreign_key]), function(key) {
    return (key == model_id);
  });
  _.each(matching_idxs, function(idx){
    resp[idx] = true;
  });
  return resp;
};

var make_votes_foreign_keys = function(model, model_id, foreign_key) {
  resp = {};
  var matching_idxs = _.filter(Object.keys(old_db[foreign_key]), function(key) {
    keys = Object.keys(old_db[foreign_key][key]);
    return keys.indexOf(model_id) != -1;
  });
  _.each(matching_idxs, function(idx){
    resp[idx] = true;
  });
  return resp;
};

var map_info_obj = function(model, info_dict) {
  var media_info = {};
  _.each(info_dict, function(target_key, original_key){
    media_info[target_key] = model[original_key];
  });
  return media_info;
};

post_mappings = {
  image_medium: 'image_medium',
  image_small: 'image_small',
  latest_comment: 'latest_comment',
  media_type: 'media_type',
  stars: 'stars',
  votes: 'score',
  creator: 'creator_name',
  creatorUID: 'creator_id'
  // posted_ts
};

// *********************************** START HERE ***************************************
// load the json export of the db
// fs.open
file_contents = fs.readFileSync('db_export.json');
old_db = JSON.parse(file_contents);
//console.log(old_db);
var new_db = {};

// modify to final pattern
// ************************************** POSTS *****************************************
first_group_id = 'firsttoflock';

posts = old_db.posts;
var added = 0;
new_db.posts = {};
new_db.posts[first_group_id] = {};

_.each(posts, function(model, model_id) {
  var new_model = {};
  var media_type = (model.media_type == 'spotify' || model.media_type == undefined) ? 'album' : model.media_type;
  new_model.media_info = map_info_obj(model, content_types[media_type]);
  new_model.comments = make_comments_foreign_keys(model, model_id, 'comments');
  new_model.votes = make_votes_foreign_keys(model, model_id, 'user_votes');
  var flds_to_add = map_info_obj(model, post_mappings);
  _.each(flds_to_add, function(val, key) {
    new_model[key] = val;
  });
  new_db.posts[first_group_id][model_id] = new_model;
});

//console.log(new_db.posts);

// ************************************** GROUPS *****************************************

new_db.groups = {
  'firsttoflock': {
    group_name: 'First Flockers',
    users: {}
  }
};
_.each(Object.keys(old_db['profile']), function(key) {
  new_db.groups[first_group_id]['users'][key] = true;
});
//console.log(new_db.groups);


// ************************************** comments *****************************************

new_db.chats = {};
new_db.chats[first_group_id] = {}
new_db.comments = {};
_.each(old_db.comments, function(models, post_id) {
  _.each(models, function(comment, comment_id) {
    if (comment_id == 'flock_groupchat') {
      return false;
    }
    is_link = comment.text.indexOf("http") != -1;
    if (is_link) {
      // comment
      new_model = {
        creator_id: comment.creatorUID,
        text: comment.text,
        creator_name: comment.creator,
        creation_ts: comment.datetime_ts,
        group_id: first_group_id
      };
      new_db.comments[comment_id] = new_model;
    }else{
      // chat
      new_model = {
        creator_id: comment.creatorUID,
        text: comment.text,
        creator_name: comment.creator,
        creation_ts: comment.datetime_ts,
      };
      new_db.chats[first_group_id][comment_id] = new_model;
    }
  });
});

_.each(old_db.comments.flock_groupchat, function(comment, comment_id) {
  var new_model = {
        creator_id: comment.creatorUID,
        text: comment.text,
        creator_name: comment.creator,
        creation_ts: comment.datetime_ts
  };
  new_db.chats[first_group_id][comment_id] = new_model;
});

//console.log(new_db.chats[first_group_id]);

// ************************************** votes *****************************************

new_db.actions = {};
vote_pks = {};
var added = 0;
// **** save it for later votes need to be added, as do stars *****
_.each(old_db.user_votes, function(votes, user_id) {
  _.each(votes, function(vote, post_id) {
    added += 1;
    new_model = {
      creator_id: user_id,
      post_id: post_id,
      creation_ts: undefined,
      action: vote.vote
    };
    pk = added.toString();
    vote_pks[user_id+post_id] = pk;
    new_db.actions[pk] = new_model;
  })
});
//console.log(new_db.actions);

// ************************************** users *****************************************
new_db.users = {};
_.each(old_db.profile, function(user, user_id) {

  new_model = {
    username: user.username,
    md5_hash: user.md5_hash,
    groups: {
      firsttoflock: true
    },
    actions: {},
    posts: {}
  };

  // add votes fk
  _.each(old_db.user_votes, function(votes, vote_user_id) {
    _.each(votes, function (vote, post_id) {
      if (vote_user_id == user_id) {
        //we need to get the PK from here...
        new_model.actions[vote_pks[user_id + post_id]] = true;
      }
    });
  });

  // add posts FK
  _.each(old_db.posts, function(post, post_id) {
    if (post.creatorUID == user_id) {
      new_model.posts[post_id] = true;
    }
  });
  new_db.users[user_id] = new_model;
});

new_db.user_scores = {};
new_db.user_scores[first_group_id] = {};

_.each(old_db.user_scores, function(scores, username){
  user = _.filter(old_db.profile, function(user_data, user_id){
    user_data.id = user_id;
    return user_data.username == username;
  })[0];
  new_db.user_scores[first_group_id][user.id] = scores;
});

// write final json value
fs.writeFile("db_output.json", JSON.stringify(new_db));
